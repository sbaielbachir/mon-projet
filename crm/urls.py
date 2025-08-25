from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MyTokenObtainPairView,
    ProduitViewSet,
    ClientViewSet,
    AbonnementViewSet,
    CommandeViewSet,
    AffilieViewSet,
    FaqItemViewSet,
    TicketSupportViewSet,
    DashboardStatsView,
    ClientDataView,
    ClientAbonnementsView,
    ClientCommandesView,
    ClientTicketsView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PublicOrderView,
    CreateAffiliateView,
    ClientAffilieView,
    ChangePasswordView,
    ClientAffiliateHistoryView,
    DemandeAffiliationViewSet,
    ClientSubmitAffiliationView,
    MRRStatsView,
    ClientAvatarUploadView
)

router = DefaultRouter()
router.register(r'produits', ProduitViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'abonnements', AbonnementViewSet)
router.register(r'commandes', CommandeViewSet)
router.register(r'affilies', AffilieViewSet)
router.register(r'faqs', FaqItemViewSet, basename='faq')
router.register(r'tickets', TicketSupportViewSet, basename='ticket')
router.register(r'affiliate-requests', DemandeAffiliationViewSet, basename='affiliate-request')

urlpatterns = [
    # --- Authentification ---
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # --- Endpoint Public ---
    path('orders/create/', PublicOrderView.as_view(), name='public-order-create'),

    # --- Endpoints Espace Client ---
    path('client/me/', ClientDataView.as_view(), name='client-me'),
    path('client/avatar/upload/', ClientAvatarUploadView.as_view(), name='client-avatar-upload'),
    path('client/abonnements/', ClientAbonnementsView.as_view(), name='client-abonnements'),
    path('client/commandes/', ClientCommandesView.as_view(), name='client-commandes'),
    path('client/tickets/', ClientTicketsView.as_view(), name='client-tickets'),
    path('client/affilie/', ClientAffilieView.as_view(), name='client-affilie'),
    path('client/affilie/history/', ClientAffiliateHistoryView.as_view(), name='client-affilie-history'),
    path('client/submit-affiliation/', ClientSubmitAffiliationView.as_view(), name='client-submit-affiliation'),
    path('client/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # --- Endpoints CRM (Admin) ---
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('mrr-stats/', MRRStatsView.as_view(), name='mrr-stats'),
    path('affilies/create/', CreateAffiliateView.as_view(), name='create-affiliate'),
    
    # Le routeur pour les ViewSets de l'admin
    path('', include(router.urls)),
]