from engagement.models import EngagementSnapshot


class AdaptiveService:
    @staticmethod
    def get_recent_engagement(user, course, limit=5):
        """Get the average engagement from the last N snapshots with a detected face."""
        snapshots = EngagementSnapshot.objects.filter(
            user=user, course=course, face_detected=True
        ).order_by("-created_at")[:limit]
        if not snapshots:
            return None

        avg_score = sum(s.engagement_score for s in snapshots) / len(snapshots)
        emotions = [s.emotion for s in snapshots]
        dominant = max(set(emotions), key=emotions.count) if emotions else "neutral"

        return {
            "avg_engagement": round(avg_score, 1),
            "dominant_emotion": dominant,
            "snapshot_count": len(snapshots),
        }

    @staticmethod
    def get_tutor_context(user, course):
        """Generate context string for the AI tutor based on engagement data."""
        data = AdaptiveService.get_recent_engagement(user, course)
        if not data:
            return ""

        avg = data["avg_engagement"]
        emotion = data["dominant_emotion"]

        if avg < 30:
            if emotion in ("sad", "fear", "angry"):
                return (
                    "\n[ENGAGEMENT CONTEXT: The student appears frustrated (low engagement, "
                    f"dominant emotion: {emotion}). Be encouraging, break problems into "
                    "smaller steps, and offer concrete analogies. Don't overwhelm them.]"
                )
            return (
                "\n[ENGAGEMENT CONTEXT: The student seems disengaged (low engagement). "
                "Make your response more engaging — ask a thought-provoking question, "
                "share a surprising fact, or suggest an interactive exercise.]"
            )
        elif avg < 50:
            if emotion == "surprise":
                return (
                    "\n[ENGAGEMENT CONTEXT: The student appears confused. "
                    "Simplify your explanation, use a concrete example, "
                    "and check understanding before moving forward.]"
                )
            return (
                "\n[ENGAGEMENT CONTEXT: The student's attention is drifting. "
                "Keep your response concise and end with a question to re-engage them.]"
            )
        elif avg >= 75:
            return (
                "\n[ENGAGEMENT CONTEXT: The student is highly engaged! "
                "You can increase complexity and challenge them with deeper questions.]"
            )
        return ""

    @staticmethod
    def should_suggest_break(user):
        """Check if the student has been showing frustration signals.
        Only considers snapshots where a face was actually detected."""
        recent = EngagementSnapshot.objects.filter(
            user=user, face_detected=True
        ).order_by("-created_at")[:10]
        if len(recent) < 5:
            return False

        low_engagement_count = sum(1 for s in recent if s.engagement_score < 25)
        return low_engagement_count >= 4
