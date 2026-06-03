import os
from datetime import datetime, timezone

from bson import ObjectId
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader

from config.database import get_db
from config.env import Config
from utils.serialization import serialize_document


ALLOWED_EXTENSIONS = {"pdf"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_resume(user_id, file_storage):
    if not file_storage or not _allowed_file(file_storage.filename):
        return None, "Only PDF files are supported"

    os.makedirs(Config.UPLOAD_DIR, exist_ok=True)

    timestamp = int(datetime.now(timezone.utc).timestamp())
    filename = secure_filename(file_storage.filename)
    stored_name = f"{user_id}_{timestamp}_{filename}"
    destination = os.path.join(Config.UPLOAD_DIR, stored_name)
    file_storage.save(destination)

    summary = extract_resume_text(destination)

    payload = {
        "userId": str(user_id),
        "fileName": filename,
        "storedPath": destination,
        "size": os.path.getsize(destination),
        "uploadedAt": datetime.now(timezone.utc).isoformat(),
        "textSummary": summary[:5000],
    }

    result = get_db().resumes.insert_one(payload)
    saved = get_db().resumes.find_one({"_id": result.inserted_id})
    return serialize_document(saved), None


def extract_resume_text(path):
    try:
        reader = PdfReader(path)
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages).strip()
    except Exception:
        return ""


def get_resume_by_id(user_id, resume_id):
    resume = get_db().resumes.find_one({"_id": ObjectId(resume_id), "userId": str(user_id)})
    return serialize_document(resume)


def list_resumes(user_id):
    cursor = get_db().resumes.find({"userId": str(user_id)}).sort("uploadedAt", -1)
    return [serialize_document(item) for item in cursor]
