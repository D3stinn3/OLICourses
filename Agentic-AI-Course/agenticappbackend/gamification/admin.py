from django.contrib import admin
from .models import (
    UserXP, XPTransaction, Achievement, UserAchievement,
    LeagueWeek, LeagueEntry, DailyQuest, UserQuestProgress,
    UserAgent, AgentCapability,
)


@admin.register(UserXP)
class UserXPAdmin(admin.ModelAdmin):
    list_display = ("user", "total_xp", "level", "current_streak", "last_active_date")
    list_filter = ("level",)
    search_fields = ("user__username",)


@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "source", "description", "created_at")
    list_filter = ("source",)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("icon", "name", "xp_reward")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ("user", "achievement", "unlocked_at")


@admin.register(LeagueWeek)
class LeagueWeekAdmin(admin.ModelAdmin):
    list_display = ("week_start", "week_end")


@admin.register(LeagueEntry)
class LeagueEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "league_tier", "xp_earned", "rank")
    list_filter = ("league_tier",)


@admin.register(DailyQuest)
class DailyQuestAdmin(admin.ModelAdmin):
    list_display = ("title", "quest_type", "target_value", "xp_reward", "date")
    list_filter = ("quest_type", "date")


@admin.register(UserQuestProgress)
class UserQuestProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "quest", "current_value", "completed")


@admin.register(UserAgent)
class UserAgentAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "level")


@admin.register(AgentCapability)
class AgentCapabilityAdmin(admin.ModelAdmin):
    list_display = ("icon", "name", "required_user_level")
    prepopulated_fields = {"slug": ("name",)}
