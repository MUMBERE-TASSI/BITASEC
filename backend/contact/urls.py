from django.urls import path
from .views import ServiceRequestCreateView
urlpatterns = [path("", ServiceRequestCreateView.as_view(), name="service-request")]
