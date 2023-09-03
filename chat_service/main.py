import asyncio
import logging
import os
import dotenv
import websockets

from hall import Hall
from viewer import Viewer

dotenv.load_dotenv()
SERVICE_PORT = int(os.getenv("CHAT_SERVICE_PORT", 5555))

logging.basicConfig(level=logging.INFO)

counter = 0


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
start_server = websockets.serve(handle_client, "blue_chat_service", SERVICE_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
logging.info('Chat Server Started at port %s', SERVICE_PORT)
