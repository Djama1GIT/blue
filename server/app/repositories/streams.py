import random
import string
from uuid import uuid4
from db import db
from models.users import User
from models.streams import Stream

USER_DOES_NOT_EXIST = -1


def create(author_id):
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


def generate_code(length=60, other_symbols=""):
    sequence = ''.join(random.choice(string.ascii_letters + string.digits + other_symbols) for _ in range(length))
    return sequence
