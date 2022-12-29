from django.urls import path, include
from .views import UserListAPIView

from rest_framework import routers
#
# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('users/all/', UserListAPIView.as_view())
]
