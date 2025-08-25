from django.db import models
from django.contrib.auth.models import User
import uuid
import random
import string
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.utils import timezone

# --- MODÈLES ---
# Les modèles restent inchangés, seule la section des signaux est modifiée.

class Produit(models.Model):
    nom = models.CharField(max_length=100)
    duree_jours = models.IntegerField()
    prix = models.DecimalField(max_digits=8, decimal_places=2)
    actif = models.BooleanField(default=True)
    def __str__(self): return f"{self.nom} - {self.prix} CAD"

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    code_postal = models.CharField(max_length=20, blank=True, null=True)
    pays = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    def __str__(self): return self.user.username

class Affilie(models.Model):
    TYPE_AFFILIE_CHOICES = [('CLIENT', 'Client'), ('EVENEMENT', 'Événement')]
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True, unique=True)
    nom = models.CharField(max_length=100, help_text="Nom de l'affilié ou de la campagne (ex: PROMO_NOEL)")
    code_affiliation = models.CharField(max_length=50, unique=True, blank=True)
    type_affilie = models.CharField(max_length=10, choices=TYPE_AFFILIE_CHOICES, default='CLIENT')
    pourcentage_commission = models.DecimalField(max_digits=5, decimal_places=2, default=10.00, help_text="Pourcentage de commission (ex: 10.00 pour 10%)")
    solde_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_creation = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        if not self.code_affiliation: self.code_affiliation = ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))
        super().save(*args, **kwargs)
    def __str__(self):
        if self.type_affilie == 'CLIENT' and self.client: return f"Affilié (Client): {self.client.user.username}"
        return f"Affilié (Événement): {self.nom}"

class Commande(models.Model):
    STATUT_PAIEMENT_CHOICES = [('en_attente', 'En attente de paiement'), ('paye', 'Payé'), ('annule', 'Annulé')]
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    produit = models.ForeignKey(Produit, on_delete=models.SET_NULL, null=True)
    montant = models.DecimalField(max_digits=8, decimal_places=2)
    date_commande = models.DateTimeField(auto_now_add=True)
    statut_paiement = models.CharField(max_length=20, choices=STATUT_PAIEMENT_CHOICES, default='en_attente')
    affilie_utilise = models.ForeignKey(Affilie, on_delete=models.SET_NULL, null=True, blank=True, related_name='commandes_generees')
    montant_commission = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    def __str__(self): return f"Commande #{self.id} par {self.client}"

class Abonnement(models.Model):
    STATUT_CHOICES = [('actif', 'Actif'), ('expire', 'Expiré'), ('suspendu', 'Suspendu')]
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.PROTECT)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='actif')
    details_connexion = models.TextField(blank=True, null=True, help_text="Informations de connexion IPTV (lien M3U, etc.)")
    def __str__(self): return f"Abonnement de {self.client} au plan {self.produit.nom}"

class TicketSupport(models.Model):
    STATUT_TICKET_CHOICES = [('ouvert', 'Ouvert'), ('en_cours', 'En cours'), ('ferme', 'Fermé')]
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    sujet = models.CharField(max_length=255)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_mise_a_jour = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=10, choices=STATUT_TICKET_CHOICES, default='ouvert')
    def __str__(self): return f"Ticket #{self.id} - {self.sujet}"

class MessageTicket(models.Model):
    ticket = models.ForeignKey(TicketSupport, related_name='messages', on_delete=models.CASCADE)
    auteur = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['date_envoi']
    def __str__(self): return f"Message de {self.auteur.username} sur le ticket #{self.ticket.id}"

class DemandeAffiliation(models.Model):
    STATUT_CHOICES = [('en_attente', 'En attente'), ('approuvee', 'Approuvée'), ('rejetee', 'Rejetée')]
    client = models.OneToOneField(Client, on_delete=models.CASCADE)
    motivations = models.TextField(blank=True, null=True)
    site_web = models.URLField(max_length=200, blank=True, null=True)
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='en_attente')
    date_demande = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"Demande de {self.client.user.username} - Statut: {self.get_statut_display()}"

class FaqItem(models.Model):
    question = models.CharField(max_length=255)
    reponse = models.TextField()
    actif = models.BooleanField(default=True, help_text="Seules les questions actives seront affichées sur le site public.")
    ordre = models.PositiveIntegerField(default=0, help_text="Pour ordonner les questions. Celles avec un nombre plus petit apparaissent en premier.")
    class Meta: ordering = ['ordre']
    def __str__(self): return self.question

# --- SIGNAUX POUR NOTIFICATIONS ---

@receiver(post_save, sender=Commande)
def notify_new_order(sender, instance, created, **kwargs):
    """
    Envoie une notification au groupe admin lorsqu'une nouvelle commande est créée.
    """
    if created:
        # CORRECTION : L'import est déplacé ici pour éviter l'erreur d'import circulaire.
        from .serializers import CommandeSerializer
        channel_layer = get_channel_layer()
        commande_data = CommandeSerializer(instance).data
        
        async_to_sync(channel_layer.group_send)(
            'admin_notifications',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'new_order',
                    'data': commande_data
                }
            }
        )

@receiver(post_save, sender=TicketSupport)
def notify_new_ticket(sender, instance, created, **kwargs):
    """
    Envoie une notification au groupe admin lorsqu'un nouveau ticket est créé.
    """
    if created:
        # CORRECTION : L'import est déplacé ici.
        from .serializers import TicketSupportSerializer
        channel_layer = get_channel_layer()
        ticket_data = TicketSupportSerializer(instance).data

        async_to_sync(channel_layer.group_send)(
            'admin_notifications',
            {
                'type': 'send_notification',
                'message': {
                    'type': 'new_ticket',
                    'data': ticket_data
                }
            }
        )

receiver(post_save, sender=MessageTicket)
def notify_new_ticket_message(sender, instance, created, **kwargs):
    """
    Envoie une notification en temps réel lorsqu'un nouveau message est créé.
    """
    if created:
        # CORRECTION : L'import est déplacé ici.
        from .serializers import MessageTicketSerializer
        channel_layer = get_channel_layer()
        ticket = instance.ticket
        room_group_name = f'ticket_{ticket.id}'
        message_data = MessageTicketSerializer(instance).data

        # 1. Envoyer le message au chat du ticket pour mise à jour en temps réel
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )

        # Mettre à jour la date de mise à jour du ticket
        ticket.date_mise_a_jour = instance.date_envoi
        ticket.save(update_fields=['date_mise_a_jour'])

        # 2. Envoyer une notification "toast"
        auteur = instance.auteur
        if auteur.is_staff:
            client_user_id = ticket.client.user.id
            client_group_name = f'user_{client_user_id}'
            async_to_sync(channel_layer.group_send)(
                client_group_name,
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'ticket_reply',
                        'data': {
                            'ticket_id': ticket.id,
                            'sujet': ticket.sujet,
                            'auteur': auteur.username
                        }
                    }
                }
            )
        else:
            async_to_sync(channel_layer.group_send)(
                'admin_notifications',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'ticket_reply',
                        'data': {
                            'ticket_id': ticket.id,
                            'sujet': ticket.sujet,
                            'auteur': auteur.username
                        }
                    }
                }
            )