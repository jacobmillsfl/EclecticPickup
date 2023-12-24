from Models.database import db

class User(db.Model):
    """
    An application user.
    """
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    active = db.Column(db.Boolean, default=False)
    scope = db.Column(db.String(32))
    about = db.Column(db.String(512))
