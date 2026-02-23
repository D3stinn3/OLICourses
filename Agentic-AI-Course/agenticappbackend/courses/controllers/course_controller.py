from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth

from courses.schemas import (
    CourseOutSchema,
    CourseDetailSchema,
    SlideOutSchema,
    EnrollmentOutSchema,
)
from courses.services.course_service import CourseService


@api_controller("/courses", tags=["Courses"])
class CourseController(ControllerBase):
    @route.get("/", response=list[CourseOutSchema])
    def list_courses(self, request):
        return CourseService.list_published()

    @route.get("/enrollments/me", response=list[EnrollmentOutSchema], auth=JWTAuth())
    def my_enrollments(self, request):
        enrollments = CourseService.get_user_enrollments(request.user)
        return [
            {
                "id": e.id,
                "course_slug": e.course.slug,
                "course_name": e.course.name,
                "enrolled_at": str(e.enrolled_at),
                "progress_pct": e.progress_pct,
            }
            for e in enrollments
        ]

    @route.get("/{slug}", response=CourseDetailSchema)
    def get_course(self, request, slug: str):
        course = CourseService.get_by_slug(slug)
        return {
            "id": course.id,
            "name": course.name,
            "slug": course.slug,
            "description": course.description,
            "cover_image": course.cover_image,
            "is_published": course.is_published,
            "modules": list(course.modules.all()),
        }

    @route.get("/{slug}/slides", response=list[SlideOutSchema])
    def get_slides(self, request, slug: str):
        return CourseService.get_slides(slug)

    @route.post("/{slug}/enroll", auth=JWTAuth())
    def enroll(self, request, slug: str):
        CourseService.enroll(request.user, slug)
        return {"message": "Enrolled successfully"}

    @route.post("/{slug}/slide-complete", auth=JWTAuth())
    def slide_complete(self, request, slug: str):
        try:
            from gamification.services.xp_service import XPService
            from gamification.services.quest_service import QuestService
            XPService.update_streak(request.user)
            result = XPService.award_slide_xp(request.user)
            QuestService.increment_quest_progress(request.user, "complete_slides")
            return result
        except Exception:
            return {"xp_awarded": 0}
