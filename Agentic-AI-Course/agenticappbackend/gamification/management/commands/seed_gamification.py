from django.core.management.base import BaseCommand
from gamification.models import Achievement, AgentCapability


class Command(BaseCommand):
    help = "Seed default achievements and agent capabilities"

    def handle(self, *args, **options):
        achievements = [
            {
                "name": "First Steps",
                "slug": "first-steps",
                "description": "Complete your first slide",
                "icon": "👣",
                "xp_reward": 25,
                "criteria": {"type": "xp_total", "value": 10},
            },
            {
                "name": "Quiz Rookie",
                "slug": "quiz-rookie",
                "description": "Complete your first quiz",
                "icon": "📝",
                "xp_reward": 50,
                "criteria": {"type": "quiz_count", "value": 1},
            },
            {
                "name": "Curious Mind",
                "slug": "curious-mind",
                "description": "Ask the AI Tutor 10 questions",
                "icon": "🧠",
                "xp_reward": 75,
                "criteria": {"type": "chat_count", "value": 10},
            },
            {
                "name": "Streak Starter",
                "slug": "streak-starter",
                "description": "Maintain a 3-day learning streak",
                "icon": "🔥",
                "xp_reward": 50,
                "criteria": {"type": "streak", "value": 3},
            },
            {
                "name": "Week Warrior",
                "slug": "week-warrior",
                "description": "Maintain a 7-day learning streak",
                "icon": "⚔️",
                "xp_reward": 100,
                "criteria": {"type": "streak", "value": 7},
            },
            {
                "name": "Century Club",
                "slug": "century-club",
                "description": "Earn 1,000 total XP",
                "icon": "💯",
                "xp_reward": 100,
                "criteria": {"type": "xp_total", "value": 1000},
            },
            {
                "name": "Tool User",
                "slug": "tool-user",
                "description": "Reach Level 6 — Tool User",
                "icon": "🔧",
                "xp_reward": 150,
                "criteria": {"type": "level", "value": 6},
            },
            {
                "name": "ReAct Thinker",
                "slug": "react-thinker",
                "description": "Reach Level 11 — ReAct Thinker",
                "icon": "💭",
                "xp_reward": 200,
                "criteria": {"type": "level", "value": 11},
            },
            {
                "name": "Agent Architect",
                "slug": "agent-architect",
                "description": "Reach Level 21 — Agent Architect",
                "icon": "🏗️",
                "xp_reward": 300,
                "criteria": {"type": "level", "value": 21},
            },
            {
                "name": "Quiz Master",
                "slug": "quiz-master",
                "description": "Complete 10 quizzes",
                "icon": "🎓",
                "xp_reward": 200,
                "criteria": {"type": "quiz_count", "value": 10},
            },
        ]

        for data in achievements:
            Achievement.objects.update_or_create(
                slug=data["slug"],
                defaults=data,
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(achievements)} achievements"))

        capabilities = [
            {
                "name": "Basic Q&A",
                "slug": "basic-qa",
                "description": "Your agent can answer simple yes/no questions",
                "icon": "💬",
                "required_user_level": 1,
            },
            {
                "name": "Explanation",
                "slug": "explanation",
                "description": "Your agent can provide detailed explanations",
                "icon": "📖",
                "required_user_level": 3,
            },
            {
                "name": "Web Search",
                "slug": "web-search",
                "description": "Your agent can search the web for information",
                "icon": "🔍",
                "required_user_level": 6,
            },
            {
                "name": "Code Analysis",
                "slug": "code-analysis",
                "description": "Your agent can read and analyze code",
                "icon": "💻",
                "required_user_level": 10,
            },
            {
                "name": "Memory",
                "slug": "memory",
                "description": "Your agent remembers previous conversations",
                "icon": "🧠",
                "required_user_level": 15,
            },
            {
                "name": "Planning",
                "slug": "planning",
                "description": "Your agent can create multi-step plans",
                "icon": "📋",
                "required_user_level": 20,
            },
            {
                "name": "Tool Use",
                "slug": "tool-use",
                "description": "Your agent can call external tools and APIs",
                "icon": "🔧",
                "required_user_level": 25,
            },
            {
                "name": "Delegation",
                "slug": "delegation",
                "description": "Your agent can delegate tasks to sub-agents",
                "icon": "👥",
                "required_user_level": 30,
            },
            {
                "name": "Self-Reflection",
                "slug": "self-reflection",
                "description": "Your agent can evaluate and improve its own responses",
                "icon": "🪞",
                "required_user_level": 35,
            },
            {
                "name": "Autonomy",
                "slug": "autonomy",
                "description": "Your agent can operate fully autonomously",
                "icon": "🚀",
                "required_user_level": 40,
            },
        ]

        for data in capabilities:
            AgentCapability.objects.update_or_create(
                slug=data["slug"],
                defaults=data,
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(capabilities)} agent capabilities"))
