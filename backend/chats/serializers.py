from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.serializers import UserSerializer

from .models import Conversation
from .models import Message
from .utils.getOtherUser import get_other_user

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    conversation = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read",
        )

    def get_conversation(self, obj):
        return str(obj.conversation.id)

    def get_from_user(self, obj):
        return UserSerializer(obj.from_user).data

    def get_to_user(self, obj):
        return UserSerializer(obj.to_user).data


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    have_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "name", 'have_message', "other_user", "last_message")

    def get_have_message(self, obj) -> bool:
        """
        return true if user have new message from other user.
        :param obj:
        :return:
        """
        usernames = obj.name.split("__")
        other_user = get_other_user(usernames, self.context['user'].username)
        return Message.objects.filter(
            to_user=User.objects.get(username=self.context["user"].username),
            from_user=other_user,
            read=False
        ).exists()

    def get_last_message(self, obj):
        """
        Send last message.
        """
        messages = obj.messages.all().order_by("-timestamp")
        if not messages.exists():
            return None
        message = messages[0]
        return MessageSerializer(message).data

    def get_other_user(self, obj):
        """
        Return other user from list users name
        :param obj:
        :return:
        """
        usernames = obj.name.split("__")
        other_user = get_other_user(usernames, self.context['user'].username)
        return UserSerializer(other_user).data
