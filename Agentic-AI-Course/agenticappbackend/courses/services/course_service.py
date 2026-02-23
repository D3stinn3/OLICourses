from courses.models import Course, Slide, Enrollment


class CourseService:
    @staticmethod
    def list_published():
        return Course.objects.filter(is_published=True)

    @staticmethod
    def get_by_slug(slug):
        return Course.objects.prefetch_related('modules').get(slug=slug)

    @staticmethod
    def get_slides(slug):
        return Slide.objects.filter(module__course__slug=slug).order_by('module__order', 'order')

    @staticmethod
    def enroll(user, slug):
        course = Course.objects.get(slug=slug)
        enrollment, _ = Enrollment.objects.get_or_create(user=user, course=course)
        return enrollment

    @staticmethod
    def get_user_enrollments(user):
        return Enrollment.objects.filter(user=user).select_related('course')
