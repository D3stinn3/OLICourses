from datetime import date, timedelta
from django.utils import timezone
from gamification.models import (
    UserXP, XPTransaction, Achievement, UserAchievement,
    LeagueWeek, LeagueEntry,
)


class XPService:
    # XP amounts for different actions
    XP_SLIDE_COMPLETE = 10
    XP_DECK_COMPLETE = 50
    XP_QUIZ_BASE = 20
    XP_QUIZ_MAX = 100
    XP_CHAT_MESSAGE = 5
    XP_QUEST_COMPLETE = 25
    XP_STREAK_MULTIPLIER = 15
    XP_STREAK_CAP = 150

    @staticmethod
    def get_or_create_profile(user):
        profile, _ = UserXP.objects.get_or_create(user=user)
        return profile

    @staticmethod
    def award_xp(user, amount, source, description=""):
        profile = XPService.get_or_create_profile(user)

        XPTransaction.objects.create(
            user=user, amount=amount, source=source, description=description
        )

        profile.total_xp += amount
        old_level = profile.level
        profile.level = XPService._calculate_level(profile.total_xp)
        profile.save()

        # Update weekly league
        XPService._update_league_entry(user, amount)

        leveled_up = profile.level > old_level
        new_achievements = XPService._check_achievements(user)

        return {
            "xp_awarded": amount,
            "total_xp": profile.total_xp,
            "level": profile.level,
            "title": profile.title,
            "leveled_up": leveled_up,
            "new_achievements": [
                {"name": a.name, "icon": a.icon, "xp_reward": a.xp_reward}
                for a in new_achievements
            ],
        }

    @staticmethod
    def update_streak(user):
        profile = XPService.get_or_create_profile(user)
        today = date.today()

        if profile.last_active_date == today:
            return profile.current_streak

        if profile.last_active_date == today - timedelta(days=1):
            profile.current_streak += 1
        elif profile.last_active_date is None or profile.last_active_date < today - timedelta(days=1):
            profile.current_streak = 1

        if profile.current_streak > profile.longest_streak:
            profile.longest_streak = profile.current_streak

        profile.last_active_date = today
        profile.save()

        # Award streak bonus XP
        streak_xp = min(
            profile.current_streak * XPService.XP_STREAK_MULTIPLIER,
            XPService.XP_STREAK_CAP,
        )
        if streak_xp > 0:
            XPService.award_xp(
                user, streak_xp, "streak_bonus",
                f"Day {profile.current_streak} streak bonus"
            )

        return profile.current_streak

    @staticmethod
    def award_quiz_xp(user, score_pct):
        amount = int(
            XPService.XP_QUIZ_BASE
            + (XPService.XP_QUIZ_MAX - XPService.XP_QUIZ_BASE) * (score_pct / 100)
        )
        return XPService.award_xp(user, amount, "quiz", f"Quiz score: {score_pct:.0f}%")

    @staticmethod
    def award_slide_xp(user, is_deck_complete=False):
        result = XPService.award_xp(user, XPService.XP_SLIDE_COMPLETE, "lesson", "Slide completed")
        if is_deck_complete:
            XPService.award_xp(user, XPService.XP_DECK_COMPLETE, "lesson", "Full slide deck completed")
        return result

    @staticmethod
    def award_chat_xp(user):
        return XPService.award_xp(user, XPService.XP_CHAT_MESSAGE, "chat", "AI Tutor interaction")

    @staticmethod
    def get_leaderboard(limit=30):
        week = XPService._get_or_create_current_week()
        entries = (
            LeagueEntry.objects
            .filter(league_week=week)
            .select_related("user", "user__xp_profile")
            .order_by("-xp_earned")[:limit]
        )
        result = []
        for i, entry in enumerate(entries, 1):
            entry.rank = i
            entry.save(update_fields=["rank"])
            xp_profile = getattr(entry.user, "xp_profile", None)
            result.append({
                "rank": i,
                "username": entry.user.username,
                "xp_earned": entry.xp_earned,
                "level": xp_profile.level if xp_profile else 1,
                "league_tier": entry.league_tier,
            })
        return result

    @staticmethod
    def _calculate_level(total_xp):
        thresholds = UserXP.LEVEL_THRESHOLDS
        for level in range(len(thresholds) - 1, 0, -1):
            if total_xp >= thresholds[level - 1]:
                return level
        return 1

    @staticmethod
    def _get_or_create_current_week():
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week, _ = LeagueWeek.objects.get_or_create(
            week_start=week_start, week_end=week_end
        )
        return week

    @staticmethod
    def _update_league_entry(user, xp_amount):
        week = XPService._get_or_create_current_week()
        entry, _ = LeagueEntry.objects.get_or_create(
            user=user, league_week=week
        )
        entry.xp_earned += xp_amount
        entry.save()

    @staticmethod
    def _check_achievements(user):
        unlocked = []
        existing = set(
            UserAchievement.objects.filter(user=user).values_list("achievement_id", flat=True)
        )
        for achievement in Achievement.objects.exclude(id__in=existing):
            if XPService._meets_criteria(user, achievement.criteria):
                UserAchievement.objects.create(user=user, achievement=achievement)
                if achievement.xp_reward > 0:
                    XPTransaction.objects.create(
                        user=user,
                        amount=achievement.xp_reward,
                        source="achievement",
                        description=f"Achievement: {achievement.name}",
                    )
                    profile = UserXP.objects.get(user=user)
                    profile.total_xp += achievement.xp_reward
                    profile.level = XPService._calculate_level(profile.total_xp)
                    profile.save()
                unlocked.append(achievement)
        return unlocked

    @staticmethod
    def _meets_criteria(user, criteria):
        ctype = criteria.get("type", "")
        value = criteria.get("value", 0)

        if ctype == "quiz_count":
            from quizzes.models import Attempt
            return Attempt.objects.filter(user=user).count() >= value
        elif ctype == "xp_total":
            profile = XPService.get_or_create_profile(user)
            return profile.total_xp >= value
        elif ctype == "streak":
            profile = XPService.get_or_create_profile(user)
            return profile.current_streak >= value
        elif ctype == "level":
            profile = XPService.get_or_create_profile(user)
            return profile.level >= value
        elif ctype == "chat_count":
            from agentic.models import ChatMessage
            return ChatMessage.objects.filter(
                session__user=user, role="user"
            ).count() >= value
        return False
