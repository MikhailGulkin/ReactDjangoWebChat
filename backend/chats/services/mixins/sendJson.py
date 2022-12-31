class NotificationConsumerJsonSendMixin:
    """
    Class for send json in chats.NotificationConsumer.
    """
    def offline_user_status(self, event):
        self.send_json(event)

    def new_message_notification(self, event):
        self.send_json(event)

    def unread_count(self, event):
        self.send_json(event)

    def online_user_status(self, event):
        self.send_json(event)


class ConsumerJsonSendMixin:
    """
    Class for send json in chats.ChatConsumer
    """
    def chat_message_echo(self, event):
        self.send_json(event)

    def typing(self, event):
        self.send_json(event)

    def user_leave(self, event):
        self.send_json(event)

    def user_join(self, event):
        self.send_json(event)


class ConsumerAllJsonSendMixin(
    NotificationConsumerJsonSendMixin,
    ConsumerJsonSendMixin
):
    """
    class inherited from NotificationConsumerJsonSendMixin
    and ConsumerJsonSendMixin.
    """
    pass
