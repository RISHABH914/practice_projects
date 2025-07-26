from fastapi import FastAPI,Request,HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],          # Allow all headers
)

board = [""]*9
turn = "X"

def check_winner(varboard):
    win = [
        [0,1,2], [0,3,6],[1,4,7],[2,5,8],[3,4,5],[6,7,8],[0,4,8],[2,4,6]
    ]

    for line in win:
        if varboard[line[0]]!="" and all(varboard[line[0]]==varboard[i] for i in line):
           return varboard[line[0]]
        
    return None


@app.post("/newgame")
def new():
    global board,turn 
    board = [""]*9
    turn = "X"
    return {"board":board,"turn":turn}

@app.post("/move")
async def move(request:Request):
    global board,turn
    data=await request.json()
    index = data["index"]

    if(board[index]==""):
        board[index]=turn
        winner=check_winner(board)
        turn = "X" if turn=="O" else "O"
        return {"board":board,"turn":turn,"winner":winner}
    else:
        return {"error":"wrong move"}
    
@app.post("/showboard")
def show():
    global board,turn
    return {"board":board}