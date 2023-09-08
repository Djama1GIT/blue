from uuid import uuid4
from flask_bcrypt import bcrypt
from db import db
from models.users import User
from models.streams import Stream
from config import SECRET_KEY
from sqlalchemy import desc

from . import streams

USER_DOES_NOT_EXIST = -1
USER_ALREADY_EXISTS = -2
INCORRECT_PASSWORD = -3
INCORRECT_NEW_PASSWORD = -4


def register(login_, password):
    existing_user = User.query.filter_by(name=login_).first()
    if existing_user:
        return USER_ALREADY_EXISTS
    id_ = uuid4()
    hashed_password = hash_pw(password)
    token = uuid4()
    hashed_token = hash_pw(str(token))
    new_user = User(
        id=id_,
        name=login_,
        hashed_password=hashed_password,
        token=token,
        hashed_token=hashed_token,
    )
    db.session.add(new_user)
    db.session.commit()
    streams.create(author_id=id_)
    return new_user


def login(login_, password):
    user = User.query.filter_by(name=login_).first()
    if user:
        if user.hashed_password == hash_pw(password):
            if not user.stream:
                streams.create(author_id=user.id)
            return user
        else:
            return INCORRECT_PASSWORD
    return USER_DOES_NOT_EXIST


def hash_pw(password):
    return bcrypt.hashpw(password.encode(), SECRET_KEY.encode()).decode()


def get_popular_streamers():
    streamers: list[User] = User.query.limit(5).all()  # TODO: max viewers
    streamers: list[dict] = [streamer.json_for_viewer() for streamer in streamers]
    return streamers


def get_user_by_id(id_: str):
    return User.query.filter_by(id=id_).first()


def update_user_settings_by_id(id_: str, username: str, email: str, old_password: str = None, new_password: str = None):
    user = get_user_by_id(id_)
    user.uuid = username
    user.email = email
    if old_password and new_password:
        if hash_pw(old_password) != user.hashed_password:
            return INCORRECT_PASSWORD
        elif len(new_password) < 8:
            return INCORRECT_NEW_PASSWORD
        else:
            user.hashed_password = hash_pw(new_password)
            db.session.commit()
    else:
        db.session.commit()
