from django.contrib import admin

from quizzes.models import Quiz, Question, Choice, Attempt


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "created_at")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "quiz", "order")
    inlines = [ChoiceInline]


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ("text", "question", "is_correct")


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "completed_at")
