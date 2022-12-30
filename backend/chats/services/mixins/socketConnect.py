from asgiref.sync import async_to_sync

from chats.models import Conversation
from chats.serializers import MessageSerializer
from chats.utils.countUniqueMessage import count_unique_conversation_message


class UserConsumerConnectLoginMixin:
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
        self.json = self.send_json({"type": "last_50_messages",
                                    "messages": MessageSerializer(messages,
                                                                  many=True).data,
                                    'has_more': message_count > 5})

    def _send_another_user_about_online_status(self):
        notification_group_name = self.get_other_user().username + "__notifications"
        async_to_sync(self.channel_layer.group_send)(
            notification_group_name,
            {
                "type": "online_user_status",
                "name": self.user.username
            },
        )

    def _send_another_user_about_offline_status(self):
        notification_group_name = self.get_other_user().username + "__notifications"
        async_to_sync(self.channel_layer.group_send)(
            notification_group_name,
            {
                "type": "offline_user_status",
                "name": self.user.username
            },
        )


class UserNotificationConnectMixin:
    def _user_notification_connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        self.accept()

        self.notification_group_name = self.user.username + "__notifications"
        async_to_sync(self.channel_layer.group_add)(
            self.notification_group_name,
            self.channel_name,
        )

    def _send_unread_message_count(self):
        unread_count = count_unique_conversation_message(self.user)
        self.send_json(
            {
                "type": "unread_count",
                "unread_count": unread_count,
            }
        )
