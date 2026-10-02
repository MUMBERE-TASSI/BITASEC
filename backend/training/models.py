from django.db import models

class TrainingProgram(models.Model):
    title = models.CharField(max_length=180)
    description = models.TextField()
    duration = models.CharField(max_length=100, blank=True)
    mode = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
