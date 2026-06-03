from bson import ObjectId
from flask import Blueprint, request, g

from middleware.auth_middleware import jwt_required
from services.interview_service import (
    create_interview,
    get_user_interviews,
    get_interview_by_id,
    delete_interview,
)
from services.resume_service import get_resume_by_id
from utils.response import success, failure


interview_bp = Blueprint("interviews", __name__)


@interview_bp.post("/create")
@jwt_required
def create_interview_handler():
    payload = request.get_json(silent=True) or {}

    resume_context = ""
    resume_id = payload.get("resumeId")
    if resume_id:
        resume = get_resume_by_id(g.current_user["_id"], resume_id)
        if resume:
            resume_context = resume.get("textSummary", "")

    interview = create_interview(
        user_id=ObjectId(g.current_user["_id"]),
        payload=payload,
        resume_context=resume_context,
    )

    return success(interview, "Interview created", 201)


@interview_bp.get("")
@jwt_required
def list_interviews_handler():
    items = get_user_interviews(g.current_user["_id"])
    return success(items)


@interview_bp.get("/<interview_id>")
@jwt_required
def get_interview_handler(interview_id):
    interview = get_interview_by_id(interview_id, g.current_user["_id"])
    if not interview:
        return failure("Interview not found", 404)
    return success(interview)


@interview_bp.delete("/<interview_id>")
@jwt_required
def delete_interview_handler(interview_id):
    deleted = delete_interview(interview_id, g.current_user["_id"])
    if not deleted:
        return failure("Interview not found", 404)
    return success({"deleted": True}, "Interview deleted")
