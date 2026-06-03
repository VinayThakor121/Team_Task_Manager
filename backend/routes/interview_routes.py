from controllers.interview_controller import interview_bp


def register_interview_routes(app):
    app.register_blueprint(interview_bp, url_prefix="/api/interviews")
