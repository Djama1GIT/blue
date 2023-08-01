from flask import Blueprint, request, make_response, jsonify

bp = Blueprint('home', __name__, url_prefix='/api/')


@bp.route('/recommended/', methods=['GET'])
def get_recommended():
    return [
        {
            "id": 5,
            "author": "Delphizz",
            "name": "Играем в Game Name",
        },
        {
            "id": 1,
            "author": "illill",
            "name": "WHO AM I?",
        },
        {
            "id": 2,
            "author": "TheStone",
            "name": "Болтаем",
        },
        {
            "id": 4,
            "author": "FLUFFY",
            "name": "Играем в Minecraft",
        },
        {
            "id": 3,
            "author": "Enrico_Hokage",
            "name": "CТРИМЛЮ SA:MP 24/7",
        },
        {
            "id": 6,
            "author": "GADJIIAVOV",
            "name": "Пишу этот сайт",
        },
    ]


@bp.route('/top/', methods=['GET'])
def get_top():
    return [
        {
            "id": 5,
            "author": "Delphizz"
        },
        {
            "id": 1,
            "author": "illill"
        },
        {
            "id": 2,
            "author": "TheStone"
        },
        {
            "id": 4,
            "author": "FLUFFY"
        },
        {
            "id": 3,
            "author": "Enrico_Hokage"
        },
        {
            "id": 6,
            "author": "GADJIIAVOV"
        },
    ]
