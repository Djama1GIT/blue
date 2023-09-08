import json
from collections import Counter

import requests
from websockets import WebSocketServerProtocol

from viewer import Viewer


class StreamRoom:
    def __init__(self, uuid_):
        self.members: list[WebSocketServerProtocol] = []
        self.uuid: str = uuid_
        self.members_ = Counter()  # member's token: count of connections

        self.authenticate(self.uuid)

    @staticmethod
    def authenticate(uuid_):
        response = requests.get(f"http://blue_server:5000/api/streams/stream/{uuid_}/")
        stream = response.json()
        if not stream.get("is_active"):
            raise ValueError('Invalid stream id')

    async def broadcast(self, from_viewer: Viewer, msg: str) -> None:
        for player in self.members:
            await player.socket.send(json.dumps(
                {
                    "author": from_viewer.name,
                    "author_id": from_viewer.uuid,
                    "message": msg
                }))

    async def remove_player(self, viewer: Viewer) -> None:
        self.members.remove(viewer)
