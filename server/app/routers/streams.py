from flask import Blueprint, request, make_response
from static.fake import categories, most_popular, popular_in_categories, stream as fake_stream
from config import FAKE_DATA  # This is only for front-end demo
from models.streams import Stream
from repositories import streams as StreamsRepository

bp = Blueprint('streams', __name__, url_prefix='/api/streams/')


@bp.route('/categories/', methods=['GET'])
def get_categories():
    categories_list = StreamsRepository.get_categories()
    return categories_list + (categories if FAKE_DATA else [])


@bp.route('/most_popular/', methods=['GET'])
def get_most_popular():
    list_most_popular = StreamsRepository.get_active_popular_streams()
    return list_most_popular + (most_popular if FAKE_DATA else [])


@bp.route('/popular_in_categories/', methods=['GET'])
def get_popular_in_categories():
    list_popular_in_categories = StreamsRepository.get_active_popular_streams_in_categories()
    return list_popular_in_categories + (popular_in_categories if FAKE_DATA else [])


@bp.route('/stream/auth/', methods=['POST'])
def auth_stream():
    if StreamsRepository.auth_by_token_and_secret(
            request.form['name'],
            request.form['key']
    ):
        response = make_response({
            "authenticated": True,
            "token": request.form['name']
        })
        response.status_code = 200
        StreamsRepository.set_active_by_token(request.form['name'])
    else:
        response = make_response({}, 403)
    return response


@bp.route('/stream/stop/', methods=['POST'])
def stop_stream():
    if StreamsRepository.auth_by_token_and_secret(
            request.form['name'],
            request.form['key']
    ):
        response = make_response({
            "authenticated": True,
            "token": request.form['name']
        })
        response.status_code = 200
        StreamsRepository.set_inactive_by_token(request.form['name'])
    else:
        response = make_response({}, 403)
    return response


@bp.route('/stream/<uuid>/', methods=['GET'])
def get_stream(uuid):
    if uuid == "fake":
        return fake_stream
    stream = StreamsRepository.get_stream_by_id(uuid)
    if stream:
        return stream.json_for_viewer()
    else:
        return make_response({}, 404)  # TODO


@bp.route('/<category>/', methods=['GET'])
def get_streams_in_category(category):
    streams_in_category = StreamsRepository.get_streams_by_category(category)
    return {
        "category": category,
        "streams": [i.json_for_viewer() for i in streams_in_category]
    }
