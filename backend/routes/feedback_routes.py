from controllers.feedback_controller import feedback_bp


def register_feedback_routes(app):
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
