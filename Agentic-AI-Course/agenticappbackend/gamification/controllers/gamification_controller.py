from ninja_extra import api_controller, route, ControllerBase
from ninja_jwt.authentication import JWTAuth

from gamification.schemas import (
    XPProfileSchema,
    XPAwardSchema,
    LeaderboardEntrySchema,
    QuestOutSchema,
    GamificationDashboardSchema,
    AgentOutSchema,
    AgentCapabilityOutSchema,
)
from gamification.services.xp_service import XPService
from gamification.services.quest_service import QuestService
from gamification.models import UserXP, UserAchievement, XPTransaction, UserAgent, AgentCapability


@api_controller("/gamification", tags=["Gamification"])
class GamificationController(ControllerBase):

    @route.get("/profile", auth=JWTAuth(), response=XPProfileSchema)
    def get_profile(self, request):
        profile = XPService.get_or_create_profile(request.user)
        XPService.update_streak(request.user)
        return {
            "total_xp": profile.total_xp,
            "level": profile.level,
            "title": profile.title,
            "current_streak": profile.current_streak,
            "longest_streak": profile.longest_streak,
            "xp_for_next_level": profile.xp_for_next_level,
            "xp_progress_pct": profile.xp_progress_pct,
        }

    @route.get("/dashboard", auth=JWTAuth())
    def get_dashboard(self, request):
        profile = XPService.get_or_create_profile(request.user)
        XPService.update_streak(request.user)
        profile.refresh_from_db()

        recent_xp = XPTransaction.objects.filter(user=request.user)[:10]
        achievements = (
            UserAchievement.objects
            .filter(user=request.user)
            .select_related("achievement")
        )
        quests = QuestService.get_user_quests(request.user)

        return {
            "xp_profile": {
                "total_xp": profile.total_xp,
                "level": profile.level,
                "title": profile.title,
                "current_streak": profile.current_streak,
                "longest_streak": profile.longest_streak,
                "xp_for_next_level": profile.xp_for_next_level,
                "xp_progress_pct": profile.xp_progress_pct,
            },
            "recent_xp": [
                {
                    "amount": t.amount,
                    "source": t.source,
                    "description": t.description,
                    "created_at": t.created_at.isoformat(),
                }
                for t in recent_xp
            ],
            "achievements": [
                {
                    "achievement": {
                        "id": ua.achievement.id,
                        "name": ua.achievement.name,
                        "slug": ua.achievement.slug,
                        "description": ua.achievement.description,
                        "icon": ua.achievement.icon,
                        "xp_reward": ua.achievement.xp_reward,
                    },
                    "unlocked_at": ua.unlocked_at.isoformat(),
                }
                for ua in achievements
            ],
            "quests": quests,
        }

    @route.get("/leaderboard", auth=JWTAuth(), response=list[LeaderboardEntrySchema])
    def get_leaderboard(self, request):
        return XPService.get_leaderboard()

    @route.get("/quests", auth=JWTAuth())
    def get_quests(self, request):
        return QuestService.get_user_quests(request.user)

    @route.post("/xp", auth=JWTAuth())
    def award_xp(self, request, data: XPAwardSchema):
        result = XPService.award_xp(
            request.user, data.amount, data.source, data.description
        )
        return result

    @route.get("/agent", auth=JWTAuth(), response=AgentOutSchema)
    def get_agent(self, request):
        agent, _ = UserAgent.objects.get_or_create(user=request.user)
        return {
            "name": agent.name,
            "personality": agent.personality,
            "capabilities": agent.capabilities,
            "level": agent.level,
        }

    @route.get("/capabilities", auth=JWTAuth(), response=list[AgentCapabilityOutSchema])
    def get_capabilities(self, request):
        profile = XPService.get_or_create_profile(request.user)
        agent, _ = UserAgent.objects.get_or_create(user=request.user)
        caps = AgentCapability.objects.all().order_by("required_user_level")
        return [
            {
                "name": c.name,
                "slug": c.slug,
                "description": c.description,
                "icon": c.icon,
                "required_user_level": c.required_user_level,
                "unlocked": c.slug in agent.capabilities
                            or profile.level >= c.required_user_level,
            }
            for c in caps
        ]
