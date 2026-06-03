from bson import ObjectId
from flask import Blueprint, request, g

from config.database import get_db
from middleware.auth_middleware import jwt_required
from services.auth_service import signup_user, login_user, update_profile, change_password
from utils.response import success, failure
from utils.serialization import serialize_document


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/signup")
def signup():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    confirm_password = payload.get("confirmPassword", "")

    if not name or not email or not password:
        return failure("Name, email, and password are required", 400)

    if password != confirm_password:
        return failure("Password and confirm password do not match", 400)

    response, error = signup_user(name, email, password)
    if error:
        return failure(error, 409)

    return success(response, "Signup successful", 201)


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    if not email or not password:
        return failure("Email and password are required", 400)

    response, error = login_user(email, password)
    if error:
        return failure(error, 401)

    return success(response, "Login successful")


@auth_bp.get("/profile")
@jwt_required
def profile():
    user = g.current_user
    user.pop("passwordHash", None)
    return success(user)


@auth_bp.put("/profile")
@jwt_required
def update_user_profile():
    payload = request.get_json(silent=True) or {}
    user_id = ObjectId(g.current_user["_id"])

    updated, error = update_profile(user_id, payload)
    if error:
        return failure(error, 409)

    return success(updated, "Profile updated")


@auth_bp.post("/change-password")
@jwt_required
def update_password():
    payload = request.get_json(silent=True) or {}

    current_password = payload.get("currentPassword", "")
    new_password = payload.get("newPassword", "")

    if not current_password or not new_password:
        return failure("Current password and new password are required", 400)

    user = get_db().users.find_one({"_id": ObjectId(g.current_user["_id"])})
    if not user:
        return failure("User not found", 404)

    error = change_password(user, current_password, new_password)
    if error:
        return failure(error, 400)

    updated_user = serialize_document(get_db().users.find_one({"_id": user["_id"]}))
    updated_user.pop("passwordHash", None)
    return success(updated_user, "Password updated")
