const htmlboard=document.getElementById("board");
const htmlstatus=document.getElementById("status");

let boarde=Array(9).fill("");
let count=0;
let turn="X";
function resetgame(){
    count=0;
    fetch("http://127.0.0.1:8000/newgame",{
        method:"POST"
    })
    .then(res => res.json())
    .then(data => {
        boarde=data.board;
        htmlstatus.innerText=`Turn:${data.turn}`;
        render();
    });
}

function render(){
    if(count>=9){
        alert("game is draw");
        resetgame();
    }
    htmlboard.innerHTML="";
    boarde.forEach((player,index) => {
        const htmlcell=document.createElement("div");
        htmlcell.classList.add("cell");
        htmlcell.innerText=player;

        htmlcell.addEventListener("click",()=> move(index));
        htmlboard.appendChild(htmlcell);
    });

}

function move(index){
    fetch("http://127.0.0.1:8000/move",{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({index,boarde,turn})
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            render();
        }else{
            count++;
        boarde=data.board;
        if(data.winner){
            alert(`winner is ${data.winner}`);
            resetgame();
        }
        turn=data.turn;
        htmlstatus.innerText = `Next Turn:${data.turn}`;
        render();
    }
    })
}

render();
