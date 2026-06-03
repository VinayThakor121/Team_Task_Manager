from pymongo import MongoClient
from config.env import Config


_client = MongoClient(Config.MONGODB_URI)
_db = _client[Config.MONGODB_DB_NAME]


def get_db():
    return _db


def ensure_indexes():
    _db.users.create_index("email", unique=True)
    _db.interviews.create_index([("userId", 1), ("createdAt", -1)])
    _db.sessions.create_index([("userId", 1), ("interviewId", 1)])
    _db.feedback.create_index([("userId", 1), ("interviewId", 1)])
    _db.resumes.create_index([("userId", 1), ("uploadedAt", -1)])
