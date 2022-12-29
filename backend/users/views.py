from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from rest_framework.permissions import AllowAny

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from .serializers import UserSerializer

User = get_user_model()

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

# class UserListAPIView(APIView):
#     def get(self, request, *args, **kwargs):
#         serializer = UserSerializer(
#             User.objects.all(), many=True, context={"request": request}
#         )
#         return Response(status=status.HTTP_200_OK, data=serializer.data)
# class User(APIView)

class UserListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        serializer = UserSerializer(
            User.objects.all(), many=True, context={"request": request}
        )
        return Response(status=status.HTTP_200_OK, data=serializer.data)

# class UserViewSet(
#     RetrieveModelMixin,
#     ListModelMixin,
#     UpdateModelMixin,
#     GenericViewSet
# ):
#     # other viewset logic
#     serializer_class = UserSerializer
#     queryset = User.objects.all()
#     lookup_field = "username"
#
#     def get_queryset(self, *args, **kwargs):
#         assert isinstance(self.request.user.id, int)
#         return self.queryset.filter(id=self.request.user.id)
#
#     @action(detail=False)
#     def me(self, request):
#         serializer = UserSerializer(request.user, context={"request": request})
#         return Response(status=status.HTTP_200_OK, data=serializer.data)

# Add this
# @action(detail=False)
# def all(self, request):
#     serializer = UserSerializer(
#         User.objects.all(), many=True, context={"request": request}
#     )
#     return Response(status=status.HTTP_200_OK, data=serializer.data)


class CustomObtainAuthTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})
