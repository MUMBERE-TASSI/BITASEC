from django.db import models


class ServiceRequest(models.Model):

    STATUS_NEW = "new"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_REPLIED = "replied"
    STATUS_COMPLETED = "completed"
    STATUS_ARCHIVED = "archived"

    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_REPLIED, "Replied"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_ARCHIVED, "Archived"),
    ]

    SERVICE_CHOICES = [
        ("Cybersecurity", "Cybersecurity"),
        ("Networking", "Networking"),
        ("IoT / Smart Home", "IoT / Smart Home"),
        ("Artificial Intelligence", "Artificial Intelligence"),
        ("Electrical Engineering", "Electrical Engineering"),
        ("Training", "Training"),
        ("Consulting", "Consulting"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=150)

    email = models.EmailField()

    company = models.CharField(
        max_length=180,
        blank=True
    )

    service = models.CharField(
        max_length=120,
        choices=SERVICE_CHOICES
    )

    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW
    )

    admin_notes = models.TextField(
        blank=True,
        help_text="Internal notes. These are not shown to the customer."
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.name} — {self.service} — {self.get_status_display()}"
