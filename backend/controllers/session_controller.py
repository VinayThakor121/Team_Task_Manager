from bson import ObjectId
from flask import Blueprint, request, g

from config.env import Config
from middleware.auth_middleware import jwt_required
from services.session_service import start_session, end_session, get_session_by_id
from utils.response import success, failure


session_bp = Blueprint("sessions", __name__)


@session_bp.post("/start")
@jwt_required
def start_session_handler():
    payload = request.get_json(silent=True) or {}
    interview_id = payload.get("interviewId")

    if not interview_id:
        return failure("interviewId is required", 400)

    session = start_session(ObjectId(g.current_user["_id"]), interview_id)
    return success(
        {
            **session,
            "vapi": {
                "webToken": Config.VAPI_WEB_TOKEN,
                "workflowId": Config.VAPI_WORKFLOW_ID,
            },
        },
        "Session started",
        201,
    )


@session_bp.post("/end")
@jwt_required
def end_session_handler():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("sessionId")
    transcript = payload.get("transcript", [])
    duration = payload.get("duration", 0)

    if not session_id:
        return failure("sessionId is required", 400)

    session = end_session(
        ObjectId(g.current_user["_id"]),
        session_id,
        transcript,
        duration,
        payload.get("status", "completed"),
    )

    if not session:
        return failure("Session not found", 404)

    return success(session, "Session ended")


@session_bp.get("/<session_id>")
@jwt_required
def get_session_handler(session_id):
    session = get_session_by_id(ObjectId(g.current_user["_id"]), session_id)
    if not session:
        return failure("Session not found", 404)
    return success(session)
