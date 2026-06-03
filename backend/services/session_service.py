from datetime import datetime, timezone
from bson import ObjectId

from config.database import get_db
from utils.serialization import serialize_document


def start_session(user_id, interview_id):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "userId": str(user_id),
        "interviewId": interview_id,
        "transcript": [],
        "duration": 0,
        "status": "in_progress",
        "createdAt": now,
        "updatedAt": now,
    }
    result = get_db().sessions.insert_one(doc)
    session = get_db().sessions.find_one({"_id": result.inserted_id})
    return serialize_document(session)


def end_session(user_id, session_id, transcript, duration, status="completed"):
    updates = {
        "transcript": transcript or [],
        "duration": duration or 0,
        "status": status,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    get_db().sessions.update_one(
        {"_id": ObjectId(session_id), "userId": str(user_id)},
        {"$set": updates},
    )
    session = get_db().sessions.find_one({"_id": ObjectId(session_id), "userId": str(user_id)})
    return serialize_document(session)


def get_session_by_id(user_id, session_id):
    session = get_db().sessions.find_one({"_id": ObjectId(session_id), "userId": str(user_id)})
    return serialize_document(session)
