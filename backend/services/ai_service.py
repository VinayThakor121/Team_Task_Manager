import json
import re

import google.generativeai as genai

from config.env import Config


DEFAULT_QUESTIONS = [
    "Walk me through a challenging project you delivered recently.",
    "How do you debug performance issues in production systems?",
    "Explain a technical decision where you had to trade speed for quality.",
    "How do you approach collaboration during ambiguous requirements?",
    "Describe how you ensure code quality in a fast-moving team.",
]

BASE_SCORE = 40
TEXT_LENGTH_FACTOR = 20
MIN_TECHNICAL_SCORE = 35
MIN_COMMUNICATION_SCORE = 35
MIN_CONFIDENCE_SCORE = 30
MAX_SCORE = 95
TECHNICAL_OFFSET = 5
COMMUNICATION_OFFSET = 5


def _get_model():
    if not Config.GEMINI_API_KEY:
        return None
    genai.configure(api_key=Config.GEMINI_API_KEY)
    return genai.GenerativeModel(Config.GEMINI_MODEL)


def _parse_json_array(raw_text):
    raw_text = raw_text.strip()
    match = re.search(r"\[.*\]", raw_text, flags=re.S)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
        if isinstance(parsed, list):
            return [str(item) for item in parsed]
    except Exception:
        return None


def generate_interview_questions(role, experience_level, tech_stack, interview_type, resume_context="", count=8):
    """Generate interview questions for role/level/stack/type and optional resume context.

    Returns a list of string questions. Falls back to defaults when Gemini is unavailable
    or output cannot be parsed into a JSON array.
    """
    model = _get_model()
    if not model:
        return DEFAULT_QUESTIONS[:count]

    prompt = f"""
You are creating interview questions for role: {role}
Experience level: {experience_level}
Tech stack: {tech_stack}
Interview type: {interview_type}
Resume context: {resume_context}

Return exactly {count} interview questions as a JSON array of strings.
Include technical, behavioral, and follow-up style questions.
Return only raw JSON with no markdown, no prefix, and no suffix.
"""

    response = model.generate_content(prompt)
    parsed = _parse_json_array(getattr(response, "text", ""))
    if parsed and len(parsed) >= 3:
        return parsed[:count]
    return DEFAULT_QUESTIONS[:count]


def generate_feedback_from_transcript(role, transcript):
    """Generate structured feedback from interview transcript content.

    Args:
        role: Target interview role as string.
        transcript: List of transcript entries with speaker/text fields.

    Returns:
        Dict with overall/technical/communication/confidence scores, strengths,
        weaknesses, suggestions, and topicAnalysis containing strong/weak topics.
    """
    normalized_transcript = transcript if isinstance(transcript, list) else []
    transcript_text = "\n".join(
        [f"{item.get('speaker', 'candidate')}: {item.get('text', '')}" for item in normalized_transcript]
    )

    model = _get_model()
    if model:
        prompt = f"""
You are an interview evaluator.
Role: {role}
Transcript:\n{transcript_text}

Return strict JSON object with keys:
overallScore, technicalScore, communicationScore, confidenceScore, strengths, weaknesses, suggestions, topicAnalysis

Rules:
- All scores are integers 0..100
- strengths/weaknesses/suggestions are arrays of strings (3 to 5 each)
- topicAnalysis is object with strongTopics and weakTopics arrays
"""
        response = model.generate_content(prompt)
        raw = getattr(response, "text", "")
        try:
            match = re.search(r"\{.*\}", raw, flags=re.S)
            if match:
                parsed = json.loads(match.group(0))
                return parsed
        except Exception:
            pass

    length_score = min(100, BASE_SCORE + len(transcript_text) // TEXT_LENGTH_FACTOR)
    technical = max(MIN_TECHNICAL_SCORE, min(MAX_SCORE, length_score - TECHNICAL_OFFSET))
    communication = max(MIN_COMMUNICATION_SCORE, min(MAX_SCORE, length_score + COMMUNICATION_OFFSET))
    confidence = max(MIN_CONFIDENCE_SCORE, min(MAX_SCORE, length_score))
    overall = round((technical + communication + confidence) / 3)

    return {
        "overallScore": overall,
        "technicalScore": technical,
        "communicationScore": communication,
        "confidenceScore": confidence,
        "strengths": [
            "Maintained clear structure in responses",
            "Shared practical implementation examples",
            "Demonstrated ownership and accountability",
        ],
        "weaknesses": [
            "Some answers lacked deeper edge-case analysis",
            "Could quantify impact of project outcomes more clearly",
            "Could improve concise communication on complex topics",
        ],
        "suggestions": [
            "Practice STAR format for behavioral responses",
            "Add measurable metrics to project explanations",
            "Revise fundamentals for weak technical areas",
        ],
        "topicAnalysis": {
            "strongTopics": ["Project ownership", "Problem solving", "Communication"],
            "weakTopics": ["System design depth", "Optimization trade-offs"],
        },
    }
