from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController

from accounts.schemas import RegisterSchema, UserOutSchema
from accounts.services.auth_service import AuthService


@api_controller("/auth", tags=["Auth"])
class AuthController(ControllerBase):
    @route.post("/register", response=UserOutSchema)
    def register(self, data: RegisterSchema):
        user = AuthService.register(data)
        return user

    @route.get("/me", response=UserOutSchema, auth=JWTAuth())
    def me(self, request):
        return AuthService.get_profile(request.user)
