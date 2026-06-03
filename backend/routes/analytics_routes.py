from controllers.analytics_controller import analytics_bp


def register_analytics_routes(app):
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
