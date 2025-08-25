from rest_framework import viewsets, status, serializers as rest_serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum, Count
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.db import transaction
import random
import string
from decimal import Decimal
from collections import OrderedDict
from rest_framework.parsers import MultiPartParser, FormParser


from .models import Produit, Client, Abonnement, Commande, Affilie, TicketSupport, MessageTicket, DemandeAffiliation, FaqItem
from .serializers import (
    ProduitSerializer, ClientSerializer, AbonnementSerializer, FaqItemSerializer,
    CommandeSerializer, AffilieSerializer, TicketSupportSerializer, MessageTicketSerializer,
    MyTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ClientRegistrationSerializer,
    CreateAffiliateSerializer,
    DemandeAffiliationSerializer, 
    ClientSubmitAffiliationSerializer
)

# --- Fonctions utilitaires pour les emails ---
def send_welcome_email(user, password):
    context = {
        'user': user,
        'password': password,
        'login_url': f"{settings.FRONTEND_BASE_URL}/compte"
    }
    email_body = render_to_string('crm/emails/welcome_email.html', context)
    send_mail(
        subject='Bienvenue sur IPTV Fasty !',
        message=f"Bienvenue {user.first_name}! Votre mot de passe temporaire est : {password}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=email_body
    )

def send_new_order_to_admin_email(commande):
    context = {'commande': commande}
    email_body = render_to_string('crm/emails/new_order_admin_notification.html', context)
    send_mail(
        subject=f'Nouvelle commande #{commande.id}',
        message=f"Une nouvelle commande a été passée par {commande.client.user.email}.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL]
    )

def send_activation_email(abonnement):
    context = {'abonnement': abonnement}
    email_body = render_to_string('crm/emails/activation_email.html', context)
    send_mail(
        subject=f'Votre abonnement IPTV Fasty est activé !',
        message="Votre abonnement est actif.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[abonnement.client.user.email],
        html_message=email_body
    )

def send_affiliate_request_to_admin(client):
    context = {'client': client}
    email_body = render_to_string('crm/emails/affiliate_request_email.html', context)
    send_mail(
        subject=f'Nouvelle demande d\'affiliation de {client.user.username}',
        message=f"Le client {client.user.username} ({client.user.email}) souhaite devenir un affilié.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=email_body
    )
    
def send_affiliate_approval_email(affilie):
    context = {'affilie': affilie}
    email_body = render_to_string('crm/emails/affiliate_approval_email.html', context)
    send_mail(
        subject='Votre demande d\'affiliation a été approuvée !',
        message=f"Félicitations ! Vous êtes maintenant un affilié. Votre code est : {affilie.code_affiliation}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[affilie.client.user.email],
        html_message=email_body
    )

def send_affiliate_rejection_email(demande):
    context = {'demande': demande}
    email_body = render_to_string('crm/emails/affiliate_rejection_email.html', context)
    send_mail(
        subject='Concernant votre demande d\'affiliation',
        message="Nous vous remercions de l'intérêt que vous portez à notre programme d'affiliation.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[demande.client.user.email],
        html_message=email_body
    )

def send_renewal_reminder_email(abonnement, days_left):
    context = {
        'abonnement': abonnement,
        'days_left': days_left,
        'renewal_url': f"{settings.FRONTEND_BASE_URL}/#plans"
    }
    email_body = render_to_string('crm/emails/renewal_reminder_email.html', context)
    send_mail(
        subject=f'Votre abonnement IPTV expire dans {days_left} jour(s)',
        message=f"Bonjour {abonnement.client.user.first_name}, votre abonnement {abonnement.produit.nom} arrive à expiration.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[abonnement.client.user.email],
        html_message=email_body
    )

# --- Vues API ---

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.select_related('client__user', 'produit', 'affilie_utilise').all().order_by('-date_commande')
    serializer_class = CommandeSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'], url_path='approve')
    @transaction.atomic
    def approve_order(self, request, pk=None):
        commande = self.get_object()
        if commande.statut_paiement == 'paye':
            return Response({'status': 'error', 'message': 'Cette commande a déjà été approuvée.'}, status=status.HTTP_400_BAD_REQUEST)
        
        commande.statut_paiement = 'paye'
        commande.save()

        if commande.affilie_utilise and commande.montant_commission > 0:
            affilie = commande.affilie_utilise
            affilie.solde_commission += commande.montant_commission
            affilie.save()
        
        produit = commande.produit
        date_debut = timezone.now()
        date_fin = date_debut + timedelta(days=produit.duree_jours)
        details_connexion = request.data.get('details_connexion', 'Vos détails de connexion seront fournis sous peu.')

        abonnement = Abonnement.objects.create(
            client=commande.client, produit=produit, date_debut=date_debut,
            date_fin=date_fin, statut='actif', details_connexion=details_connexion
        )
        
        send_activation_email(abonnement)
        return Response({'status': 'success', 'message': f'Commande #{commande.id} approuvée, abonnement créé.'})

class FaqItemViewSet(viewsets.ModelViewSet):
    queryset = FaqItem.objects.all()
    serializer_class = FaqItemSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    def get_queryset(self):
        if not self.request.user.is_staff:
            return FaqItem.objects.filter(actif=True)
        return FaqItem.objects.all()
    
class PublicOrderView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = ClientRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user_data = data['user']
        product_id = data['product_id']
        code_affiliation = data.get('code_affiliation')

        try:
            produit = Produit.objects.get(id=product_id, actif=True)
        except Produit.DoesNotExist:
            return Response({'error': 'Produit non trouvé ou inactif.'}, status=status.HTTP_404_NOT_FOUND)

        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name']
            }
        )

        if created:
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
            user.set_password(password)
            user.save()
            client = Client.objects.create(user=user)
            send_welcome_email(user, password)
        else:
            client, _ = Client.objects.get_or_create(user=user)
            user.first_name = user_data['first_name']
            user.last_name = user_data['last_name']
            user.save()

        client.telephone = data.get('telephone')
        client.adresse = data.get('adresse')
        client.ville = data.get('ville')
        client.code_postal = data.get('code_postal')
        client.pays = data.get('pays')
        client.save()

        affilie = None
        montant_final = produit.prix
        montant_commission = Decimal('0.00')

        if code_affiliation:
            try:
                affilie = Affilie.objects.get(code_affiliation__iexact=code_affiliation)
                reduction = (produit.prix * affilie.pourcentage_commission) / 100
                montant_final = produit.prix - round(reduction, 2)
                montant_commission = round(reduction, 2)
            except Affilie.DoesNotExist:
                pass

        commande = Commande.objects.create(
            client=client,
            produit=produit,
            montant=montant_final,
            statut_paiement='en_attente',
            affilie_utilise=affilie,
            montant_commission=montant_commission
        )
        send_new_order_to_admin_email(commande)
        return Response(CommandeSerializer(commande).data, status=status.HTTP_201_CREATED)

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all().order_by('prix')
    serializer_class = ProduitSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.select_related('user').all()
    serializer_class = ClientSerializer
    permission_classes = [IsAdminUser]

class AbonnementViewSet(viewsets.ModelViewSet):
    queryset = Abonnement.objects.select_related('client__user', 'produit').all()
    serializer_class = AbonnementSerializer
    permission_classes = [IsAdminUser]

class AffilieViewSet(viewsets.ModelViewSet):
    queryset = Affilie.objects.select_related('client__user').all()
    serializer_class = AffilieSerializer
    permission_classes = [IsAdminUser]

class TicketSupportViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSupportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TicketSupport.objects.all().order_by('-date_creation')
        return TicketSupport.objects.filter(client__user=user).order_by('-date_creation')

    def perform_create(self, serializer):
        try:
            client = Client.objects.get(user=self.request.user)
            initial_message = serializer.validated_data.pop('initial_message', '')
            ticket = serializer.save(client=client)
            if initial_message:
                MessageTicket.objects.create(
                    ticket=ticket,
                    auteur=self.request.user,
                    message=initial_message
                )
        except Client.DoesNotExist:
            raise rest_serializers.ValidationError("Le profil client pour cet utilisateur n'a pas été trouvé.")

    @action(detail=True, methods=['post'], url_path='reply')
    def add_reply(self, request, pk=None):
        ticket = self.get_object()
        message_text = request.data.get('message')
        if not message_text:
            return Response({'error': 'Le message ne peut pas être vide.'}, status=status.HTTP_400_BAD_REQUEST)
        
        MessageTicket.objects.create(
            ticket=ticket,
            auteur=request.user,
            message=message_text
        )
        if ticket.statut == 'ferme' and not request.user.is_staff:
            ticket.statut = 'en_cours'
            ticket.save()
            
        return Response(TicketSupportSerializer(ticket).data)

    @action(detail=True, methods=['post'], url_path='close', permission_classes=[IsAuthenticated])
    def close_ticket(self, request, pk=None):
        ticket = self.get_object()
        if not request.user.is_staff and ticket.client.user != request.user:
            return Response({'error': 'Permission non accordée.'}, status=status.HTTP_403_FORBIDDEN)
        ticket.statut = 'ferme'
        ticket.save()
        return Response({'status': 'success', 'message': 'Ticket fermé avec succès.'})

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        total_revenue = Commande.objects.filter(statut_paiement='paye').aggregate(total=Sum('montant'))['total'] or 0
        total_clients = Client.objects.count()
        active_subscriptions = Abonnement.objects.filter(statut='actif').count()
        now = timezone.now()
        new_orders_this_month = Commande.objects.filter(date_commande__year=now.year, date_commande__month=now.month).count()

        monthly_data = OrderedDict()
        months = ["Janv", "Fév", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"]

        for i in range(5, -1, -1):
            year = now.year
            month = now.month - i
            if month <= 0:
                month += 12
                year -= 1
            
            month_name = months[month - 1]
            year_month_key = f"{year}-{month_name}"
            monthly_data[year_month_key] = {'name': month_name, 'revenu': 0, 'clients': 0}

        six_months_ago = now - timedelta(days=180)
        revenue_by_month = Commande.objects.filter(
            statut_paiement='paye',
            date_commande__gte=six_months_ago
        ).extra(select={'month': "strftime('%%m', date_commande)", 'year': "strftime('%%Y', date_commande)"}).values('year', 'month').annotate(total=Sum('montant'))
        
        for record in revenue_by_month:
            month_name = months[int(record['month']) - 1]
            year_month_key = f"{record['year']}-{month_name}"
            if year_month_key in monthly_data:
                monthly_data[year_month_key]['revenu'] = float(record['total'])

        clients_by_month = Client.objects.filter(
            date_creation__gte=six_months_ago
        ).extra(select={'month': "strftime('%%m', date_creation)", 'year': "strftime('%%Y', date_creation)"}).values('year', 'month').annotate(count=Count('id'))
        
        for record in clients_by_month:
            month_name = months[int(record['month']) - 1]
            year_month_key = f"{record['year']}-{month_name}"
            if year_month_key in monthly_data:
                monthly_data[year_month_key]['clients'] = record['count']

        stats = {
            'total_revenue': total_revenue,
            'total_clients': total_clients,
            'active_subscriptions': active_subscriptions,
            'new_orders_this_month': new_orders_this_month,
            'chart_data': list(monthly_data.values())
        }
        return Response(stats)

class ClientDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user = request.user
        client, _ = Client.objects.get_or_create(user=user)
        
        serializer = ClientSerializer(client, context={'request': request})
        data = serializer.data

        try:
            affilie = Affilie.objects.get(client=client)
            data['affiliate'] = AffilieSerializer(affilie).data
        except Affilie.DoesNotExist:
            data['affiliate'] = None

        if not user.is_staff:
            data['dashboard'] = {
                "activeSubscriptions": Abonnement.objects.filter(client=client, statut='actif').count(),
                "openTickets": TicketSupport.objects.filter(client=client, statut__in=['ouvert', 'en_cours']).count(),
                "totalSpent": Commande.objects.filter(client=client, statut_paiement='paye').aggregate(total=Sum('montant'))['total'] or 0
            }
        return Response(data)

    def put(self, request, format=None):
        client, _ = Client.objects.get_or_create(user=request.user)
        
        serializer = ClientSerializer(instance=client, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientAvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        client, _ = Client.objects.get_or_create(user=request.user)
        if 'avatar' in request.data:
            client.avatar = request.data['avatar']
            client.save()
            serializer = ClientSerializer(client, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Aucun fichier avatar fourni'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        try:
            client = Client.objects.get(user=request.user)
        except Client.DoesNotExist:
            if request.user.is_staff:
                client = Client.objects.create(user=request.user)
            else:
                return Response({"error": "Client non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClientSerializer(instance=client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientAbonnementsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        client = Client.objects.get(user=request.user)
        abonnements = Abonnement.objects.filter(client=client).order_by('-date_fin')
        serializer = AbonnementSerializer(abonnements, many=True)
        return Response(serializer.data)

class ClientCommandesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        client = Client.objects.get(user=request.user)
        commandes = Commande.objects.filter(client=client).order_by('-date_commande')
        serializer = CommandeSerializer(commandes, many=True)
        return Response(serializer.data)

class ClientTicketsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        client = Client.objects.get(user=request.user)
        tickets = TicketSupport.objects.filter(client=client).order_by('-date_creation')
        serializer = TicketSupportSerializer(tickets, many=True)
        return Response(serializer.data)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_BASE_URL}/compte/reinitialiser-mot-de-passe/{uidb64}/{token}" 
        email_context = {'user': user, 'reset_url': reset_url}
        email_body = render_to_string('crm/password_reset_email.html', email_context)
        
        # --- CORRECTION DE LA SYNTAXE ICI ---
        send_mail(
            subject="Réinitialisation de votre mot de passe",
            message=f"Veuillez utiliser ce lien pour réinitialiser votre mot de passe : {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=email_body
        )
        return Response({'status': 'success', 'message': 'Si un compte avec cet email existe, un lien a été envoyé.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        new_password = serializer.validated_data['new_password1']
        user.set_password(new_password)
        user.save()
        return Response({'status': 'success', 'message': 'Votre mot de passe a été réinitialisé.'}, status=status.HTTP_200_OK)

class ClientAffilieView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            client = Client.objects.get(user=request.user)
            affilie = Affilie.objects.get(client=client)
            serializer = AffilieSerializer(affilie)
            return Response(serializer.data)
        except (Client.DoesNotExist, Affilie.DoesNotExist):
            return Response({"detail": "Aucune information d'affiliation trouvée."}, status=status.HTTP_404_NOT_FOUND)

class ClientAffiliateHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            client = Client.objects.get(user=request.user)
            affilie = Affilie.objects.get(client=client)
            commandes = Commande.objects.filter(
                affilie_utilise=affilie, 
                statut_paiement='paye'
            ).select_related('client__user').order_by('-date_commande')
            serializer = CommandeSerializer(commandes, many=True)
            return Response(serializer.data)
        except (Client.DoesNotExist, Affilie.DoesNotExist):
            return Response({"detail": "Aucune information d'affiliation trouvée."}, status=status.HTTP_404_NOT_FOUND)

class CreateAffiliateView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request, *args, **kwargs):
        serializer = CreateAffiliateSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            client_id = data.get('client_id')
            if data['type_affilie'] == 'CLIENT':
                try:
                    client = Client.objects.get(id=client_id)
                    affilie = Affilie.objects.create(
                        client=client,
                        nom=f"{client.user.first_name} {client.user.last_name}".strip() or client.user.username,
                        type_affilie='CLIENT',
                        pourcentage_commission=data.get('pourcentage_commission', 10.0)
                    )
                except Client.DoesNotExist:
                    return Response({'error': 'Client non trouvé'}, status=status.HTTP_404_NOT_FOUND)
            else: # EVENEMENT
                affilie = Affilie.objects.create(
                    nom=data['nom'],
                    code_affiliation=data.get('code_affiliation', ''),
                    type_affilie='EVENEMENT',
                    pourcentage_commission=data.get('pourcentage_commission', 10.0)
                )
            return Response(AffilieSerializer(affilie).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DemandeAffiliationViewSet(viewsets.ModelViewSet):
    serializer_class = DemandeAffiliationSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        queryset = DemandeAffiliation.objects.select_related('client__user').order_by('-date_demande')
        statut = self.request.query_params.get('statut', 'en_attente')
        if statut == 'history':
            return queryset.filter(statut__in=['approuvee', 'rejetee'])
        return queryset.filter(statut='en_attente')

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def approve(self, request, pk=None):
        demande = self.get_object()
        if demande.statut != 'en_attente':
            return Response({'detail': 'Cette demande a déjà été traitée.'}, status=status.HTTP_400_BAD_REQUEST)
        pourcentage = request.data.get('pourcentage_commission', 10.0)
        try:
            pourcentage = float(pourcentage)
        except (ValueError, TypeError):
            return Response({'detail': 'Le pourcentage de commission doit être un nombre valide.'}, status=status.HTTP_400_BAD_REQUEST)
        client = demande.client
        if Affilie.objects.filter(client=client).exists():
            demande.statut = 'rejetee'
            demande.save()
            return Response({'detail': 'Ce client est déjà un affilié.'}, status=status.HTTP_400_BAD_REQUEST)
        affilie = Affilie.objects.create(
            client=client,
            nom=f"{client.user.first_name} {client.user.last_name}".strip() or client.user.username,
            type_affilie='CLIENT',
            pourcentage_commission=pourcentage
        )
        demande.statut = 'approuvee'
        demande.save()
        send_affiliate_approval_email(affilie)
        return Response(DemandeAffiliationSerializer(demande).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        demande = self.get_object()
        if demande.statut != 'en_attente':
            return Response({'detail': 'Cette demande a déjà été traitée.'}, status=status.HTTP_400_BAD_REQUEST)
        demande.statut = 'rejetee'
        demande.save()
        send_affiliate_rejection_email(demande)
        return Response(DemandeAffiliationSerializer(demande).data)

class ClientSubmitAffiliationView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = ClientSubmitAffiliationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            client = Client.objects.get(user=request.user)
            if DemandeAffiliation.objects.filter(client=client).exists() or Affilie.objects.filter(client=client).exists():
                return Response({'detail': 'Vous avez déjà une demande en cours ou êtes déjà affilié.'}, status=status.HTTP_400_BAD_REQUEST)
            demande = serializer.save(client=client)
            send_affiliate_request_to_admin(client)
            return Response(DemandeAffiliationSerializer(demande).data, status=status.HTTP_201_CREATED)
        except Client.DoesNotExist:
            return Response({'detail': 'Profil client non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:
            return Response({"error": "L'ancien et le nouveau mot de passe sont requis."}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(old_password):
            return Response({"error": "L'ancien mot de passe est incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({"status": "success", "message": "Mot de passe changé avec succès."}, status=status.HTTP_200_OK)
    
class MRRStatsView(APIView):
    """
    Vue pour calculer le Revenu Mensuel Récurrent (MRR).
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        
        current_mrr = self.calculate_mrr_for_date(today)

        first_day_of_current_month = today.replace(day=1)
        last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
        previous_mrr = self.calculate_mrr_for_date(last_day_of_previous_month)

        if previous_mrr > 0:
            percentage_change = ((current_mrr - previous_mrr) / previous_mrr) * 100
        elif current_mrr > 0:
            percentage_change = 100.0
        else:
            percentage_change = 0.0
        
        data = {
            'amount': float(current_mrr),
            'diff': round(float(percentage_change), 2)
        }
        return Response(data)

    def calculate_mrr_for_date(self, date_obj):
        """
        Calcule le MRR total pour une date donnée en se basant sur les abonnements actifs.
        """
        active_subscriptions = Abonnement.objects.filter(
            date_debut__date__lte=date_obj, 
            date_fin__date__gte=date_obj,
            statut='actif'
        )
        
        total_mrr = Decimal(0)
        for sub in active_subscriptions:
            if sub.produit and sub.produit.prix > 0 and sub.produit.duree_jours > 0:
                daily_price = sub.produit.prix / Decimal(sub.produit.duree_jours)
                monthly_price = daily_price * Decimal("30.44")
                total_mrr += monthly_price
                
        return round(total_mrr, 2)