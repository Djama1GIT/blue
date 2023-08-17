from db import Base
from sqlalchemy import Column, UUID, String
from sqlalchemy.orm import relationship


class Stream(Base):
    __tablename__ = 'streams'

    id = Column(UUID, primary_key=True)
    name = Column(String(30), nullable=False, default="")
    token = Column(String(80), nullable=False)
    hashed_token = Column(String(80), nullable=False)
    preview = Column(String, nullable=True)
    author = relationship("User", back_populates="stream")
