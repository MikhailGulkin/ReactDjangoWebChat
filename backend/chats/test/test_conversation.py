from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from chats.models import Conversation
from chats.utils.create_n_users import create_users_and_tokens



class ConversationTestCase(APITestCase):
    """
    Test Cases for :model:`chats.Conversation`.
    """
    all_conversations_url = reverse('all-conversations-for-user')
    users_number = 4
    @classmethod
    def setUpTestData(cls):
        create_users_and_tokens(cls.users_number, cls)

    def setUp(self) -> None:
        self.conversation_1 = Conversation.objects.create(
            name=f'{self.user_1}__{self.user_2}'
        )
        self.conversation_1.join(self.user_1)
        self.conversation_1.join(self.user_2)

        self.conversation_2 = Conversation.objects.create(
            name=f'{self.user_3}__{self.user_4}'
        )
        self.conversation_3 = Conversation.objects.create(
            name=f'{self.user_3}__{self.user_2}'
        )

        self.conversation_2.join(self.user_3)
        self.conversation_2.join(self.user_4)

        self.conversation_3.join(self.user_3)
        self.conversation_3.join(self.user_2)

    def test_retrieve_conversation(self):
        """
        Test GET conversation-by-name endpoint.
        :return:
        """
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.token_1.key}')
        conversation_by_name_url = reverse('conversation-by-name', kwargs={
            'name': self.conversation_1.name
        })
        response = self.client.get(
            conversation_by_name_url,
            data={'user': self.user_1}
        )
        resp_json = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_json['name'], f'{self.user_1}__{self.user_2}')

    def test_all_conversation(self):
        """
        Test GET all-conversation endpoint.
        :return:
        """
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.token_3.key}')

        response = self.client.get(
            self.all_conversations_url,
            data={'user': self.user_3}
        )
        resp_json = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp_json), 2)
