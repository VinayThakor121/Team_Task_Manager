from bson import ObjectId
from flask import Blueprint, request, g

from middleware.auth_middleware import jwt_required
from services.resume_service import upload_resume, list_resumes
from utils.response import success, failure


resume_bp = Blueprint("resumes", __name__)


@resume_bp.post("/upload")
@jwt_required
def upload_resume_handler():
    file = request.files.get("file")
    resume, error = upload_resume(ObjectId(g.current_user["_id"]), file)
    if error:
        return failure(error, 400)
    return success(resume, "Resume uploaded", 201)


@resume_bp.get("")
@jwt_required
def list_resume_handler():
    resumes = list_resumes(ObjectId(g.current_user["_id"]))
    return success(resumes)
