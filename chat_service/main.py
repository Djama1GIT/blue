import asyncio
import websockets

PORT = 5555
QUIT_STRING = '<$quit$>'

count = 0


class Hall:
    def __init__(self):
        self.rooms = {}  # {room_name: Room}
        self.room_player_map = {}  # {playerName: roomName}

    async def welcome_new(self, new_player):
        # TODO: Правила пользования чатом
        await new_player.socket.send('Welcome to Chat.')

    async def list_rooms(self, player):
        # Автоматическое подключение к чату, аутентификация
        if len(self.rooms) == 0:
            msg = 'Oops, no active rooms currently. Create your own!' \
                  + 'Use [<join> room_name] to create a room.'
            await player.socket.send(msg)
        else:
            msg = 'Listing current rooms...'
            for room in self.rooms:
                msg += room + ": " + str(len(self.rooms[room].players)) + " player(s)"
            await player.socket.send(msg)

    async def handle_msg(self, player, msg):
        instructions = 'Instructions:' \
                       + '[<list>] to list all rooms' \
                       + '[<join> room_name] to join/create/switch to a room' \
                       + '[<manual>] to show instructions' \
                       + '[<quit>] to quit' \
                       + 'Otherwise start typing and enjoy!' \
                       + ''
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
                        new_room = Room(room_name)
                        self.rooms[room_name] = new_room
                    self.rooms[room_name].players.append(player)
                    await self.rooms[room_name].welcome_new(player)
                    self.room_player_map[player.name] = room_name
            else:
                await player.socket.send(instructions)

        elif "<list>" in msg:  # TODO: убрать
            await self.list_rooms(player)

        elif "<manual>" in msg:  # TODO: автоматически отправляться должен при входе и все
            await player.socket.send(instructions)

        elif "<quit>" in msg:  # TODO: автоматическая реализация
            await player.socket.send(QUIT_STRING)
            await self.remove_player(player)

        else:
            # check if in a room or not first
            if player.name in self.room_player_map:
                await self.rooms[self.room_player_map[player.name]].broadcast(player, msg)
            else:  # TODO: как раз тут и автоматическое уведомление о правилах пусть будет
                msg = 'You are currently not in any room! ' \
                      + 'Use [<list>] to see available rooms! ' \
                      + 'Use [<join> room_name] to join a room! '
                await player.socket.send(msg)

    async def remove_player(self, player):
        if player.name in self.room_player_map:
            await self.rooms[self.room_player_map[player.name]].remove_player(player)
            del self.room_player_map[player.name]


class Room:
    def __init__(self, name):
        self.players = []  # a list of websockets
        self.name = name

    async def welcome_new(self, from_player):  # TODO: наверное, убрать
        msg = self.name + " welcomes: " + from_player.name + ''
        for player in self.players:
            await player.socket.send(msg)

    async def broadcast(self, from_player, msg):
        msg = from_player.name + ":" + msg
        for player in self.players:
            await player.socket.send(msg)

    async def remove_player(self, player):
        self.players.remove(player)
        leave_msg = player.name + " has left the room"
        await self.broadcast(player, leave_msg)  # TODO: убрать


class Player:
    def __init__(self, socket, name):  # TODO: стандартное имя убрать
        self.socket = socket
        self.name = name


async def handle_client(websocket, path):
    global count
    player = Player(websocket, str(count))
    count += 1
    await hall.welcome_new(player)

    try:
        async for message in websocket:
            await hall.handle_msg(player, message)
    except websockets.exceptions.ConnectionClosed:
        await hall.remove_player(player)


hall = Hall()
start_server = websockets.serve(handle_client, "localhost", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
