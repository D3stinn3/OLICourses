import random
from datetime import date
from django.utils import timezone
from gamification.models import DailyQuest, UserQuestProgress
from gamification.services.xp_service import XPService


QUEST_TEMPLATES = [
    {
        "quest_type": "complete_slides",
        "templates": [
            ("Slide Scholar", "Complete {target} slide(s) today"),
            ("Knowledge Seeker", "View {target} slide(s) in any course"),
        ],
        "target_range": (3, 8),
    },
    {
        "quest_type": "pass_quiz",
        "templates": [
            ("Quiz Champion", "Pass {target} quiz(zes) with 60%+ score"),
            ("Test Your Knowledge", "Complete {target} quiz(zes) today"),
        ],
        "target_range": (1, 2),
    },
    {
        "quest_type": "chat_messages",
        "templates": [
            ("Curious Mind", "Ask the AI Tutor {target} question(s)"),
            ("Deep Thinker", "Have {target} exchange(s) with the AI Tutor"),
        ],
        "target_range": (2, 5),
    },
    {
        "quest_type": "explore_3d",
        "templates": [
            ("Visual Explorer", "Explore {target} 3D visualization(s)"),
            ("Spatial Thinker", "Interact with {target} agent architecture visualization(s)"),
        ],
        "target_range": (1, 3),
    },
]


class QuestService:
    @staticmethod
    def get_or_generate_daily_quests(today=None):
        if today is None:
            today = date.today()

        quests = DailyQuest.objects.filter(date=today)
        if quests.exists():
            return quests

        # Generate 3 random quests for today
        selected = random.sample(QUEST_TEMPLATES, min(3, len(QUEST_TEMPLATES)))
        for template_group in selected:
            title_template, desc_template = random.choice(template_group["templates"])
            lo, hi = template_group["target_range"]
            target = random.randint(lo, hi)
            DailyQuest.objects.create(
                title=title_template,
                description=desc_template.format(target=target),
                quest_type=template_group["quest_type"],
                target_value=target,
                xp_reward=25,
                date=today,
            )

        return DailyQuest.objects.filter(date=today)

    @staticmethod
    def get_user_quests(user):
        quests = QuestService.get_or_generate_daily_quests()
        result = []
        for quest in quests:
            progress, _ = UserQuestProgress.objects.get_or_create(
                user=user, quest=quest
            )
            result.append({
                "id": quest.id,
                "title": quest.title,
                "description": quest.description,
                "quest_type": quest.quest_type,
                "target_value": quest.target_value,
                "xp_reward": quest.xp_reward,
                "current_value": progress.current_value,
                "completed": progress.completed,
            })
        return result

    @staticmethod
    def increment_quest_progress(user, quest_type, amount=1):
        today = date.today()
        quests = DailyQuest.objects.filter(date=today, quest_type=quest_type)

        completed_quests = []
        for quest in quests:
            progress, _ = UserQuestProgress.objects.get_or_create(
                user=user, quest=quest
            )
            if progress.completed:
                continue

            progress.current_value += amount
            if progress.current_value >= quest.target_value:
                progress.completed = True
                progress.completed_at = timezone.now()
                XPService.award_xp(
                    user, quest.xp_reward, "challenge",
                    f"Quest completed: {quest.title}"
                )
                completed_quests.append(quest.title)

            progress.save()

        return completed_quests
