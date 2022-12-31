from asgiref.sync import async_to_sync

from chats.serializers import MessageSerializer
from chats.models import Message
from chats.utils.countUniqueMessage import count_unique_conversation_message


class MessageConsumerMixin:
    """
    Class that implements the logic when a new message is received.
    """
    def _chat_message(self, content):
        message = Message.objects.create(
            from_user=self.user,
            to_user=self.get_other_user(),
            content=content["message"],
            conversation=self.conversation,
        )
        async_to_sync(self.channel_layer.group_send)(
            self.conversation_name,
            {
                "type": "chat_message_echo",
                "name": self.user.username,
                "message": MessageSerializer(message).data,
            },
        )
        notification_group_name = self.get_other_user().username + "__notifications"
        async_to_sync(self.channel_layer.group_send)(
            notification_group_name,
            {
                "type": "new_message_notification",
                "name": self.user.username,
                "message": MessageSerializer(message).data,
                "unread_count": count_unique_conversation_message(
                    self.get_other_user())
            },
        )

    def _read_message(self):
        messages_to_me = self.conversation.messages.filter(
            to_user=self.user)
        messages_to_me.update(read=True)

        # Update the unread message count
        unread_count = count_unique_conversation_message(self.user)
        async_to_sync(self.channel_layer.group_send)(
            self.user.username + "__notifications",
            {
                "type": "unread_count",
                "unread_count": unread_count,
            },
        )

    def _typing(self, content):
        async_to_sync(self.channel_layer.group_send)(
            self.conversation_name,
            {
                'type': 'typing',
                'user': self.user.username,
                'typing': content['typing']
            }
        )


class MessageConsumerStartMixin(MessageConsumerMixin):
    """
    A class that provides a method that runs the logic from the
    MessageConsumerStartMixin depending on the message it receives.
    """
    def _start_handle_message(self, message_type, content):
        if message_type == "chat_message":
            self._chat_message(content)
        if message_type == "read_messages":
            self._read_message()
        if message_type == "typing":
            self._typing(content)
