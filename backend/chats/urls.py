from django.urls import path, include
# from .views import ConversationViewSet, MessageViewSet
from .views import ConversationListAPIView, MessageListAPIView, ConversationRetrieveAPIView
from rest_framework import routers

# router = routers.DefaultRouter()
# router.register(r'conversations', ConversationViewSet)
# router.register(r"messages", MessageViewSet)

urlpatterns = [
    path('conversations/<slug:name>/', ConversationRetrieveAPIView.as_view()),
    path('conversations/', ConversationListAPIView.as_view()),
    path('messages/', MessageListAPIView.as_view()),
]
