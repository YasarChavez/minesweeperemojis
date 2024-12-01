import { createBoard, revealCell, flagCell } from './game.js';
import { startTimer, stopTimer, resetTimer } from './timer.js';

let gameActive = false;
let board;

function initGame() {
    gameActive = true;
    resetTimer();
    startTimer();
    board = createBoard();
    renderBoard();
    document.getElementById('score').textContent = '0';
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.dataset.row = i;
            cellElement.dataset.col = j;
            
            if (cell.isRevealed) {
                cellElement.classList.add('revealed');
                cellElement.textContent = cell.isMine ? '💣' : 
                    cell.neighborMines > 0 ? cell.neighborMines : '';
            } else if (cell.isFlagged) {
                cellElement.textContent = '🚩';
            } else {
                cellElement.textContent = '🟩';
            }
            
            boardElement.appendChild(cellElement);
        });
    });
}

function handleCellClick(event) {
    if (!gameActive) return;
    
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (event.button === 2 || event.ctrlKey) { // Right click or Ctrl+click
        board = flagCell(board, row, col);
    } else {
        const result = revealCell(board, row, col);
        if (result.gameOver) {
            gameActive = false;
            stopTimer();
            alert(result.win ? '¡Has ganado! 🎉' : 'Game Over 💥');
        }
        if (result.score) {
            document.getElementById('score').textContent = result.score;
        }
    }
    
    renderBoard();
}

// Event Listeners
document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('board').addEventListener('click', handleCellClick);
document.getElementById('board').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    handleCellClick(e);
});

// Initialize game
initGame();