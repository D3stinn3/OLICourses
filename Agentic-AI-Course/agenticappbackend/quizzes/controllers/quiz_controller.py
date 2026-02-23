from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth

from quizzes.schemas import QuizOutSchema, SubmitQuizSchema, QuizResultSchema
from quizzes.services.quiz_service import QuizService


@api_controller("/quizzes", tags=["Quizzes"])
class QuizController(ControllerBase):
    @route.get("/module/{module_id}", response=QuizOutSchema)
    def get_quiz(self, module_id: int):
        quiz = QuizService.get_quiz_for_module(module_id)
        return {
            "id": quiz.id,
            "title": quiz.title,
            "questions": [
                {
                    "id": q.id,
                    "text": q.text,
                    "choices": [
                        {"id": c.id, "text": c.text}
                        for c in q.choices.all()
                    ],
                }
                for q in quiz.questions.all()
            ],
        }

    @route.post("/{quiz_id}/submit", response=QuizResultSchema, auth=JWTAuth())
    def submit_quiz(self, request, quiz_id: int, data: SubmitQuizSchema):
        return QuizService.grade_submission(request.user, quiz_id, data.answers)
