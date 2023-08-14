import json

from websockets import WebSocketServerProtocol

from viewer import Viewer


class StreamRoom:
    def __init__(self, name):
        self.players: list[WebSocketServerProtocol] = []
        self.name: str = name

    async def broadcast(self, from_viewer: Viewer, msg: str) -> None:
        for player in self.players:
            await player.socket.send(json.dumps(
                {
                    "author": from_viewer.name,
                    "message": msg
                }))

    async def remove_player(self, viewer: Viewer) -> None:
        self.players.remove(viewer)
