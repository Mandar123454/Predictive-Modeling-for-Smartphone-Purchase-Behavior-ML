# API package initialization file
from .routes import api_bp

def init_app(app):
    """Initialize the API blueprint with the Flask app"""
    app.register_blueprint(api_bp, url_prefix='/api')
