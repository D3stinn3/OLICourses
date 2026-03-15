from django.contrib.auth.models import User

from accounts.schemas import RegisterSchema


class AuthService:
    @staticmethod
    def register(data: RegisterSchema) -> User:
        user = User.objects.create_user(
            username=data.username,
            email=data.email,
            password=data.password,
        )
        return user

    @staticmethod
    def get_profile(user) -> dict:
        profile = getattr(user, "profile", None)
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": profile.bio if profile else "",
            "avatar": profile.avatar if profile else None,
        }
