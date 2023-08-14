import os
import sys

from flask_login import UserMixin

server_path = os.path.join(os.getcwd(), "server/app")
sys.path.insert(0, server_path)

from server.app.main import db


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.UUID, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(80), nullable=True, unique=True)
    email_is_verified = db.Column(db.Boolean, nullable=False, default=False)
    hashed_password = db.Column(db.String(80), nullable=False)
    token = db.Column(db.String(80), nullable=False)
    hashed_token = db.Column(db.String(80), nullable=False)
    stream_id = db.Column(db.UUID, db.ForeignKey('streams.id'), nullable=True)
    stream = db.relationship("Stream", back_populates="users")
