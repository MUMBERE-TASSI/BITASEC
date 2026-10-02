from django.urls import path
from .views import ServiceViewSet

service_list = ServiceViewSet.as_view({"get": "list"})
service_detail = ServiceViewSet.as_view({"get": "retrieve"})

urlpatterns = [
    path("", service_list, name="service-list"),
    path("<int:pk>/", service_detail, name="service-detail"),
]
