from django.contrib import admin
from courses.models import Course, Module, Slide, Enrollment


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1


class SlideInline(admin.TabularInline):
    model = Slide
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_published', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    inlines = [SlideInline]


@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    list_display = ('module', 'slide_type', 'order')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at', 'progress_pct')
