from django.contrib import admin
from .models import EngagementSnapshot, EngagementSummary, EngagementConsent


@admin.register(EngagementSnapshot)
class EngagementSnapshotAdmin(admin.ModelAdmin):
    list_display = ("user", "emotion", "engagement_score", "face_detected", "created_at")
    list_filter = ("emotion", "face_detected")


@admin.register(EngagementSummary)
class EngagementSummaryAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "session_date", "avg_engagement", "dominant_emotion")
    list_filter = ("session_date",)


@admin.register(EngagementConsent)
class EngagementConsentAdmin(admin.ModelAdmin):
    list_display = ("user", "enabled", "consented_at")
