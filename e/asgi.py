import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from myapp.routing import websocket_urlpatterns  # Import your WebSocket URL patterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e.settings')

# Get the Django ASGI application
django_asgi_application = get_asgi_application()

# Define WebSocket routes
application = ProtocolTypeRouter({
    "http": django_asgi_application,  # Use Django ASGI application for HTTP requests
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns  # Use URL patterns defined in myapp.routing for WebSocket connections
            )
        )
    ),
})
