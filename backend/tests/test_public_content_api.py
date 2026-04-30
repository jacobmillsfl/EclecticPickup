"""Public read endpoints used by the marketing site (no JWT)."""

import json

from Models.bandmember import BandMember
from Models.bandvideo import BandVideo
from Models.database import db
from Models.sociallink import SocialLink
from Models.user import User
from Utils.CryptoManager import CryptoManager


def _seed_admin(app):
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
        db.session.refresh(admin)

        m = BandMember(
            name="Tester",
            img_url="img/band/test.jpg",
            text="Vocals",
            created_by_user_id=admin.id,
        )
        db.session.add(m)
        v = BandVideo(
            src="https://www.youtube.com/embed/abc",
            description="Live clip",
            youtube=True,
            created_by_user_id=admin.id,
        )
        db.session.add(v)
        s = SocialLink(
            href_url="https://example.com",
            img_url="/img/socials/x.png",
            text="Example",
            category="streaming",
            created_by_user_id=admin.id,
            platform="youtube",
            enabled=True,
        )
        db.session.add(s)
        db.session.commit()


def test_get_bandmembers_empty_then_seeded(client, app):
    r = client.get("/bandmembers")
    assert r.status_code == 200
    body = json.loads(r.data)
    assert body["data"] == []

    _seed_admin(app)
    r = client.get("/bandmembers")
    assert r.status_code == 200
    body = json.loads(r.data)
    assert len(body["data"]) == 1
    assert body["data"][0]["name"] == "Tester"


def test_get_bandvideos_includes_youtube_flag(client, app):
    _seed_admin(app)
    r = client.get("/bandvideos")
    assert r.status_code == 200
    body = json.loads(r.data)
    assert body["data"][0]["youtube"] is True
    assert "youtube.com" in body["data"][0]["src"]


def test_get_sociallinks_includes_category_platform_enabled(client, app):
    _seed_admin(app)
    r = client.get("/sociallinks")
    assert r.status_code == 200
    body = json.loads(r.data)
    assert body["data"][0]["category"] == "streaming"
    assert body["data"][0]["platform"] == "youtube"
    assert body["data"][0]["enabled"] is True


def test_post_sociallink_creates_primary_platform(client, app):
    _seed_admin(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]
    r = client.post(
        "/sociallinks",
        data=json.dumps(
            {
                "platform": "facebook",
                "text": "Find us",
                "enabled": True,
                "href_url": "https://facebook.com/example",
            }
        ),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    body = json.loads(r.data)
    assert body["data"]["platform"] == "facebook"
    assert body["data"]["text"] == "Find us"
    assert "/img/socials/facebook.png" in body["data"]["img_url"]


def test_post_sociallink_rejects_legacy_platform(client, app):
    _seed_admin(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]
    r = client.post(
        "/sociallinks",
        data=json.dumps(
            {
                "platform": "spotify",
                "text": "Listen",
                "enabled": True,
            }
        ),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 400


def test_delete_sociallink(client, app):
    _seed_admin(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]
    list_r = client.get("/sociallinks")
    link_id = json.loads(list_r.data)["data"][0]["id"]
    r = client.delete(
        f"/sociallinks/{link_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    list2 = client.get("/sociallinks")
    assert len(json.loads(list2.data)["data"]) == 0


def test_put_sociallink_updates_href_and_enabled(client, app):
    _seed_admin(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]
    list_r = client.get("/sociallinks")
    link_id = json.loads(list_r.data)["data"][0]["id"]
    r = client.put(
        f"/sociallinks/{link_id}",
        data=json.dumps({"href_url": "https://updated.example", "enabled": False}),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    body = json.loads(r.data)
    assert body["data"]["href_url"] == "https://updated.example"
    assert body["data"]["enabled"] is False


def test_put_sociallink_rejects_locked_fields(client, app):
    _seed_admin(app)
    login = client.post("/login", json={"username": "admin", "password": "secret"})
    assert login.status_code == 200
    token = json.loads(login.data)["msg"]
    list_r = client.get("/sociallinks")
    link_id = json.loads(list_r.data)["data"][0]["id"]
    r = client.put(
        f"/sociallinks/{link_id}",
        data=json.dumps({"href_url": "https://ok.example", "img_url": "/evil.png"}),
        content_type="application/json",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 400
