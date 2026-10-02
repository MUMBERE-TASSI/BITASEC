from django.urls import path
from .views import ProjectViewSet
project_list = ProjectViewSet.as_view({"get": "list"})
urlpatterns = [path("", project_list, name="project-list")]
