from Models.database import db

class Changelog(db.Model):
    """
    A database update.
    """
    __tablename__ = 'changelog'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    description = db.Column(db.String(256), unique=False, nullable=False)
