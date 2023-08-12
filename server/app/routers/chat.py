from flask import Flask, Blueprint

bp = Blueprint('chat', __name__, url_prefix='/api/chats')

app = Flask(__name__)


@bp.route('/', methods=['GET'])
def get_chats():
    ...
