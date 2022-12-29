from asgiref.sync import async_to_sync
from chats.models import Conversation
from chats.serializers import MessageSerializer

class UserConnectLogin:
    def _user_connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return

        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(
            name=self.conversation_name)
    def _online_status_send_set(self):
        self.send_json(
            {
                "type": "online_user_list",
                "users": [user.username for user in
                          self.conversation.online.all()],
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            self.conversation_name,
            {
                "type": "user_join",
                "user": self.user.username,
            },
        )
        self.conversation.online.add(self.user)
    def _return_last_50_message(self):
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )
        messages = self.conversation.messages.all().order_by("-timestamp")[
                   0:50]
        message_count = self.conversation.messages.all().count()
        self.send_json({
            "type": "last_50_messages",
            "messages": MessageSerializer(messages, many=True).data,
            'has_more': message_count > 5
        })

    def user_join(self, event):
        self.send_json(event)