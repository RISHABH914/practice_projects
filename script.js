const htmlboard=document.getElementById("board");
const htmlstatus=document.getElementById("status");

let boarde=Array(9).fill("");
let count=0;
let turn="X";
function resetgame(){
    count=0;
    boarde=Array(9).fill("");
    turn="X";
    render();
}

function render(){
    if(count>=9){
        alert("game is draw");
        resetgame();
    }
    htmlboard.innerHTML="";
    htmlstatus.innerText=`Turn:${turn}`;
    boarde.forEach((player,index) => {
        const htmlcell=document.createElement("div");
        htmlcell.classList.add("cell");
        htmlcell.innerText=player;

        htmlcell.addEventListener("click",()=> move(index));
        htmlboard.appendChild(htmlcell);
    });

}

function move(index){
    if(boarde[index]==""){
        boarde[index]=turn;
        checkwinner();
    }else{
        alert("wrong move");
        render();
    }
}

function checkwinner(){
    const winning = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ];
    for (let combination of winning){
        const [a,b,c]=combination;
        if(boarde[a]!="" && boarde[a]==boarde[b] && boarde[a]==boarde[c]){
            alert(`${turn} is winner`);
            resetgame();
        }
    }
    if(turn=="X"){
        turn="O";
    }else{
        turn = "X";
    }
    render();
}

render();
