from datetime import datetime, timezone
from bson import ObjectId

from config.database import get_db
from utils.serialization import serialize_document
from services.ai_service import generate_interview_questions


def create_interview(user_id, payload, resume_context=""):
    role = payload.get("role", "Software Engineer")
    experience_level = payload.get("experienceLevel", "Mid")
    tech_stack = payload.get("techStack", "JavaScript")
    interview_type = payload.get("interviewType", "Mixed")

    questions = generate_interview_questions(
        role=role,
        experience_level=experience_level,
        tech_stack=tech_stack,
        interview_type=interview_type,
        resume_context=resume_context,
        count=payload.get("questionCount", 8),
    )

    doc = {
        "userId": str(user_id),
        "role": role,
        "experienceLevel": experience_level,
        "techStack": [item.strip() for item in tech_stack.split(",") if item.strip()],
        "interviewType": interview_type,
        "questions": questions,
        "resumeId": payload.get("resumeId"),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    result = get_db().interviews.insert_one(doc)
    interview = get_db().interviews.find_one({"_id": result.inserted_id})
    return serialize_document(interview)


def get_user_interviews(user_id):
    cursor = get_db().interviews.find({"userId": str(user_id)}).sort("createdAt", -1)
    return [serialize_document(item) for item in cursor]


def get_interview_by_id(interview_id, user_id):
    interview = get_db().interviews.find_one({"_id": ObjectId(interview_id), "userId": str(user_id)})
    return serialize_document(interview)


def delete_interview(interview_id, user_id):
    result = get_db().interviews.delete_one({"_id": ObjectId(interview_id), "userId": str(user_id)})
    if result.deleted_count:
        get_db().sessions.delete_many({"interviewId": interview_id, "userId": str(user_id)})
        get_db().feedback.delete_many({"interviewId": interview_id, "userId": str(user_id)})
    return result.deleted_count > 0
