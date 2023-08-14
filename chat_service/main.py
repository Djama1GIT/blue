import asyncio
import logging
import websockets

from hall import Hall
from viewer import Viewer

PORT = 5555

counter = 0

logging.basicConfig(level=logging.INFO)


async def handle_client(websocket: websockets.WebSocketServerProtocol, path) -> None:
    global counter
    player = Viewer(websocket, counter)
    counter += 1

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
