from django.urls import path
from .views import (
    ConversationListAPIView,
    MessageListAPIView,
    ConversationRetrieveAPIView
)

urlpatterns = [
    path('conversations/<slug:name>/',
         ConversationRetrieveAPIView.as_view(),
         name="conversation-by-name"
         ),
    path('conversations/',
         ConversationListAPIView.as_view(),
         name="all-conversations-for-user"
         ),
    path('messages/',
         MessageListAPIView.as_view(),
         name="all-messages"
         ),
]
