from flask_login import UserMixin

from db import Base
from sqlalchemy import Column, UUID, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship


class User(UserMixin, Base):
    __tablename__ = 'users'

    id = Column(UUID, primary_key=True)
    name = Column(String(30), nullable=False)
    email = Column(String(80), nullable=True, unique=True)
    email_is_verified = Column(Boolean, nullable=False, default=False)
    hashed_password = Column(String(80), nullable=False)
    token = Column(UUID, nullable=False)
    hashed_token = Column(String(120), nullable=False)
    stream_id = Column(UUID, ForeignKey('streams.id'), nullable=True)
    stream = relationship("Stream", back_populates="author")

    def json_for_author(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "hashed_token": self.hashed_token,
            "stream_id": self.stream_id,
            "stream": self.stream.json_for_author() if self.stream else None,
            "is_active": self.is_active,
            "is_authenticated": self.is_authenticated,
            "is_anonymous": self.is_anonymous,
        }

    def json_for_viewer(self):
        return {
            "id": self.id,
            "name": self.name,
            "stream": self.stream.json_for_viewer() if self.stream else None
        }

    def json_for_viewer_without_stream(self):
        return {
            "id": self.id,
            "name": self.name,
        }
