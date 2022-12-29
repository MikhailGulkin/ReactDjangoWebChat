from rest_framework import generics

from .models import Conversation, Message
from .paginaters import MessagePagination
from .serializers import ConversationSerializer, MessageSerializer
from .mixins.api.conversation import ConversationContextMixin


#
class ConversationListAPIView(
    ConversationContextMixin,
    generics.ListAPIView
):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.none()

    def get_queryset(self):
        return Conversation.objects.filter(
            name__contains=self.request.user.username
        )


class ConversationRetrieveAPIView(
    ConversationContextMixin,
    generics.RetrieveAPIView
):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()
    lookup_field = 'name'


class MessageListAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.none()
    pagination_class = MessagePagination

    def get_queryset(self):
        conversation_name = self.request.GET.get("conversation")
        queryset = (
            Message.objects.filter(
                conversation__name__contains=self.request.user.username,
            )
            .filter(conversation__name=conversation_name)
            .order_by("-timestamp")
        )
        return queryset
