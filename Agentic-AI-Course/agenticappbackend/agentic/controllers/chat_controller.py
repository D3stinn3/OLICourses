from django.http import StreamingHttpResponse
from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth

from agentic.models import ChatSession, ChatMessage
from agentic.schemas import ChatRequestSchema, ChatMessageOutSchema
from agentic.services.llm_service import LLMService
from courses.models import Course


@api_controller("/chat", tags=["AI Tutor"])
class ChatController(ControllerBase):
    @route.post("/stream", auth=JWTAuth())
    def stream(self, request, data: ChatRequestSchema):
        course = Course.objects.get(slug=data.course_slug)
        session, _ = ChatSession.objects.get_or_create(user=request.user, course=course)

        # Save user message
        user_msg = data.messages[-1]
        ChatMessage.objects.create(session=session, role=user_msg.role, content=user_msg.content)

        # Award XP for chat interaction
        try:
            from gamification.services.xp_service import XPService
            from gamification.services.quest_service import QuestService
            XPService.update_streak(request.user)
            XPService.award_chat_xp(request.user)
            QuestService.increment_quest_progress(request.user, "chat_messages")
        except Exception:
            pass

        # Get engagement context for adaptive tutoring
        engagement_context = ""
        try:
            from engagement.services.adaptive_service import AdaptiveService
            engagement_context = AdaptiveService.get_tutor_context(request.user, course)
        except Exception:
            pass

        # Build messages for LLM
        messages = [{"role": m.role, "content": m.content} for m in data.messages]

        return StreamingHttpResponse(
            LLMService.stream_response(messages, data.slide_context, engagement_context),
            content_type="text/event-stream",
        )

    @route.get("/history/{course_slug}", auth=JWTAuth(), response=list[ChatMessageOutSchema])
    def history(self, request, course_slug: str):
        course = Course.objects.get(slug=course_slug)
        session = ChatSession.objects.filter(user=request.user, course=course).first()
        if not session:
            return []
        return session.messages.all()
