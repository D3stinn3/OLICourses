from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from accounts.controllers.auth_controller import AuthController
from courses.controllers.course_controller import CourseController
from quizzes.controllers.quiz_controller import QuizController
from agentic.controllers.chat_controller import ChatController
from gamification.controllers.gamification_controller import GamificationController
from engagement.controllers.engagement_controller import EngagementController

api = NinjaExtraAPI(
    title="Scwripts API",
    version="1.0.0",
    description="Agentic education platform API",
)

api.register_controllers(
    NinjaJWTDefaultController,
    AuthController,
    CourseController,
    QuizController,
    ChatController,
    GamificationController,
    EngagementController,
)
