from ninja import Schema


class ChatMessageSchema(Schema):
    role: str
    content: str


class ChatRequestSchema(Schema):
    course_slug: str
    messages: list[ChatMessageSchema]
    slide_context: str = ""


class ChatMessageOutSchema(Schema):
    id: int
    role: str
    content: str
    created_at: str


class ChatHistoryOutSchema(Schema):
    session_id: int
    messages: list[ChatMessageOutSchema]
