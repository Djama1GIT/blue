from flask import Flask
from flask_cors import CORS
from routers import home, streams

app = Flask(__name__, static_folder='static', static_url_path='/static')
cors = CORS(app)
app.debug = True

app.register_blueprint(home.bp)
app.register_blueprint(streams.bp)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=443)
    app.run(host='0.0.0.0', port=8080)
