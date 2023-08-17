from config import DATABASE_URL
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

Base = declarative_base()
metadata = Base.metadata

async_engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)
