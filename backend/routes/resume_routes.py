from controllers.resume_controller import resume_bp


def register_resume_routes(app):
    app.register_blueprint(resume_bp, url_prefix="/api/resumes")
