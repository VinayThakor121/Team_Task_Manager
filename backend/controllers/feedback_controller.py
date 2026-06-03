from bson import ObjectId
from flask import Blueprint, request, g

from middleware.auth_middleware import jwt_required
from services.feedback_service import generate_feedback, get_feedback_by_interview
from utils.response import success, failure


feedback_bp = Blueprint("feedback", __name__)


@feedback_bp.post("/generate")
@jwt_required
def generate_feedback_handler():
    payload = request.get_json(silent=True) or {}
    interview_id = payload.get("interviewId")
    session_id = payload.get("sessionId")

    if not interview_id:
        return failure("interviewId is required", 400)

    result, error = generate_feedback(ObjectId(g.current_user["_id"]), interview_id, session_id)
    if error:
        return failure(error, 404)

    return success(result, "Feedback generated")


@feedback_bp.get("/<interview_id>")
@jwt_required
def get_feedback_handler(interview_id):
    feedback = get_feedback_by_interview(ObjectId(g.current_user["_id"]), interview_id)
    if not feedback:
        return failure("Feedback not found", 404)

    return success(feedback)
