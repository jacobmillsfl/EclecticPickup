from Models.database import db

class Event(db.Model):
    """
    An upcoming event.
    """
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(32), nullable=False)
    time = db.Column(db.String(32), nullable=False)
    venue = db.Column(db.String(256), nullable=False)
    address = db.Column(db.String(256), nullable=False)
