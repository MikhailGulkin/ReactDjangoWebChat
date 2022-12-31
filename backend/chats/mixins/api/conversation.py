class ConversationContextMixin:
    """
    Add in serializer context user attribute.
    """
    def get_serializer_context(self):
        return {"request": self.request, "user": self.request.user}
