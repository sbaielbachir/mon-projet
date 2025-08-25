from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.models import User
from .models import Produit, Client, Abonnement, Commande, Affilie, TicketSupport, MessageTicket, DemandeAffiliation, FaqItem

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email_or_username = attrs.get('username')
        password = attrs.get('password')

        if email_or_username and password:
            user_obj = User.objects.filter(email=email_or_username).first()
            if not user_obj:
                user_obj = User.objects.filter(username=email_or_username).first()

            if not user_obj:
                raise serializers.ValidationError('Aucun utilisateur avec cet email ou nom d\'utilisateur n\'a été trouvé.')

            user_authenticated = authenticate(request=self.context.get('request'), username=user_obj.username, password=password)
            
            if not user_authenticated:
                raise serializers.ValidationError('Le mot de passe est incorrect.')
        else:
            raise serializers.ValidationError('L\'email/nom d\'utilisateur et le mot de passe sont requis.')
        
        refresh = self.get_token(user_authenticated)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

class ClientRegistrationSerializer(serializers.Serializer):
    user = UserRegistrationSerializer()
    telephone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    adresse = serializers.CharField(max_length=255, required=False, allow_blank=True)
    ville = serializers.CharField(max_length=100, required=False, allow_blank=True)
    code_postal = serializers.CharField(max_length=20, required=False, allow_blank=True)
    pays = serializers.CharField(max_length=100, required=False, allow_blank=True)
    product_id = serializers.IntegerField()
    code_affiliation = serializers.CharField(max_length=50, required=False, allow_blank=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    # Le champ 'avatar' est maintenant géré par le SerializerMethodField ci-dessous
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id', 'user', 'telephone', 'date_creation', 'adresse', 'ville', 'code_postal', 'pays', 'avatar']
    
    def get_avatar(self, obj):
        request = self.context.get('request')
        # Si un avatar existe et qu'on a bien la requête, on construit l'URL complète
        if obj.avatar and hasattr(obj.avatar, 'url') and request:
            return request.build_absolute_uri(obj.avatar.url)
        # Sinon, on ne renvoie rien
        return None

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Mise à jour des champs du modèle Client
        instance.telephone = validated_data.get('telephone', instance.telephone)
        instance.ville = validated_data.get('ville', instance.ville)
        instance.adresse = validated_data.get('adresse', instance.adresse)
        instance.code_postal = validated_data.get('code_postal', instance.code_postal)
        instance.pays = validated_data.get('pays', instance.pays)
        # On ne gère pas l'avatar ici, car il est géré par une vue dédiée
        instance.save()

        # Mise à jour des champs du modèle User
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.save()
        
        return instance

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = ['id', 'nom', 'duree_jours', 'prix', 'actif']

class AffilieSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    class Meta:
        model = Affilie
        fields = '__all__'

class CommandeSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    produit = ProduitSerializer(read_only=True)
    affilie_utilise = AffilieSerializer(read_only=True)
    class Meta:
        model = Commande
        fields = '__all__'

class AbonnementSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    produit = ProduitSerializer(read_only=True)
    class Meta:
        model = Abonnement
        fields = '__all__'

class MessageTicketSerializer(serializers.ModelSerializer):
    auteur = UserSerializer(read_only=True)
    class Meta:
        model = MessageTicket
        fields = ['id', 'auteur', 'message', 'date_envoi']

class TicketSupportSerializer(serializers.ModelSerializer):
    messages = MessageTicketSerializer(many=True, read_only=True)
    client = ClientSerializer(read_only=True)
    initial_message = serializers.CharField(write_only=True, required=False, allow_blank=True)
    class Meta:
        model = TicketSupport
        fields = ['id', 'client', 'sujet', 'date_creation', 'date_mise_a_jour', 'statut', 'messages', 'initial_message']
        read_only_fields = ['client', 'date_creation', 'date_mise_a_jour', 'statut']

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Aucun utilisateur trouvé avec cette adresse e-mail.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)
    def validate(self, attrs):
        if attrs['new_password1'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password2": "Les deux mots de passe ne correspondent pas."})
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uidb64": "Le lien de réinitialisation est invalide."})
        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Le lien de réinitialisation est invalide ou a expiré."})
        attrs['user'] = user
        return attrs

class CreateAffiliateSerializer(serializers.ModelSerializer):
    client_id = serializers.IntegerField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Affilie
        fields = ['client_id', 'nom', 'code_affiliation', 'type_affilie', 'pourcentage_commission']
        extra_kwargs = {
            'code_affiliation': {'required': False, 'allow_blank': True},
            'nom': {'required': False, 'allow_blank': True}
        }

    def validate(self, data):
        type_affilie = data.get('type_affilie')
        client_id = data.get('client_id')
        nom = data.get('nom')

        if type_affilie == 'CLIENT':
            if not client_id:
                raise serializers.ValidationError({"client_id": "Un ID client est requis pour un affilié de type Client."})
            if Affilie.objects.filter(client_id=client_id).exists():
                raise serializers.ValidationError({"client_id": "Ce client est déjà un affilié."})
        elif type_affilie == 'EVENEMENT':
            if not nom:
                raise serializers.ValidationError({"nom": "Un nom est requis pour un affilié de type Événement."})
        else:
            raise serializers.ValidationError({"type_affilie": "Type d'affilié invalide."})
        
        return data

class DemandeAffiliationSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    class Meta:
        model = DemandeAffiliation
        fields = '__all__'

class ClientSubmitAffiliationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeAffiliation
        fields = ['motivations', 'site_web']

class FaqItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaqItem
        fields = '__all__'