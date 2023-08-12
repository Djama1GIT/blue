import asyncio
import websockets

PORT = 5555
QUIT_STRING = '<$quit$>'

count = 0


class Hall:
    def __init__(self):
        self.rooms = {}  # {room_name: Room}
        self.room_player_map = {}  # {playerName: roomName}

    async def handle_msg(self, player, msg):
        if "<join>" in msg:
            same_room = False
            if len(msg.split()) >= 2:  # error check
                room_name = msg.split()[1]
                if player.name in self.room_player_map:  # switching?
                    if self.room_player_map[player.name] == room_name:
                        await player.socket.send('You are already in room: ' + room_name)
                        same_room = True
                    else:  # switch
                        old_room = self.room_player_map[player.name]
                        self.rooms[old_room].remove_player(player)
                if not same_room:
                    if not room_name in self.rooms:  # new room:
                        new_room = StreamRoom(room_name)
                        self.rooms[room_name] = new_room
                    self.rooms[room_name].players.append(player)
                    self.room_player_map[player.name] = room_name
            else:
                await player.socket.send('err')
        else:
            # check if in a room or not first
            if player.name in self.room_player_map:
                await self.rooms[self.room_player_map[player.name]].broadcast(player, msg)
            else:
                await player.socket.send('Чат не загружен')

    async def remove_player(self, player):
        if player.name in self.room_player_map:
            await self.rooms[self.room_player_map[player.name]].remove_player(player)
            del self.room_player_map[player.name]


class StreamRoom:
    def __init__(self, name):
        self.players = []  # a list of websockets
        self.name = name

    async def broadcast(self, from_player, msg):
        msg = from_player.name + ":" + msg
        for player in self.players:
            await player.socket.send(msg)

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
        print(exc)
    finally:
        await hall.remove_player(player)


hall = Hall()
start_server = websockets.serve(handle_client, "localhost", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
