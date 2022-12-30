import json

from django.contrib.auth import get_user_model
from channels.generic.websocket import JsonWebsocketConsumer

from chats.services.mixins import *
from chats.services.uuidEncode import UUIDEncoder
from chats.utils.getOtherUser import get_other_user

User = get_user_model()


class ChatConsumer(
    JsonWebsocketConsumer,
    UserConsumerConnectLoginMixin,
    MessageConsumerStartMixin,
    UserConsumerDisconnectMixin,
    ConsumerAllJsonSendMixin
):
    """
    This consumer is used to show user's online status,
    and send notifications.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.conversation_name = None
        self.conversation = None
        self.user = None

    def connect(self):
        self._user_connect()
        self._online_status_send_set()
        self._return_last_50_message()
        self._send_another_user_about_online_status()

    def disconnect(self, code):
        self._disconnect()
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        self._start_handle_message(message_type, content)
        return super().receive_json(content, **kwargs)

    def get_other_user(self):
        usernames = self.conversation_name.split("__")
        return get_other_user(usernames, self.user.username)

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)


class NotificationConsumer(
    JsonWebsocketConsumer,
    UserNotificationConnectMixin,
    UserNotificationDisconnectMixin,
    NotificationConsumerJsonSendMixin
):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.notification_group_name = None

    def connect(self):
        self._user_notification_connect()
        self._send_unread_message_count()

    def disconnect(self, code):
        self._disconnect()
        return super().disconnect(code)



