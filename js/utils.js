'use strict'



function createCell(i, j) {
    return {
        I: i,
        J: j,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
}
// I need to make sure 2 mines aren't placed in the same location 

function createMine(board) {
    var i = getRandomInt(0, board.length)
    var j = getRandomInt(0, board.length)
    board[i][j].isMine = true;
    gMines.push({
        I: i,
        J: j,
    })
    // console.log('mine created at cell', i, j)
}

function setMinesNegsCount(board, cellI, cellJ) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            // if (board[i][j] === MINE) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine === true) neighborsSum++; // check if cell contains value 
        }
    }
    return neighborsSum;

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}





///

var timeElapsed = 0;
var timerID = -1;

function tick() {
    timeElapsed++
    gGame.secsPassed = timeElapsed;
    document.getElementById("time").innerHTML = timeElapsed;
}

function start() {
    if (timerID == -1) {
        timerID = setInterval(tick, 1000);
    }
}

function stop() {
    if (timerID != -1) {
        clearInterval(timerID)
        timerID = -1
    }
}

function reset() {
    stop();
    timeElapsed = -1;
    tick()
}

