from flask import Blueprint, request, make_response
from static.fake import categories, most_popular, popular_in_categories, stream
from config import FAKE_DATA

bp = Blueprint('streams', __name__, url_prefix='/api/streams/')


@bp.route('/categories/', methods=['GET'])
def get_categories():
    categories_list = []
    return categories_list + (categories if FAKE_DATA else [])


@bp.route('/most_popular/', methods=['GET'])
def get_most_popular():
    list_most_popular = []
    return list_most_popular + (most_popular if FAKE_DATA else [])


@bp.route('/popular_in_categories/', methods=['GET'])
def get_popular_in_categories():
    list_popular_in_categories = []
    return list_popular_in_categories + (popular_in_categories if FAKE_DATA else [])


@bp.route('/stream/auth/', methods=['POST'])
def auth_stream():
    response = make_response({
        "authenticated": request.form['name'] == "token",
        "token": request.form['name']
    })
    response.status_code = 200 if request.form['key'] == "secret" else 403
    return response


@bp.route('/stream/stop/', methods=['POST'])
def stop_stream():
    response = make_response({
        "authenticated": request.form['name'] == "token",
        "token": request.form['name']
    })
    response.status_code = 200 if request.args.get('key') == "nginx_secret" else 403
    return response


@bp.route('/stream/<id>/', methods=['GET'])
def get_stream(id):
    if id == "fake":
        return stream
    return {}


@bp.route('/<category>/', methods=['GET'])
def get_streams_in_category(category):
    streams_in_category = []
    return {
        "category": category,
        "streams": streams_in_category
    }
