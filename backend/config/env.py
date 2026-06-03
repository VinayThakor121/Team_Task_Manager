import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    APP_ENV = os.getenv("APP_ENV", "development")
    APP_DEBUG = os.getenv("APP_DEBUG", "true").lower() == "true"
    PORT = int(os.getenv("PORT", "5000"))

    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "prepwise_clone")

    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_EXPIRES_IN_MINUTES = int(os.getenv("JWT_EXPIRES_IN_MINUTES", "1440"))

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")

    VAPI_WEB_TOKEN = os.getenv("VAPI_WEB_TOKEN", "")
    VAPI_WORKFLOW_ID = os.getenv("VAPI_WORKFLOW_ID", "")

    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(10 * 1024 * 1024)))
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "backend/uploads")
