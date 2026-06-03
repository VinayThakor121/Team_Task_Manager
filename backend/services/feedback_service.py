from datetime import datetime, timezone
from bson import ObjectId

from config.database import get_db
from services.ai_service import generate_feedback_from_transcript
from utils.serialization import serialize_document


def _safe_score(value):
    try:
        return round(float(value))
    except (TypeError, ValueError):
        return 0


def generate_feedback(user_id, interview_id, session_id=None):
    db = get_db()
    interview = db.interviews.find_one({"_id": ObjectId(interview_id), "userId": str(user_id)})
    if not interview:
        return None, "Interview not found"

    transcript = []
    if session_id:
        session = db.sessions.find_one({"_id": ObjectId(session_id), "userId": str(user_id)})
        if session:
            transcript = session.get("transcript", [])

    scores = generate_feedback_from_transcript(interview.get("role", ""), transcript)

    feedback = {
        "userId": str(user_id),
        "interviewId": interview_id,
        "overallScore": _safe_score(scores.get("overallScore", 0)),
        "technicalScore": _safe_score(scores.get("technicalScore", 0)),
        "communicationScore": _safe_score(scores.get("communicationScore", 0)),
        "confidenceScore": _safe_score(scores.get("confidenceScore", 0)),
        "strengths": scores.get("strengths", []),
        "weaknesses": scores.get("weaknesses", []),
        "suggestions": scores.get("suggestions", []),
        "topicAnalysis": scores.get("topicAnalysis", {"strongTopics": [], "weakTopics": []}),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    db.feedback.update_one(
        {"userId": str(user_id), "interviewId": interview_id},
        {"$set": feedback},
        upsert=True,
    )

    db_feedback = db.feedback.find_one({"userId": str(user_id), "interviewId": interview_id})

    _recompute_user_stats(user_id)
    return serialize_document(db_feedback), None


def get_feedback_by_interview(user_id, interview_id):
    feedback = get_db().feedback.find_one({"userId": str(user_id), "interviewId": interview_id})
    return serialize_document(feedback)


def _recompute_user_stats(user_id):
    db = get_db()
    pipeline = [
        {"$match": {"userId": str(user_id)}},
        {
            "$group": {
                "_id": "$userId",
                "averageScore": {"$avg": "$overallScore"},
                "interviewsCompleted": {"$sum": 1},
            }
        },
    ]

    result = list(db.feedback.aggregate(pipeline))
    if result:
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "averageScore": round(result[0].get("averageScore", 0), 2),
                    "interviewsCompleted": int(result[0].get("interviewsCompleted", 0)),
                    "updatedAt": datetime.now(timezone.utc).isoformat(),
                }
            },
        )
