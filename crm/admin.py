from django.contrib import admin
from .models import Produit, Client, Abonnement, Commande, Affilie, TicketSupport, MessageTicket, DemandeAffiliation, FaqItem

class CommandeAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'produit', 'montant', 'statut_paiement', 'date_commande', 'affilie_utilise', 'montant_commission')
    list_filter = ('statut_paiement', 'date_commande')
    search_fields = ('client__user__username', 'produit__nom')
    readonly_fields = ('date_commande',)

class AbonnementAdmin(admin.ModelAdmin):
    list_display = ('client', 'produit', 'date_debut', 'date_fin', 'statut')
    list_filter = ('statut', 'produit')
    search_fields = ('client__user__username', 'produit__nom')

class ClientAdmin(admin.ModelAdmin):
    list_display = ('user', 'telephone', 'ville', 'pays', 'date_creation')
    search_fields = ('user__username', 'user__email', 'telephone', 'ville', 'pays')
    readonly_fields = ('date_creation',)

class AffilieAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type_affilie', 'code_affiliation', 'client', 'pourcentage_commission', 'solde_commission')
    list_filter = ('type_affilie',)
    search_fields = ('nom', 'code_affiliation', 'client__user__username')

class DemandeAffiliationAdmin(admin.ModelAdmin):
    list_display = ('client', 'statut', 'date_demande', 'site_web')
    list_filter = ('statut',)
    search_fields = ('client__user__username',)
    readonly_fields = ('date_demande',)

class FaqItemAdmin(admin.ModelAdmin):
    list_display = ('question', 'actif', 'ordre')
    list_editable = ('actif', 'ordre')

admin.site.register(Produit)
admin.site.register(Client, ClientAdmin)
admin.site.register(Abonnement, AbonnementAdmin)
admin.site.register(Commande, CommandeAdmin)
admin.site.register(Affilie, AffilieAdmin)
admin.site.register(TicketSupport)
admin.site.register(MessageTicket)
admin.site.register(DemandeAffiliation, DemandeAffiliationAdmin)
admin.site.register(FaqItem, FaqItemAdmin)