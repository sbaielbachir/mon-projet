from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Route pour les notifications générales des admins
    re_path(r'ws/admin/notifications/$', consumers.NotificationConsumer.as_asgi()),
    
    # Route pour la messagerie instantanée sur un ticket
    re_path(r'ws/tickets/(?P<ticket_id>\d+)/$', consumers.TicketConsumer.as_asgi()),

    # Route pour les notifications d'un utilisateur client
    re_path(r'ws/user/notifications/$', consumers.UserNotificationConsumer.as_asgi()),
]