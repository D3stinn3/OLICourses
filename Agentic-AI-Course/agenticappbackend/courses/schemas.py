from ninja import Schema


class SlideOutSchema(Schema):
    id: int
    slide_type: str
    content: dict
    order: int


class ModuleOutSchema(Schema):
    id: int
    title: str
    order: int


class CourseOutSchema(Schema):
    id: int
    name: str
    slug: str
    description: str
    cover_image: str | None = None
    is_published: bool


class CourseDetailSchema(Schema):
    id: int
    name: str
    slug: str
    description: str
    cover_image: str | None = None
    is_published: bool
    modules: list[ModuleOutSchema]


class EnrollmentOutSchema(Schema):
    id: int
    course_slug: str
    course_name: str
    enrolled_at: str
    progress_pct: float
