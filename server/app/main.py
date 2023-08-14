import os
import sys

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

server_path = os.path.join(os.getcwd(), "server/app")
sys.path.insert(0, server_path)

from server.app.routers import home, streams
from server.app.config import DATABASE_URL, SECRET_KEY

app = Flask(__name__, static_folder='static', static_url_path='/static')
cors = CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SECRET_KEY"] = SECRET_KEY
db = SQLAlchemy(app)

app.register_blueprint(home.bp)
app.register_blueprint(streams.bp)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=443)
    app.run(host='0.0.0.0', port=8080, debug=True)
