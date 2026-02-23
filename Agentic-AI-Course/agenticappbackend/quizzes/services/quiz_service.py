from django.shortcuts import get_object_or_404

from quizzes.models import Quiz, Question, Choice, Attempt


class QuizService:
    @staticmethod
    def get_quiz_for_module(module_id: int) -> Quiz:
        return get_object_or_404(
            Quiz.objects.prefetch_related("questions__choices"),
            module_id=module_id,
        )

    @staticmethod
    def grade_submission(user, quiz_id: int, answers: list) -> dict:
        quiz = get_object_or_404(
            Quiz.objects.prefetch_related("questions__choices"),
            id=quiz_id,
        )

        results = []
        correct = 0
        total = quiz.questions.count()

        answer_map = {a.question_id: a.choice_id for a in answers}

        for question in quiz.questions.all():
            chosen_id = answer_map.get(question.id)
            correct_choice = question.choices.filter(is_correct=True).first()
            is_correct = chosen_id == (correct_choice.id if correct_choice else None)

            if is_correct:
                correct += 1

            results.append({
                "question_id": question.id,
                "chosen_id": chosen_id,
                "correct_id": correct_choice.id if correct_choice else None,
                "is_correct": is_correct,
                "explanation": question.explanation,
            })

        score = (correct / total * 100) if total > 0 else 0.0

        Attempt.objects.create(
            user=user,
            quiz=quiz,
            score=score,
            answers=[
                {"question_id": a.question_id, "choice_id": a.choice_id}
                for a in answers
            ],
        )

        # Award XP and update quest progress
        try:
            from gamification.services.xp_service import XPService
            from gamification.services.quest_service import QuestService
            XPService.update_streak(user)
            xp_result = XPService.award_quiz_xp(user, score)
            QuestService.increment_quest_progress(user, "pass_quiz")
        except Exception:
            xp_result = None

        return {
            "score": score,
            "total": total,
            "correct": correct,
            "results": results,
            "xp": xp_result,
        }
