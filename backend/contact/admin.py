from django.contrib import admin
from .models import ServiceRequest


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "email",
        "company",
        "service",
        "status",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "service",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "company",
        "message",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25

    fieldsets = (
        (
            "Customer Information",
            {
                "fields": (
                    "name",
                    "email",
                    "company",
                )
            },
        ),
        (
            "Service Request",
            {
                "fields": (
                    "service",
                    "message",
                )
            },
        ),
        (
            "Request Management",
            {
                "fields": (
                    "status",
                    "admin_notes",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )
