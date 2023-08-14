from flask import Flask, Blueprint, request, make_response

bp = Blueprint('users', __name__, url_prefix='/api/users/')

app = Flask(__name__)


@bp.route('/register/', methods=['POST'])
def register():
    # TODO
    response = make_response({
        "login": request.form['login'],
        "password": request.form['password']
    })
    return response


@bp.route('/login/', methods=['POST'])
def authorize():
    # TODO
    response = make_response({
        "login": request.form['login'],
        "password": request.form['password']
    })
    return response


@bp.route('/auth/', methods=['POST'])
def authenticate():
    # TODO
    return {}
