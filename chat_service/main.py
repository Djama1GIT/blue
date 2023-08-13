import asyncio
import json
import logging
import websockets

PORT = 5555

count = 0

# Configure logging
logging.basicConfig(level=logging.INFO)


class Hall:
    def __init__(self):
        self.rooms = {}  # {room_name: Room}
        self.room_player_map = {}  # {playerName: roomName}

    async def handle_msg(self, player, msg):
        data = json.loads(msg)
        if "action" in data:
            action = data["action"]
            if action == "join":
                await self.handle_join(player, data)
            else:
                await self.handle_chat(player, data)
        else:
            await player.socket.send(json.dumps({"error": "Invalid message format"}))

    async def handle_join(self, player, data):
        room_name = data.get("room_name")
        if room_name:
            if player.name in self.room_player_map:  # switching?
                if self.room_player_map[player.name] == room_name:
                    await player.socket.send(json.dumps({"message": "You are already in room: " + room_name}))
                    return
                else:  # switch
                    old_room = self.room_player_map[player.name]
                    await self.rooms[old_room].remove_player(player)
            if room_name not in self.rooms:  # new room:
                new_room = StreamRoom(room_name)
                self.rooms[room_name] = new_room
            self.rooms[room_name].players.append(player)
            self.room_player_map[player.name] = room_name
        else:
            await player.socket.send(json.dumps({"error": "Invalid room name"}))

    async def handle_chat(self, player, data):
        if player.name in self.room_player_map:
            room = self.rooms[self.room_player_map[player.name]]
            message = data.get("message")
            if message:
                await room.broadcast(player, message)
            else:
                await player.socket.send(json.dumps({"error": "Invalid message"}))
        else:
            await player.socket.send(json.dumps({"error": "You are not in a room"}))

    async def remove_player(self, player):
        if player.name in self.room_player_map:
            await self.rooms[self.room_player_map[player.name]].remove_player(player)
            del self.room_player_map[player.name]


class StreamRoom:
    def __init__(self, name):
        self.players = []  # a list of websockets
        self.name = name

    async def broadcast(self, from_player, msg):
        for player in self.players:
            await player.socket.send(json.dumps({"author": from_player.name, "message": msg}))

    async def remove_player(self, player):
        self.players.remove(player)


class Viewer:
    def __init__(self, socket, name):
        self.socket = socket
        self.name = name


async def handle_client(websocket, path):
    global count
    player = Viewer(websocket, str(count))
    count += 1

    try:
        async for message in websocket:
            await hall.handle_msg(player, message)
    except Exception as exc:
        logging.error(exc)
    finally:
        await hall.remove_player(player)


hall = Hall()
start_server = websockets.serve(handle_client, "blue_chat_service", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
logging.info('Chat Server Started at port %s', PORT)
