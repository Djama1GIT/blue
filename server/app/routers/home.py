from flask import Blueprint, request, make_response, jsonify
from static.fake import recommended, top
from config import FAKE_DATA
bp = Blueprint('home', __name__, url_prefix='/api/')


@bp.route('/recommended/', methods=['GET'])
def get_recommended():
    recommended_list = []
    return recommended_list + (recommended if FAKE_DATA else [])


@bp.route('/top/', methods=['GET'])
def get_top():
    top_list = []
    return top_list + (top if FAKE_DATA else [])
