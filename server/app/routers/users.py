from flask import Flask, Blueprint, request, make_response
from flask_login import login_required, logout_user, login_user, current_user

from repositories import users as UsersRepository
from repositories import streams as StreamsRepository

from static.fake import top
from config import FAKE_DATA

bp = Blueprint('users', __name__, url_prefix='/api/users/')

app = Flask(__name__)


@bp.route('/register/', methods=['POST'])
def register():
    data = request.get_json()
    if len(data.get('login')) < 8:
        return make_response({'message': 'Login should be at least 8 characters long'}, 418)
    if len(data.get('password')) < 8:
        return make_response({'message': 'Password should be at least 8 characters long'}, 418)

    user = UsersRepository.register(data.get('login'), data.get('password'))
    if user == UsersRepository.USER_ALREADY_EXISTS:
        return make_response({'message': 'A user with this login already exists'}, 409)
    else:
        StreamsRepository.create(user.id)
        return make_response({}, 200)


@bp.route('/login/', methods=['POST'])
def login_():
    data = request.get_json()
    user = UsersRepository.login(data.get('login'), data.get('password'))
    if user == UsersRepository.USER_DOES_NOT_EXIST or user == UsersRepository.INCORRECT_PASSWORD:
        return make_response({'message': 'Incorrect login and/or password'}, 401)
    else:
        login_user(user)
        return make_response({}, 200)


@bp.route('/logout/', methods=['POST'])
@login_required
def logout():
    logout_user()
    return make_response({}, 200)


@bp.route('/auth/', methods=['POST'])
def authenticate():
    return {"user": current_user.json_for_author() if current_user.is_authenticated else None}


@bp.route('/settings/', methods=['PATCH'])
@login_required
def update_user_settings():
    error = UsersRepository.update_user_settings_by_id(
        current_user.id.__str__(),
        request.form.get('username'),
        request.form.get('email'),
        request.form.get('old_password'),
        request.form.get('new_password'),
    )
    if error:
        if error == UsersRepository.INCORRECT_PASSWORD:
            return make_response({'message': 'Incorrect old password'}, 418)
        elif error == UsersRepository.INCORRECT_NEW_PASSWORD:
            return make_response({'message': 'Incorrect new password'}, 418)
        else:
            return make_response({'message': 'Invalid data'}, 418)
    else:
        return make_response({}, 200)


@bp.route('/top/', methods=['GET'])
def get_top():
    top_list = UsersRepository.get_popular_streamers()
    return top_list + (top[:6 - len(top_list)] if FAKE_DATA else [])
