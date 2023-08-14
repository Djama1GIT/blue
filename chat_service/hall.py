import json

from stream_room import StreamRoom
from viewer import Viewer


class Hall:
    def __init__(self):
        self.rooms: dict[str, StreamRoom] = {}
        self.room_viewer_map: dict[int, str] = {}  # {viewerId: roomName}

    async def handle_msg(self, viewer: Viewer, msg: str) -> None:
        data = json.loads(msg)
        if "action" in data:
            action = data["action"]
            if action == "join":
                await self.handle_join(viewer, data)
            else:
                await self.handle_chat(viewer, data)
        else:
            await viewer.socket.send(json.dumps({
                "error": "Invalid message format"
            }))
            await viewer.socket.close()

    async def handle_join(self, viewer: Viewer, data: dict) -> None:
        room_name = data.get("room_name")
        if room_name:
            if viewer.id in self.room_viewer_map:
                if self.room_viewer_map[viewer.id] == room_name:
                    await viewer.socket.send(json.dumps({
                        "error": "Viewer is already in room: " + room_name
                    }))
                    await viewer.socket.close()
                    return
                else:
                    old_room = self.room_viewer_map[viewer.id]
                    await self.rooms[old_room].remove_player(viewer)
            if room_name not in self.rooms:
                new_room = StreamRoom(room_name)
                self.rooms[room_name] = new_room
            self.rooms[room_name].players.append(viewer)
            self.room_viewer_map[viewer.id] = room_name
            viewer.name = data.get("author")
            # TODO: author должен быть токеном,
            #  а player.name устанавливаться после аутентификации
        else:
            await viewer.socket.send(json.dumps({
                "error": "Invalid room name"
            }))
            await viewer.socket.close()

    async def handle_chat(self, viewer: Viewer, data: dict) -> None:
        if viewer.id in self.room_viewer_map:
            room = self.rooms[self.room_viewer_map[viewer.id]]
            message = data.get("message")
            if message:
                await room.broadcast(viewer, message)
            else:
                await viewer.socket.send(json.dumps({
                    "error": "Invalid message"
                }))
                await viewer.socket.close()
        else:
            await viewer.socket.send(json.dumps({
                "error": "Viewer is not in a room"
            }))
            await viewer.socket.close()

    async def remove_player(self, viewer: Viewer) -> None:
        if viewer.id in self.room_viewer_map:
            await self.rooms[self.room_viewer_map[viewer.id]].remove_player(viewer)
            del self.room_viewer_map[viewer.id]
