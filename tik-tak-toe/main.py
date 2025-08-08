# server.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
connections = {}
rooms = {}  # { room_id: {"password": str, "users": [ws1, ws2]} }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/{room}/{username}")
async def websocket_endpoint(websocket: WebSocket, room: str, username: str):
    await websocket.accept()

    # Add to room
    if room not in rooms:
        rooms[room] = {"users": [], "password": "abc"}  # password hardcoded or accept during creation
    rooms[room]["users"].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to others
            for conn in rooms[room]["users"]:
                if conn != websocket:
                    await conn.send_text(data)
    except WebSocketDisconnect:
        rooms[room]["users"].remove(websocket)
