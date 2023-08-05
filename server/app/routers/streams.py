import logging

from flask import Blueprint, request, make_response

bp = Blueprint('streams', __name__, url_prefix='/api/streams')


@bp.route('/categories/', methods=['GET'])
def get_categories():
    return ["Video-games", "Sport", "IT", "Music", "News", "Movies", "Cooking", "Fitness", "Fashion", "Travel"]


@bp.route('/most_popular/', methods=['GET'])
def get_most_popular():
    return [
        {
            "id": 1,
            "author": "illill",
            "name": "WHO AM I?",
            "category": "Video-games",
            "viewers": 2,
            "fake": True,
        },
        {
            "id": 2,
            "author": "TheStone",
            "name": "Болтаем",
            "category": "Video-games",
            "viewers": 10,
            "fake": True,
        },
        {
            "id": 3,
            "author": "Enrico_Hokage",
            "name": "CТРИМЛЮ SA:MP 24/7",
            "category": "Video-games",
            "viewers": 24,
            "fake": True,
        },
        {
            "id": 5,
            "author": "Delphizz",
            "name": "Играем в Game Name",
            "category": "Sport",
            "viewers": 35,
            "fake": True,
        },
        {
            "id": 4,
            "author": "FLUFFY",
            "name": "Играем в Minecraft",
            "category": "Video-games",
            "viewers": 7,
            "fake": True,
        },
        {
            "id": 6,
            "author": "GADJIIAVOV",
            "name": "Пишу этот сайт",
            "category": "IT",
            "viewers": 120,
            "fake": True,
        },
    ]


@bp.route('/popular_in_categories/', methods=['GET'])
def get_popular_in_categories():
    return [
        {
            "category": "Video-games",
            "items": [
                {
                    "id": 1,
                    "author": "illill",
                    "name": "WHO AM I?",
                    "viewers": 2,
                    "fake": True,
                },
                {
                    "id": 2,
                    "author": "TheStone",
                    "name": "Болтаем",
                    "viewers": 10,
                    "fake": True,
                },
                {
                    "id": 3,
                    "author": "Enrico_Hokage",
                    "name": "CТРИМЛЮ SA:MP 24/7",
                    "viewers": 24,
                    "fake": True,
                },
                {
                    "id": 4,
                    "author": "FLUFFY",
                    "name": "Играем в Minecraft",
                    "viewers": 7,
                    "fake": True,
                },
            ],
        },
        {
            "category": "Sport",
            "items": [
                {
                    "id": 5,
                    "author": "Delphizz",
                    "name": "Играем в Game Name",
                    "viewers": 35,
                    "fake": True,
                }
            ],
        },
        {
            "category": "IT",
            "items": [
                {
                    "id": 6,
                    "author": "GADJIIAVOV",
                    "name": "Пишу этот сайт",
                    "viewers": 120,
                    "fake": True,
                }
            ],
        },

    ]


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
    return {
        "id": 6,
        "author": "GADJIIAVOV",
        "name": "Fake Stream Page",
        "viewers": 120,
        "fake": True,
    }


@bp.route('/<category>/', methods=['GET'])
def get_streams_in_category(category):
    return {"category": category}
