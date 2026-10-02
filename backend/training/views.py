from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.serializers import ModelSerializer
from .models import TrainingProgram

class TrainingSerializer(ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = "__all__"

class TrainingViewSet(ReadOnlyModelViewSet):
    queryset = TrainingProgram.objects.filter(is_active=True)
    serializer_class = TrainingSerializer
