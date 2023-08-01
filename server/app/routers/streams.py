from flask import Blueprint, request

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
        },
        {
            "id": 2,
            "author": "TheStone",
            "name": "Болтаем",
            "category": "Video-games",
        },
        {
            "id": 3,
            "author": "Enrico_Hokage",
            "name": "CТРИМЛЮ SA:MP 24/7",
            "category": "Video-games",
        },
        {
            "id": 5,
            "author": "Delphizz",
            "name": "Играем в Game Name",
            "category": "Sport",
        },
        {
            "id": 4,
            "author": "FLUFFY",
            "name": "Играем в Minecraft",
            "category": "Video-games",
        },
        {
            "id": 6,
            "author": "GADJIIAVOV",
            "name": "Пишу этот сайт",
            "category": "IT",
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
                    "category": "Video-games",
                },
                {
                    "id": 2,
                    "author": "TheStone",
                    "name": "Болтаем",
                    "category": "Video-games",
                },
                {
                    "id": 3,
                    "author": "Enrico_Hokage",
                    "name": "CТРИМЛЮ SA:MP 24/7",
                    "category": "Video-games",
                },
                {
                    "id": 4,
                    "author": "FLUFFY",
                    "name": "Играем в Minecraft",
                    "category": "Video-games",
                },
            ],
        },
    ]


@bp.route('/stream/', methods=['GET'])
def get_stream():
    return {}


@bp.route('/<category>/', methods=['GET'])
def get_streams_in_category(category):
    return {"category": category}
