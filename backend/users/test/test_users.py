from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from chats.utils.create_n_users import create_users_and_tokens


class UsersTestCase(APITestCase):
    """
    Test Cases for :model:`User`.
    """
    all_users_url = reverse('all-users')
    users_number = 3
    @classmethod
    def setUpTestData(cls):
        create_users_and_tokens(cls.users_number, cls)
    def test_all_users(self):
        """
        Test GET all-users endpoint.
        :return:
        """
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {self.token_1.key}'
        )

        response = self.client.get(
            self.all_users_url,
            data={
                'user': self.user_1,
              }
        )
        resp_json = response.json()
        user_1 = resp_json[0]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp_json), self.users_number)

        self.assertEqual(user_1['username'], self.user_1.username)

