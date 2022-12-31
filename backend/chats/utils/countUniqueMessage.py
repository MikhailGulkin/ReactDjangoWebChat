from chats.models import Message


def count_unique_conversation_message(user) -> int:
    """
    Count messages from unique user.
    :param user:
    :return:
    """
    answer_list = []
    for ele in Message.objects.select_related('conversation').filter(
            to_user=user,
            read=False
    ):
        if ele.conversation not in answer_list:
            answer_list.append(ele.conversation)
    return len(answer_list)
