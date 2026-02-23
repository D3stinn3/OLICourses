from ninja import Schema


class RegisterSchema(Schema):
    username: str
    email: str
    password: str


class UserOutSchema(Schema):
    id: int
    username: str
    email: str
