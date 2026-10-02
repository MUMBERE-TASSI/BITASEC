from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Service
from rest_framework.serializers import ModelSerializer

class ServiceSerializer(ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

class ServiceViewSet(ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
