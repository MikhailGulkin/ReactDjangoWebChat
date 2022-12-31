from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from chats.models import Conversation, Message
from chats.utils.create_n_users import create_users_and_tokens


class MessageTestCase(APITestCase):
    """
    Test Cases for :model:`chats.Message`.
    """
    all_messages_url = reverse('all-messages')
    users_number = 2
    @classmethod
    def setUpTestData(cls):
        create_users_and_tokens(cls.users_number, cls)

    def setUp(self) -> None:
        self.conversation_1 = Conversation.objects.create(
            name=f'{self.user_1}__{self.user_2}'
        )
        self.conversation_1.join(self.user_1)
        self.conversation_1.join(self.user_2)

        self.message_1 = Message.objects.create(
            from_user=self.user_1,
            to_user=self.user_2,
            content="123",
            conversation=self.conversation_1,
        )
        self.message_2 = Message.objects.create(
            from_user=self.user_2,
            to_user=self.user_1,
            content="321",
            conversation=self.conversation_1,
        )

    def test_all_messages(self):
        """
        Test GET all-messages endpoint.
        :return:
        """
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.token_1.key}'
        )

        response = self.client.get(
            self.all_messages_url,
            data={
                'user': self.user_1,
                'conversation': self.conversation_1.name,
                'page': 1,
              }
        )
        resp_json = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(resp_json['results']), 2)

