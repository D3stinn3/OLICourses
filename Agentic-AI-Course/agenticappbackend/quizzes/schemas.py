from ninja import Schema


class ChoiceOutSchema(Schema):
    id: int
    text: str


class QuestionOutSchema(Schema):
    id: int
    text: str
    choices: list[ChoiceOutSchema]


class QuizOutSchema(Schema):
    id: int
    title: str
    questions: list[QuestionOutSchema]


class SubmitAnswerSchema(Schema):
    question_id: int
    choice_id: int


class SubmitQuizSchema(Schema):
    answers: list[SubmitAnswerSchema]


class QuizResultSchema(Schema):
    score: float
    total: int
    correct: int
    results: list[dict]
    xp: dict | None = None
