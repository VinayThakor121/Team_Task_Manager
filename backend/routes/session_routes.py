from controllers.session_controller import session_bp


def register_session_routes(app):
    app.register_blueprint(session_bp, url_prefix="/api/sessions")
