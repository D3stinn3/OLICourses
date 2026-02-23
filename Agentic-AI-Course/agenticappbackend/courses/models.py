from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Slide(models.Model):
    SLIDE_TYPE_CHOICES = [
        ('title', 'Title'),
        ('content', 'Content'),
        ('end', 'End'),
    ]

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='slides')
    slide_type = models.CharField(max_length=20, choices=SLIDE_TYPE_CHOICES, default='content')
    content = models.JSONField(default=dict)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_pct = models.FloatField(default=0.0)

    class Meta:
        unique_together = ['user', 'course']
