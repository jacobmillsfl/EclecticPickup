import os

import pytest

os.environ.setdefault("JWT_SECRET_KEY", "pytest-jwt-secret-key-at-least-32-chars-long")
os.environ.setdefault("FLASK_API_BASE_URL", "http://127.0.0.1:8081")

import Utils.ConfigManager as _cm

_cm.ConfigManager._instance = None
if hasattr(_cm.ConfigManager, "config"):
    _cm.ConfigManager.config.clear()

from app import app as flask_app
from Models.database import db


@pytest.fixture()
def app():
    flask_app.config["TESTING"] = True
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with flask_app.app_context():
        db.drop_all()
        db.create_all()
    yield flask_app


@pytest.fixture()
def client(app):
    return app.test_client()
