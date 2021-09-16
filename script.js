var trackBoard;
const humPlayer = 'O'
const aiPlayer = 'X'
var humTurn = true
const winArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [6,4,2],
    [0,3,6],
    [1,4,7],
    [2,5,8]
]
const nav = document.querySelectorAll('.nav')
const restart = document.getElementById("btn")
const coop = nav[1]
const cells = document.querySelectorAll('.cell')
coop.addEventListener('click',startGame)
restart.addEventListener('click',rest)

function rest(){
    restart.style.display="none";
    for(let i=0;i<nav.length;i++){
        nav[i].style.display="inline"
    }
    for(let i=0;i<cells.length;i++){
        cells[i].innerText=''
        cells[i].style.removeProperty('background-color')
        cells[i].style.cursor= "pointer"
        
    }
    for(var i = 0; i<cells.length;i++){
        cells[i].removeEventListener('click',turnClick,false)
    }
    document.querySelector('.winning-message').style.display="none"
    document.getElementById("board").style.backgroundColor = "white"
}
function startGame(){
    for(let i=0;i<nav.length;i++){
        nav[i].style.display="none"
    }
    restart.style.display="inline";
    humTurn = true
    for(let i=0;i<cells.length;i++){
        cells[i].style.cursor= "pointer"
        cells[i].addEventListener('click',turnClick,{once:true})
    }
    trackBoard = Array.from(Array(9).keys())
    
}
function turnClick(square){
    
    if(humTurn){
        turn(square.target.id,humPlayer);
        humTurn = !humTurn
    }else if(!humTurn){
        turn(square.target.id,aiPlayer);
        humTurn = !humTurn
    }

    
}
function turn(squareId,player){
    trackBoard[squareId] = player;
    cells[squareId].style.cursor= "not-allowed"
    document.getElementById(squareId).innerText = player
    let gameWon = checkWin(trackBoard,player)
    if (gameWon) gameOver(gameWon)
}
//checking the winner
function checkWin(board,player){
    let plays = board.reduce((a,e,i)=>
    (e===player)?a.concat(i):a,[]);
    let gameWon=null
    for(let [index,win]of winArray.entries()){
        if(win.every(elem => plays.indexOf(elem)>-1)){
            gameWon = {index:index,player:player}
            break;
        }
    }
    itDraw(plays,gameWon)
    return gameWon;
}
// Coloring winning blocks and stop them from listening
function gameOver(gameWon){
    for(let index of winArray[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == humPlayer?"green":"red";
    }
    for(var i = 0; i<cells.length;i++){
        cells[i].removeEventListener('click',turnClick,false)
    }
    winningMsg(gameWon.player)
}
//if it's a Draw
function itDraw(plays,gameWon){
    if(plays.length === 5 && gameWon===null){
        for(var i = 0; i<cells.length;i++){
            cells[i].removeEventListener('click',turnClick,false)
        }
        document.getElementById("board").style.backgroundColor = "yellow"
        winningMsg("draw")
    }
}
//show winning message 
function winningMsg(player){
    document.getElementById("msg").style.display="block"
    if(player === humPlayer){
        document.getElementById("txt").innerText="You Won!"
    }else if(player === aiPlayer){
        document.getElementById("txt").innerText="You Lost!"
    }else if(player === "draw"){
        document.getElementById("txt").innerText="It's a Draw!"
    }
}



