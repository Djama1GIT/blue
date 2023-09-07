from flask import Flask, send_from_directory, request, make_response
from flask_cors import CORS
from flask_login import LoginManager, login_required, current_user

from routers import streams, chat, users
from config import DATABASE_URL, SECRET_KEY
from models.users import User
from db import db

app = Flask(__name__, static_folder='static', static_url_path='/static')
cors = CORS(app, supports_credentials=True)

app.config["UPLOAD_FOLDER"] = "media"
app.config["SECRET_KEY"] = SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = None
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)


@login_manager.user_loader
def get_by_id(user_id):
    return User.query.get(user_id)


app.register_blueprint(streams.bp)
app.register_blueprint(chat.bp)
app.register_blueprint(users.bp)


@app.get('/media/<path:path>')
def send_media(path):
    """
    :param path: a path like "posts/<int:post_id>/<filename>"
    """

    return send_from_directory(
        directory=app.config['UPLOAD_FOLDER'], path=path
    )


@app.route('/upload/', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return make_response({}, 400)

    file = request.files['file']
    if not allowed_file_extension(file.filename):
        return make_response({}, 400)

    if not allowed_file_type(request.form['file_type']):
        return make_response({}, 400)

    file.filename = current_user.id.__str__() + '.png'

    file.save(f"{app.config['UPLOAD_FOLDER']}/{request.form['file_type']}/{file.filename}")  # TODO: filename, auth

    return make_response({}, 200)


def allowed_file_extension(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in allowed_extensions


def allowed_file_type(file_type):
    return file_type in {
        'previews',
        'avatars',
    }


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
