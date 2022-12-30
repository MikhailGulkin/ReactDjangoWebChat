from django.urls import path
from .views import UserListAPIView

urlpatterns = [
    path('users/all/', UserListAPIView.as_view())
]
