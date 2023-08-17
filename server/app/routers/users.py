from flask import Flask, Blueprint, request, make_response
from flask_login import login_required, logout_user, login_user

from repositories import users as UsersRepository

bp = Blueprint('users', __name__, url_prefix='/api/users/')

app = Flask(__name__)


@bp.route('/register/', methods=['POST'])
def register():
    user = UsersRepository.register(request.form['login'], request.form['password'])
    response = make_response({})
    if user == UsersRepository.USER_ALREADY_EXISTS:
        response.status_code = 409
    return response


@bp.route('/login/', methods=['POST'])
def login_():
    user = UsersRepository.login(request.form['login'], request.form['password'])
    response = make_response({})
    if user == UsersRepository.USER_DOES_NOT_EXIST or user == UsersRepository.INCORRECT_PASSWORD:
        response.status_code = 401
    else:
        login_user(user)
    return response


@bp.route('/logout/', methods=['POST'])
@login_required
def logout():
    logout_user()
    response = make_response({})
    return response


@bp.route('/auth/', methods=['POST'])
@login_required
def authenticate():
    return {}
