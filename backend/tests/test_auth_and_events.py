"""
Regression tests for auth + protected writes (JWT must validate under Flask-JWT-Extended).

Catches issues like: dict in JWT `sub` → "Subject must be a string" on POST /events.
"""

import base64
import json

from Models.database import db
from Models.user import User
from Utils.CryptoManager import CryptoManager


def _seed_admin_only(app):
    with app.app_context():
        pwd = CryptoManager.hash_password("secret")
        admin = User(
            username="admin",
            email="admin@test.local",
            password=pwd,
            active=True,
            scope="admin",
            about="",
        )
        db.session.add(admin)
        db.session.commit()


def _decode_jwt_payload(token: str) -> dict:
    """Decode JWT payload without verifying signature (structure checks only)."""
    body = token.split(".")[1]
    pad = "=" * (-len(body) % 4)
    raw = base64.urlsafe_b64decode(body + pad)
    return json.loads(raw.decode("utf-8"))


def test_login_returns_token_with_string_sub(client, app):
    _seed_admin_only(app)
    r = client.post("/login", json={"username": "admin", "password": "secret"})
    assert r.status_code == 200
    body = json.loads(r.data)
    token = body["msg"]
    assert isinstance(token, str) and len(token) > 20
    payload = _decode_jwt_payload(token)
    assert isinstance(payload["sub"], str), (
        "Flask-JWT-Extended requires string `sub`; dict breaks @jwt_required routes"
    )
    assert payload["sub"] == "1"
    assert payload.get("scope") == "admin"


def test_post_event_with_bearer_token(client, app):
    _seed_admin_only(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]

    r = client.post(
        "/events",
        data=json.dumps(
            {
                "date": "2026-05-01",
                "time": "7pm",
                "venue": "Test Venue",
                "address": "123 Test St",
            }
        ),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200, r.get_json()
    data = json.loads(r.data)["data"]
    assert data["venue"] == "Test Venue"

    listed = client.get("/events")
    assert listed.status_code == 200
    gigs = json.loads(listed.data)["data"]
    assert len(gigs) >= 1
    assert any(g["venue"] == "Test Venue" for g in gigs)
