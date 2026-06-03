from datetime import datetime, timedelta, timezone
import jwt
from config.env import Config


def create_access_token(user_id):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=Config.JWT_EXPIRES_IN_MINUTES),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def decode_access_token(token):
    return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
