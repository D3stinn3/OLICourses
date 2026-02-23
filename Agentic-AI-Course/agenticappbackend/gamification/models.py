from django.db import models
from django.contrib.auth.models import User


class UserXP(models.Model):
    """Tracks a user's XP, level, and streak data."""

    LEVEL_TITLES = {
        1: "Prompt Novice",
        6: "Tool User",
        11: "ReAct Thinker",
        21: "Agent Architect",
        31: "Swarm Commander",
        41: "Superintelligence",
    }

    LEVEL_THRESHOLDS = [0] + [100 * i + 50 * (i - 1) for i in range(1, 51)]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="xp_profile")
    total_xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "User XP"
        verbose_name_plural = "User XP"

    def __str__(self):
        return f"{self.user.username} — L{self.level} ({self.total_xp} XP)"

    @property
    def title(self):
        for threshold in sorted(self.LEVEL_TITLES.keys(), reverse=True):
            if self.level >= threshold:
                return self.LEVEL_TITLES[threshold]
        return "Prompt Novice"

    @property
    def xp_for_next_level(self):
        if self.level >= 50:
            return 0
        return self.LEVEL_THRESHOLDS[self.level] - self.total_xp

    @property
    def xp_progress_pct(self):
        if self.level >= 50:
            return 100.0
        prev = self.LEVEL_THRESHOLDS[self.level - 1] if self.level > 1 else 0
        nxt = self.LEVEL_THRESHOLDS[self.level]
        span = nxt - prev
        if span == 0:
            return 100.0
        return round(((self.total_xp - prev) / span) * 100, 1)


class XPTransaction(models.Model):
    SOURCE_CHOICES = [
        ("lesson", "Lesson Completed"),
        ("quiz", "Quiz Completed"),
        ("chat", "AI Tutor Interaction"),
        ("challenge", "Challenge Completed"),
        ("streak_bonus", "Streak Bonus"),
        ("achievement", "Achievement Unlocked"),
        ("exploration", "3D Exploration"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="xp_transactions")
    amount = models.IntegerField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} +{self.amount} XP ({self.source})"


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=10, default="🏆")
    xp_reward = models.PositiveIntegerField(default=50)
    criteria = models.JSONField(
        help_text='e.g. {"type": "quiz_count", "value": 1}'
    )

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "achievement")

    def __str__(self):
        return f"{self.user.username} — {self.achievement.name}"


class LeagueWeek(models.Model):
    week_start = models.DateField()
    week_end = models.DateField()

    class Meta:
        ordering = ["-week_start"]

    def __str__(self):
        return f"Week {self.week_start} – {self.week_end}"


class LeagueEntry(models.Model):
    TIER_CHOICES = [
        ("reactive", "Reactive League"),
        ("deliberative", "Deliberative League"),
        ("autonomous", "Autonomous League"),
        ("swarm", "Swarm League"),
        ("superintelligence", "Superintelligence League"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="league_entries")
    league_week = models.ForeignKey(LeagueWeek, on_delete=models.CASCADE, related_name="entries")
    league_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default="reactive")
    xp_earned = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "league_week")
        ordering = ["-xp_earned"]

    def __str__(self):
        return f"{self.user.username} — {self.league_tier} (#{self.rank})"


class DailyQuest(models.Model):
    QUEST_TYPES = [
        ("complete_slides", "Complete Slides"),
        ("pass_quiz", "Pass a Quiz"),
        ("chat_messages", "Chat with AI Tutor"),
        ("explore_3d", "Explore 3D Visualizations"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    quest_type = models.CharField(max_length=20, choices=QUEST_TYPES)
    target_value = models.PositiveIntegerField(default=1)
    xp_reward = models.PositiveIntegerField(default=25)
    date = models.DateField()

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date}: {self.title}"


class UserQuestProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quest_progress")
    quest = models.ForeignKey(DailyQuest, on_delete=models.CASCADE, related_name="user_progress")
    current_value = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "quest")

    def __str__(self):
        status = "Done" if self.completed else f"{self.current_value}/{self.quest.target_value}"
        return f"{self.user.username} — {self.quest.title} ({status})"


class UserAgent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="agent")
    name = models.CharField(max_length=50, default="My Agent")
    personality = models.CharField(max_length=100, default="Curious and helpful")
    capabilities = models.JSONField(default=list)
    level = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Agent — L{self.level}"


class AgentCapability(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=10, default="⚡")
    required_user_level = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name_plural = "Agent capabilities"

    def __str__(self):
        return f"{self.icon} {self.name} (L{self.required_user_level}+)"
