from db import Base
from sqlalchemy import Column, UUID, String
from sqlalchemy.orm import relationship


class Stream(Base):
    __tablename__ = 'streams'

    id = Column(UUID, primary_key=True)
    name = Column(String(30), nullable=False, default="")
    description = Column(String(2000), nullable=True, default="")
    token = Column(String(80), nullable=False)
    secret_key = Column(String(80), nullable=False)
    author = relationship("User", back_populates="stream")

    def json_for_author(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "token": self.token,
            "secret_key": self.secret_key,
        }

    def json_for_viewer(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "token": self.token,
            "author": self.author.json_for_viewer(),
        }
