from controllers.auth_controller import auth_bp


def register_auth_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
