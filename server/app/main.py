from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager

from routers import streams, chat, users
from config import DATABASE_URL, SECRET_KEY
from models.users import User
from db import db

app = Flask(__name__, static_folder='static', static_url_path='/static')
cors = CORS(app, supports_credentials=True)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
