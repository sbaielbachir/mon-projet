# iptv_project/asgi.py

import os
from django.core.asgi import get_asgi_application

# Il est crucial de définir la variable d'environnement AVANT d'importer quoi que ce soit de Django.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iptv_project.settings')

# Initialiser l'application Django d'abord.
django_asgi_app = get_asgi_application()

# Maintenant que Django est prêt, nous pouvons importer les composants de Channels.
from channels.routing import ProtocolTypeRouter, URLRouter
from crm.middleware import TokenAuthMiddlewareStack
import crm.routing

# La configuration de l'application ASGI
application = ProtocolTypeRouter({
  # Le routage HTTP est géré par Django normalement.
  "http": django_asgi_app,

  # Le routage WebSocket est géré par Channels.
  # TokenAuthMiddlewareStack va intercepter chaque connexion pour l'authentifier.
  "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            crm.routing.websocket_urlpatterns
        )
    ),
})