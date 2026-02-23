from django.db import models
from django.contrib.auth.models import User
from courses.models import Course


class EngagementSnapshot(models.Model):
    """A single facial analysis data point during a learning session."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="engagement_snapshots")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="engagement_snapshots")
    emotion = models.CharField(max_length=20)
    emotion_confidence = models.FloatField(default=0.0)
    gaze_pitch = models.FloatField(default=0.0)
    gaze_yaw = models.FloatField(default=0.0)
    engagement_score = models.FloatField(default=0.0)
    face_detected = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} — {self.emotion} ({self.engagement_score:.0f}%)"


class EngagementSummary(models.Model):
    """Daily aggregated engagement data per user per course."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="engagement_summaries")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="engagement_summaries")
    session_date = models.DateField()
    avg_engagement = models.FloatField(default=0.0)
    dominant_emotion = models.CharField(max_length=20, default="neutral")
    total_minutes = models.FloatField(default=0.0)
    attention_drops = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "course", "session_date")
        ordering = ["-session_date"]

    def __str__(self):
        return f"{self.user.username} — {self.course.slug} ({self.session_date})"


class EngagementConsent(models.Model):
    """Tracks whether a user has opted in to facial engagement tracking."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="engagement_consent")
    enabled = models.BooleanField(default=False)
    consented_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = "Enabled" if self.enabled else "Disabled"
        return f"{self.user.username} — {status}"
