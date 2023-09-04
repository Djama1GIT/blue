import json
from collections import Counter

from websockets import WebSocketServerProtocol

from viewer import Viewer


class StreamRoom:
    def __init__(self, name):
        self.members: list[WebSocketServerProtocol] = []
        self.name: str = name  # token
        self.members_ = Counter()  # member's token: count of connections

    async def broadcast(self, from_viewer: Viewer, msg: str) -> None:
        for player in self.members:
            await player.socket.send(json.dumps(
                {
                    "author": from_viewer.name,
                    "message": msg
                }))

    async def remove_player(self, viewer: Viewer) -> None:
        self.members.remove(viewer)
