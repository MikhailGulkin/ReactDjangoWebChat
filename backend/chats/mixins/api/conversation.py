class ConversationContextMixin:
    def get_serializer_context(self):
        return {"request": self.request, "user": self.request.user}
