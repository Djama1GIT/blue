import random
import string
from uuid import uuid4
from db import db
from models.users import User
from models.streams import Stream, Category
from sqlalchemy import desc

USER_DOES_NOT_EXIST = -1


def create(author_id) -> int | None:
    existing_user = User.query.filter_by(id=author_id).first()
    if not existing_user:
        return USER_DOES_NOT_EXIST
    new_stream = Stream(
        id=uuid4(),
        name=f"{existing_user.name}'s stream",
        description="Follow me!",
        token=generate_code(20, "-"),
        secret_key=generate_code()
    )
    db.session.add(new_stream)
    existing_user.stream_id = new_stream.id
    db.session.commit()


def generate_code(length=60, other_symbols="") -> str:
    sequence = ''.join(random.choice(string.ascii_letters + string.digits + other_symbols) for _ in range(length))
    return sequence


def get_active_popular_streams() -> list[dict]:
    streams: list[Stream] = Stream.query.filter_by(is_active=True).order_by(desc(Stream.viewers)).limit(10).all()
    streams: list[dict] = [stream.json_for_viewer() for stream in streams]
    return streams


def get_active_popular_streams_in_categories() -> list[dict]:
    popular_streams_in_categories = []
    categories = get_categories()
    for category in categories:
        streams_in_category = get_active_streams_by_category(category)
        if streams_in_category:
            popular_streams_in_categories += [{
                "category": category,
                "items": streams_in_category
            }]
    return popular_streams_in_categories


def auth_by_token_and_secret(token: str, secret: str) -> bool:
    stream = get_stream_by_token(token)
    if stream:
        return stream.secret_key == secret
    else:
        return False


def get_active_streams_by_category(category) -> list[Stream]:
    category = Category.query.filter_by(name=category).first()
    if category:
        streams: list[Stream] = Stream.query.filter_by(category_id=category.id, is_active=True)
        streams: list[dict] = [stream.json_for_viewer() for stream in streams]
        return streams
    else:
        return []


def get_stream_by_token(token: str) -> Stream:
    return Stream.query.filter_by(token=token).first()


def get_stream_by_id(uuid: str) -> Stream:
    return Stream.query.filter_by(id=uuid).first()


def set_active_by_token(token: str) -> None:
    stream = get_stream_by_token(token)
    if stream:
        stream.is_active = True
        db.session.commit()


def set_inactive_by_token(token: str) -> None:
    stream = get_stream_by_token(token)
    if stream:
        stream.is_active = False
        db.session.commit()


def get_id_by_token(token: str) -> int:
    stream = get_stream_by_token(token)
    if stream:
        return stream.id
    else:
        return USER_DOES_NOT_EXIST


def increment_viewers(token: str) -> None:
    stream = get_stream_by_token(token)
    if stream:
        stream.viewers += 1
        db.session.commit()


def decrement_viewers(token: str) -> None:
    stream = get_stream_by_token(token)
    if stream:
        stream.viewers -= 1
        db.session.commit()


def get_categories() -> list[str]:
    return [category.name for category in Category.query.all()]
