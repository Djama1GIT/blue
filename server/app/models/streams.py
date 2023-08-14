from main import db


class Stream(db.Model):
    __tablename__ = 'streams'

    id = db.Column(db.UUID, primary_key=True)
    name = db.Column(db.String(30), nullable=False, default="")
    token = db.Column(db.String(80), nullable=False)
    hashed_token = db.Column(db.String(80), nullable=False)
    preview = db.Column(db.String, nullable=True)
    author = db.relationship("User", back_populates="stream")
