from datetime import datetime, timezone
from flask_bcrypt import Bcrypt

from config.database import get_db
from utils.jwt_utils import create_access_token
from utils.serialization import serialize_document


bcrypt = Bcrypt()


def init_bcrypt(app):
    bcrypt.init_app(app)


def signup_user(name, email, password):
    db = get_db()
    existing = db.users.find_one({"email": email.lower()})
    if existing:
        return None, "Email already exists"

    now = datetime.now(timezone.utc).isoformat()
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    payload = {
        "name": name.strip(),
        "email": email.lower(),
        "passwordHash": password_hash,
        "createdAt": now,
        "updatedAt": now,
    }

    result = db.users.insert_one(payload)
    user = db.users.find_one({"_id": result.inserted_id})
    token = create_access_token(result.inserted_id)

    serialized = serialize_document(user)
    serialized.pop("passwordHash", None)
    return {"token": token, "user": serialized}, None


def login_user(email, password):
    db = get_db()
    user = db.users.find_one({"email": email.lower()})
    if not user:
        return None, "Invalid email or password"

    if not bcrypt.check_password_hash(user.get("passwordHash", ""), password):
        return None, "Invalid email or password"

    token = create_access_token(user["_id"])
    serialized = serialize_document(user)
    serialized.pop("passwordHash", None)
    return {"token": token, "user": serialized}, None


def update_profile(user_id, data):
    db = get_db()
    updates = {}

    if data.get("name"):
        updates["name"] = data["name"].strip()
    if data.get("email"):
        candidate = data["email"].lower()
        existing = db.users.find_one({"email": candidate, "_id": {"$ne": user_id}})
        if existing:
            return None, "Email already in use"
        updates["email"] = candidate

    updates["updatedAt"] = datetime.now(timezone.utc).isoformat()
    db.users.update_one({"_id": user_id}, {"$set": updates})

    user = db.users.find_one({"_id": user_id})
    serialized = serialize_document(user)
    serialized.pop("passwordHash", None)
    return serialized, None


def change_password(user, current_password, new_password):
    if not bcrypt.check_password_hash(user.get("passwordHash", ""), current_password):
        return "Current password is incorrect"

    password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    get_db().users.update_one(
        {"_id": user["_id"]},
        {"$set": {"passwordHash": password_hash, "updatedAt": datetime.now(timezone.utc).isoformat()}},
    )
    return None
