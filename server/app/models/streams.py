from db import Base
from sqlalchemy import Column, UUID, String, ForeignKey, Boolean, Integer
from sqlalchemy.orm import relationship


class Stream(Base):
    __tablename__ = 'streams'

    id = Column(UUID, primary_key=True, index=True)
    name = Column(String(120), nullable=False, default="")
    description = Column(String(2000), nullable=True, default="")
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    token = Column(String(80), nullable=False)
    secret_key = Column(String(80), nullable=False)
    is_active = Column(Boolean, nullable=False, default=False, index=True)
    viewers = Column(Integer, nullable=False, default=0, index=True)  # Perhaps, I shouldn't have done it, I know.
    author = relationship("User", back_populates="stream")

    def json_for_author(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category_id": self.category_id,
            "token": self.token,
            "secret_key": self.secret_key,
            "is_active": self.is_active,
            "viewers": self.viewers,
        }

    def json_for_viewer(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category_id": self.category_id,
            "token": self.token,
            "author": self.author[0].json_for_viewer_without_stream() if self.author else None,
            "is_active": self.is_active,
            "viewers": self.viewers,
        }


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String(40), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
        }
