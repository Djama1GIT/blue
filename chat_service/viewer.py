import uuid

from websockets import WebSocketServerProtocol


class Viewer:
    def __init__(self, socket, id_, name=None):
        self.socket: WebSocketServerProtocol = socket
        self.id: int = id_
        self.name: str = name or "unidentified-guest-" + uuid.uuid4().__str__()
        self.is_anonymous: bool = True
