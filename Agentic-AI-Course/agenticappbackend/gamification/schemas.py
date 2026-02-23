from ninja import Schema
from datetime import datetime


class XPProfileSchema(Schema):
    total_xp: int
    level: int
    title: str
    current_streak: int
    longest_streak: int
    xp_for_next_level: int
    xp_progress_pct: float


class XPTransactionOutSchema(Schema):
    amount: int
    source: str
    description: str
    created_at: datetime


class XPAwardSchema(Schema):
    source: str
    amount: int
    description: str = ""


class AchievementOutSchema(Schema):
    id: int
    name: str
    slug: str
    description: str
    icon: str
    xp_reward: int


class UserAchievementOutSchema(Schema):
    achievement: AchievementOutSchema
    unlocked_at: datetime


class LeaderboardEntrySchema(Schema):
    rank: int
    username: str
    xp_earned: int
    level: int
    league_tier: str


class QuestOutSchema(Schema):
    id: int
    title: str
    description: str
    quest_type: str
    target_value: int
    xp_reward: int
    current_value: int = 0
    completed: bool = False


class GamificationDashboardSchema(Schema):
    xp_profile: XPProfileSchema
    recent_xp: list[XPTransactionOutSchema]
    achievements: list[UserAchievementOutSchema]
    quests: list[QuestOutSchema]


class AgentOutSchema(Schema):
    name: str
    personality: str
    capabilities: list
    level: int


class AgentCapabilityOutSchema(Schema):
    name: str
    slug: str
    description: str
    icon: str
    required_user_level: int
    unlocked: bool = False
