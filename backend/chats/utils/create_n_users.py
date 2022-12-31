from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()


def create_users_and_tokens(n: int, cls):
    """
    Create n users and token for users using in testCases.
    :param cls:
    :param n:
    :return:
    """
    for i in range(1, n + 1):
        temp_attr = User.objects.create(
            username=f"User_{i}",
            password="123",
            is_active=True,

        )
        setattr(cls, f'token_{i}', Token.objects.create(user=temp_attr))
        setattr(cls, f'user_{i}', temp_attr)
