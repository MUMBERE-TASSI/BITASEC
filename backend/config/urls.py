from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/services/", include("services.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/training/", include("training.urls")),
    path("api/contact/", include("contact.urls")),

    path("api/translate/", include("translation.urls")),
]
