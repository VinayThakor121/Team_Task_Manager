import os

from flask import Flask
from flask_cors import CORS

from config.database import ensure_indexes
from config.env import Config
from routes.auth_routes import register_auth_routes
from routes.interview_routes import register_interview_routes
from routes.session_routes import register_session_routes
from routes.feedback_routes import register_feedback_routes
from routes.analytics_routes import register_analytics_routes
from routes.resume_routes import register_resume_routes
from services.auth_service import init_bcrypt


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

    CORS(
        app,
        resources={r"/api/*": {"origins": [origin.strip() for origin in Config.CLIENT_ORIGIN.split(",") if origin.strip()]}},
        supports_credentials=True,
    )

    os.makedirs(Config.UPLOAD_DIR, exist_ok=True)

    init_bcrypt(app)
    ensure_indexes()

    register_auth_routes(app)
    register_interview_routes(app)
    register_session_routes(app)
    register_feedback_routes(app)
    register_analytics_routes(app)
    register_resume_routes(app)

    @app.get("/api/health")
    def health():
        return {"success": True, "message": "Backend running"}, 200

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=Config.PORT, debug=Config.APP_DEBUG)
