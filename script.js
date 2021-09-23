var trackBoard;
const humPlayer = "X";
const aiPlayer = "O";
var humTurn = true;
var iD;
const winArray = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];
const nav = document.querySelectorAll(".nav");
const restart = document.getElementById("btn");
const coop = document.getElementById("cop");
const ai = document.getElementById("ai");
const cells = document.querySelectorAll(".cell");
coop.addEventListener("click", startGame);
ai.addEventListener("click", startGame);
restart.addEventListener("click", rest);

function rest() {
  restart.style.display = "none";
  for (let i = 0; i < nav.length; i++) {
    nav[i].style.display = "inline";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].style.cursor = "pointer";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnComp, false);
    cells[i].removeEventListener("click", turnCoop, false);
  }
  document.querySelector(".winning-message").style.display = "none";
  document.getElementById("board").style.backgroundColor = "white";
}
function startGame(value) {
  iD = false
  for (let i = 0; i < nav.length; i++) {
    nav[i].style.display = "none";
  }
  restart.style.display = "inline";
  humTurn = true;

  /*Turning To the Chosen Mode*/
  if (value.target.id == "ai") {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.cursor = "pointer";

      cells[i].addEventListener("click",turnComp , { once: true });
    }
  }else if(value.target.id == "cop"){
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.cursor = "pointer";
  
        cells[i].addEventListener("click",turnCoop , { once: true });
    
  }
  }
  trackBoard = Array.from(Array(9).keys());
}
function turnComp(tu){
        turn(tu.target.id,humPlayer)
        if(!iD){
          var mini=minimax(trackBoard,aiPlayer)
          turn(mini.index,aiPlayer)
        }
        
        
        
    }
function turnCoop(tu){
  if (humTurn) {
      
      turn(tu.target.id, humPlayer);
  
      humTurn = !humTurn;
    } else if (!humTurn) {
      
      turn(tu.target.id, aiPlayer);
  
      humTurn = !humTurn;
    }
}

function turn(squareId, player) {
  trackBoard[squareId] = player;
  
  
  cells[squareId].style.cursor = "not-allowed";
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(trackBoard, player);
  if (gameWon) gameOver(gameWon);
}
//checking the winner
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winArray.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  if (plays.length === 5 && gameWon === null) {
  itDraw();
  }
  return gameWon;
}
// Coloring winning blocks and stop them from listening
function gameOver(gameWon) {
  for (let index of winArray[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humPlayer ? "green" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnCoop, false);
    cells[i].removeEventListener("click", turnComp, false);
  }
  winningMsg(gameWon.player);
}
//if it's a Draw
function itDraw() {
    iD=true
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnComp, false);
      cells[i].removeEventListener("click", turnCoop, false);
    
    document.getElementById("board").style.backgroundColor = "yellow";
    winningMsg("draw");
  }
  
}
//show winning message
function winningMsg(player) {
  document.getElementById("msg").style.display = "block";
  if (player === humPlayer) {
    document.getElementById("txt").innerText = "You Won!";
  } else if (player === aiPlayer) {
    document.getElementById("txt").innerText = "You Lost!";
  } else if (player === "draw") {
    document.getElementById("txt").innerText = "It's a Draw!";
  }
}

//////////////////////////////////////////////////////////////
function minimax(board, player) {
  let eSpots = emtyInd(board);
  if (winning(board, humPlayer)) {
    return { score: -1 };
  } else if (winning(board, aiPlayer)) {
    return { score: 1 };
  } else if (eSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];

  for (var i = 0; i < eSpots.length; i++) {
    var move = {};
    move.index = board[eSpots[i]];
    board[eSpots[i]] = player;
    if (player == aiPlayer) {
      var result = minimax(board, humPlayer);
      move.score = result.score;
    } else {
      var result = minimax(board, aiPlayer);
      move.score = result.score;
    }
    board[eSpots[i]] = move.index;
    moves.push(move);
  }
  // choose the move with the highest score

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // choose the move with the lowest score
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  //the chosen move
  
  return moves[bestMove];
}

function emtyInd(board) {
  return board.filter((e) => e != "X" && e != "O");
}
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}
