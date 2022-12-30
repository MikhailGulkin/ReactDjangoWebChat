from chats.models import User


def get_other_user(usernames: list[str], base_user: str) -> User:
    for username in usernames:
        if username != base_user:
            return User.objects.get(username=username)
