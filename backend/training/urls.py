from django.urls import path
from .views import TrainingViewSet
training_list = TrainingViewSet.as_view({"get": "list"})
urlpatterns = [path("", training_list, name="training-list")]
