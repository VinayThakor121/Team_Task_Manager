from functools import wraps
import logging
from flask import request, g
import jwt
from bson import ObjectId

from config.database import get_db
from config.env import Config
from utils.serialization import serialize_document


def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return {"success": False, "message": "Missing authorization token"}, 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")

            user = get_db().users.find_one({"_id": ObjectId(user_id)})
            if not user:
                return {"success": False, "message": "User not found"}, 401

            g.current_user = serialize_document(user)
            return fn(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return {"success": False, "message": "Token expired"}, 401
        except jwt.InvalidTokenError as error:
            logging.warning("JWT validation failed: %s", error)
            return {"success": False, "message": "Invalid token"}, 401
        except Exception as error:
            logging.exception("Unexpected auth middleware error: %s", error)
            return {"success": False, "message": "Invalid token"}, 401

    return wrapper
