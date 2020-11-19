'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

var gBoard;
var gMines = [];

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gCell = {
    i: 0,
    J: 0,
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: false,
};

var gLevel = {
    SIZE: 4,
    MINES: 2
};


function initGame(level,mines) {
    gGame.isOn = true ; 
    console.log('level',level,'mines',mines)
    gLevel.SIZE = level ;
    gLevel.MINES = mines ;
    gBoard = buildBoard();
    renderBoard(gBoard, '.board-container')

    console.log('gMines', gMines)
    console.log('gBoard', gBoard)

}

function buildBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell(i, j);
        }
    }
    //  mines 
    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board);
    }

    // update mines count 
    var sum = 0;
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            sum = setMinesNegsCount(board, i, j)
            board[i][j].minesAroundCount = sum;
        }
    }


    // console.log('cell1:1 sum should return 2', setMinesNegsCount(board, 1, 1))

    // console.log('with sum', board)
    return board;
}


function renderBoard(board, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j].isMine;
            if (board[i][j].isMine) {
                cell = MINE;
            } else {
                cell = board[i][j].minesAroundCount;;
            }
            var id = 'cell-' + i + '-' + j;
            strHTML += `<td  oncontextmenu="cellMarked(event,${i},${j})" id="${id}" onclick="cellClicked(this,${i},${j})" ><span class="flag">${FLAG}</span> <span class="hide">${cell}</span> </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function cellMarked(e, i, j) {
    start()
    e.preventDefault();
    if (!gBoard[i][j].isShown) {
        if (!gBoard[i][j].isMarked) {
            // Model
            gBoard[i][j].isMarked = true;
            checkGameOver(e, i, j)
            // console.log('isMarked True-', i, j)
            gGame.markedCount++
            // console.log('gGame.markedCount', gGame.markedCount)
            // Dom
            var elCell = document.querySelector(`#cell-${i}-${j} .flag`)
            // console.log(elCell)
            elCell.classList.remove('flag');
        } else {
            gBoard[i][j].isMarked = false;
            // console.log('isMarked false-', i, j)
            gGame.markedCount--
            // console.log('--gGame.markedCount', gGame.markedCount)

            // Dom
            var elCell = document.querySelector(`#cell-${i}-${j} span`)
            elCell.classList.add('flag');

        }
    }
}

function cellClicked(elCell, i, j) {
    // timer
    start()

    // if cell marked
    if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        // Model
        gBoard[i][j].isShown = true;
        gGame.shownCount++
        // console.log('IsShwon True-', i, j)
        // console.log('gGame.shownCount-', gGame.shownCount)
        // Dom
        checkGameOver(elCell, i, j)
        elCell = document.querySelector(`#cell-${i}-${j} .hide `);
        elCell.classList.remove('hide');
        expandShown(gBoard, elCell, i, j)
    }
}


function expandShown(board, elCell, cellI, cellJ) {
    if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board[i].length) continue;
                if (board[i][j].minesAroundCount <= 3 && !board[i][j].isMarked && !board[i][j].isMine && !board[i][j].isShown) {
                    // Model
                    board[i][j].isShown = true;
                    gGame.shownCount++
                    // console.log('expandShown isShown true-', i, j)
                    // Dom
                    elCell = document.querySelector(`#cell-${i}-${j} .hide `);
                    elCell.classList.remove('hide');

                }
            }
        }
    }
}


function checkGameOver(elCell, i, j) {

    // lose
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        console.log('GAME OVER MOTHERF$#%')
        stop()
        gGame.isOn = false ; 

        var title = document.querySelector('h1')
        title.innerText = '💥 GAME OVER !!'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) {
                    var elCell = document.querySelector(`#cell-${i}-${j} .hide `);
                    elCell.classList.remove('hide');
                }
            }
        }
    }
    // win

    // if mines are marked & all cells shown
    if (gLevel.MINES === gGame.markedCount && gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        var title = document.querySelector('h1')
        title.innerText = '🥳 YOU WON!'
        console.log('WIN!')
        stop()
        gGame.isOn = false ; 

    }



}
