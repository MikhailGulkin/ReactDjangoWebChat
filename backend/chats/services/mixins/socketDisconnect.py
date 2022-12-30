from asgiref.sync import async_to_sync


class UserConsumerDisconnectMixin:
    def _disconnect(self):
        if self.user.is_authenticated:  # send the leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "user_leave",
                    "user": self.user.username,
                },
            )
            self.conversation.online.remove(self.user)
            self._send_another_user_about_offline_status()


class UserNotificationDisconnectMixin:
    def _disconnect(self):
        if self.channel_layer.group_discard:
            async_to_sync(self.channel_layer.group_discard)(
                self.notification_group_name,
                self.channel_name,
            )
