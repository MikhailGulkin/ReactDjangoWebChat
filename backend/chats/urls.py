from django.urls import path, include
from .views import ConversationViewSet, MessageViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'conversations', ConversationViewSet)
router.register(r"messages", MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
