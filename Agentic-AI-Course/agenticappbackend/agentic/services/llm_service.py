from django.conf import settings
import anthropic


class LLMService:
    SYSTEM_PROMPT = (
        "You are Scwripts AI Tutor, an expert in Agentic AI. "
        "You help students understand concepts from their course. "
        "Be encouraging and use the Socratic method when possible. "
        "If slide context is provided, reference it in your answers.\n\n"
        "Format your responses using Markdown for clarity:\n"
        "- Use **bold** for key terms and concepts\n"
        "- Use bullet points and numbered lists to organize information\n"
        "- Use `code` formatting for technical terms, function names, or code snippets\n"
        "- Use headings (##, ###) to structure longer explanations\n"
        "- Use > blockquotes for important takeaways or definitions\n"
        "- Keep paragraphs concise and well-spaced\n"
        "- Use tables when comparing concepts side-by-side"
    )

    @staticmethod
    def stream_response(messages: list, slide_context: str = "", engagement_context: str = ""):
        api_key = getattr(settings, "ANTHROPIC_API_KEY", "")
        if not api_key:
            yield "data: API key not configured. Set ANTHROPIC_API_KEY environment variable.\n\n"
            return

        client = anthropic.Anthropic(api_key=api_key)

        system = LLMService.SYSTEM_PROMPT
        if slide_context:
            system += f"\n\nSlide Context:\n{slide_context}"
        if engagement_context:
            system += engagement_context

        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\n\n"
