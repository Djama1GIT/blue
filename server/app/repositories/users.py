from uuid import uuid4

from flask_bcrypt import bcrypt

from db import async_session_maker
from models.users import User
from models.streams import Stream
from config import SECRET_KEY
from sqlalchemy import select, insert

USER_DOES_NOT_EXIST = -1
USER_ALREADY_EXISTS = -2
INCORRECT_PASSWORD = -3


async def register(login_, password):
    async with async_session_maker() as session:
        statement = select(User).where(User.name == login_)
        result = await session.execute(statement)
        existing_user = result.scalars().first()
        if existing_user:
            return USER_ALREADY_EXISTS
        id_ = uuid4()
        hashed_password = hash_pw(password)
        token = uuid4()
        hashed_token = hash_pw(str(token))
        new_user = insert(User).values(
            id=id_,
            name=login_,
            hashed_password=hashed_password,
            token=token,
            hashed_token=hashed_token,
        )
        await session.execute(new_user)
        await session.commit()


async def login(login_, password):
    user = await User.query.filter_by(name=login_).scalars().first()
    if user:
        if bcrypt.checkpw(password, user.password):
            return user
        else:
            return INCORRECT_PASSWORD
    else:
        return USER_DOES_NOT_EXIST


def hash_pw(password):
    return bcrypt.hashpw(password.encode(), SECRET_KEY.encode()).decode()
