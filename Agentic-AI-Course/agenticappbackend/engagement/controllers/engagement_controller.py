from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth
from django.utils import timezone

from courses.models import Course
from engagement.models import EngagementSnapshot, EngagementSummary, EngagementConsent
from engagement.schemas import (
    AnalyzeFrameSchema,
    EngagementResultSchema,
    EngagementSummaryOutSchema,
    ConsentSchema,
    ConsentOutSchema,
)
from engagement.services.face_service import FaceService
from engagement.services.adaptive_service import AdaptiveService


@api_controller("/engagement", tags=["Engagement"])
class EngagementController(ControllerBase):
    @route.post("/analyze", auth=JWTAuth(), response=EngagementResultSchema)
    def analyze(self, request, data: AnalyzeFrameSchema):
        """Analyze a webcam frame for emotion and gaze data."""
        # Check consent
        consent = EngagementConsent.objects.filter(user=request.user).first()
        if not consent or not consent.enabled:
            return 403, {"detail": "Engagement tracking not enabled"}

        course = Course.objects.get(slug=data.course_slug)
        result = FaceService.analyze_frame(data.image)

        # Save snapshot (never store raw image)
        EngagementSnapshot.objects.create(
            user=request.user,
            course=course,
            emotion=result["emotion"],
            emotion_confidence=result["emotion_confidence"],
            gaze_pitch=result["gaze_pitch"],
            gaze_yaw=result["gaze_yaw"],
            engagement_score=result["engagement_score"],
            face_detected=result["face_detected"],
        )

        # Add adaptive hint
        hint = FaceService.get_adaptive_hint(result["emotion"], result["engagement_score"])
        result["adaptive_hint"] = hint

        return result

    @route.get(
        "/summary/{course_slug}",
        auth=JWTAuth(),
        response=list[EngagementSummaryOutSchema],
    )
    def summary(self, request, course_slug: str):
        """Get engagement summaries for a course."""
        course = Course.objects.get(slug=course_slug)
        summaries = EngagementSummary.objects.filter(
            user=request.user, course=course
        )[:30]
        return [
            {
                "session_date": str(s.session_date),
                "avg_engagement": s.avg_engagement,
                "dominant_emotion": s.dominant_emotion,
                "total_minutes": s.total_minutes,
                "attention_drops": s.attention_drops,
            }
            for s in summaries
        ]

    @route.get("/live/{course_slug}", auth=JWTAuth())
    def live(self, request, course_slug: str):
        """Get live engagement data for the current session."""
        course = Course.objects.get(slug=course_slug)
        data = AdaptiveService.get_recent_engagement(request.user, course)
        suggest_break = AdaptiveService.should_suggest_break(request.user)
        return {
            "engagement": data,
            "suggest_break": suggest_break,
        }

    @route.post("/consent", auth=JWTAuth(), response=ConsentOutSchema)
    def update_consent(self, request, data: ConsentSchema):
        """Update engagement tracking consent."""
        consent, _ = EngagementConsent.objects.get_or_create(user=request.user)
        consent.enabled = data.enabled
        if data.enabled:
            consent.consented_at = timezone.now()
            consent.revoked_at = None
        else:
            consent.revoked_at = timezone.now()
            # Delete all engagement data when user revokes consent
            EngagementSnapshot.objects.filter(user=request.user).delete()
            EngagementSummary.objects.filter(user=request.user).delete()
        consent.save()
        return {"enabled": consent.enabled, "consented_at": consent.consented_at}

    @route.get("/consent", auth=JWTAuth(), response=ConsentOutSchema)
    def get_consent(self, request):
        """Get current consent status."""
        consent = EngagementConsent.objects.filter(user=request.user).first()
        if not consent:
            return {"enabled": False, "consented_at": None}
        return {"enabled": consent.enabled, "consented_at": consent.consented_at}
