"""
ASGI config for djangoChat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
import sys
from pathlib import Path

from django.core.asgi import get_asgi_application

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent

sys.path.append(str(ROOT_DIR / "djangoChat"))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoChat.settings')

django_application = get_asgi_application()

import routing  # noqa isort:skip

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa isort:skip
from chats.middleware import TokenAuthMiddleware  # noqa isort:skip

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleware(
            URLRouter(routing.websocket_urlpatterns)
        ),
    }
)
