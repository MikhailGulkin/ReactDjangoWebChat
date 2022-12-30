from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from users.views import CustomObtainAuthTokenView

urlpatterns = [
    path('admin/', admin.site.urls),

    path("auth-token/", CustomObtainAuthTokenView.as_view()),

    path('api/', include('users.urls')),
    path('api/', include('chats.urls'))
]

urlpatterns += [
    path('api-swagger/schema/', SpectacularAPIView.as_view(), name='schema'),

    path('docs/', SpectacularSwaggerView.as_view(),
         name="swagger-ui"),
]
