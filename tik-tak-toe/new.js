const htmlboard=document.getElementById("board");
const htmlstatus=document.getElementById("status");

let boarde=Array(9).fill("");
let count=0;
let turn="X";
let gameover=false;
let ws;


function join(){
    const room=document.getElementById("room").value;
    const username=document.getElementById("username").value;
    alert(`${room} joined`);
    ws=new WebSocket(`ws://localhost:8000/ws/${room}/${username}`);

    ws.onmessage = (event) => {
        const data=JSON.parse(event.data);
        boarde[data.index]=data.turn;
        if(turn=="X"){
            turn="O";
        }else{
            turn = "X";
        }   
        checkwinner();
    }
}
function resetgame(){
    count=0;
    boarde=Array(9).fill("");
    turn="X";
    gameover=false;
    render();
}
setTimeout(() => {
}, 500);
function wait(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
async function render(){
    
    htmlboard.innerHTML="";
    htmlstatus.innerText=`Turn:${turn}`;
    boarde.forEach((player,index) => {
        const htmlcell=document.createElement("div");
        htmlcell.classList.add("cell");
        htmlcell.innerText=player;
        if(!gameover){
        htmlcell.addEventListener("click",()=> move(index));
        }
        htmlboard.appendChild(htmlcell);
    });
    await wait(500);
    if(count>=9 && !gameover){
        alert("game is draw");
        resetgame();
    }

}

async function move(index){
    if(gameover){
        return;
    }
    if(boarde[index]==""){
    count++;
        boarde[index]=turn;
        ws.send(JSON.stringify({index,turn}));
        if(turn=="X"){
            turn="O";
        }else{
            turn = "X";
        }
        await checkwinner();
    }else{
        alert("wrong move");
        render();
    }
}

async function checkwinner(){
    const winning = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ];
    for (let combination of winning){
        const [a,b,c]=combination;
        if(boarde[a]!="" && boarde[a]==boarde[b] && boarde[a]==boarde[c]){
            boarde[a]="WON";
            boarde[b]="WON";
            boarde[c]="WON";
            gameover=true;
             render();
    await wait(500);
            if(turn=="X"){
                turn="O";
            }else{
                turn="X";
            }
            alert(`${turn} is winner`);
            resetgame();
        }
    }
    render();
}

render();