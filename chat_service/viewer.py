from websockets import WebSocketServerProtocol


class Viewer:
    def __init__(self, socket, id_, name="Unidentified guest"):
        self.socket: WebSocketServerProtocol = socket
        self.id: int = id_
        self.name: str = name
