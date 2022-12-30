from django.urls import path
from .views import (
    ConversationListAPIView,
    MessageListAPIView,
    ConversationRetrieveAPIView
)

urlpatterns = [
    path('conversations/<slug:name>/', ConversationRetrieveAPIView.as_view()),
    path('conversations/', ConversationListAPIView.as_view()),
    path('messages/', MessageListAPIView.as_view()),
]
