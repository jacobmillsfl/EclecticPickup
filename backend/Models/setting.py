from Models.database import db

class Settings(db.Model):
    """
    An application setting.
    """
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)
    value = db.Column(db.String(256), unique=False, nullable=False)
