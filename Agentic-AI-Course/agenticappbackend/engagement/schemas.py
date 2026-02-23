from ninja import Schema
from datetime import datetime


class AnalyzeFrameSchema(Schema):
    image: str  # base64 encoded image
    course_slug: str


class EngagementResultSchema(Schema):
    emotion: str
    emotion_confidence: float
    gaze_pitch: float
    gaze_yaw: float
    engagement_score: float
    face_detected: bool
    adaptive_hint: str = ""


class EngagementSummaryOutSchema(Schema):
    session_date: str
    avg_engagement: float
    dominant_emotion: str
    total_minutes: float
    attention_drops: int


class ConsentSchema(Schema):
    enabled: bool


class ConsentOutSchema(Schema):
    enabled: bool
    consented_at: datetime | None = None
