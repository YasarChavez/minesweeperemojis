const BOARD_SIZE = 8;
const MINES_COUNT = 10;

export function createBoard() {
    // Initialize empty board
    let board = Array(BOARD_SIZE).fill().map(() => 
        Array(BOARD_SIZE).fill().map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0
        }))
    );
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
    
    // Calculate neighbor mines
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(board, row, col);
            }
        }
    }
    
    return board;
}

function countNeighborMines(board, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < BOARD_SIZE && 
                newCol >= 0 && newCol < BOARD_SIZE &&
                board[newRow][newCol].isMine) {
                count++;
            }
        }
    }
    return count;
}

export function revealCell(board, row, col) {
    if (board[row][col].isRevealed || board[row][col].isFlagged) {
        return { board, gameOver: false };
    }
    
    board[row][col].isRevealed = true;
    
    if (board[row][col].isMine) {
        // Reveal all mines
        board.forEach(row => row.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true;
        }));
        return { board, gameOver: true, win: false };
    }
    
    // If cell has no neighbor mines, reveal neighbors
    if (board[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < BOARD_SIZE && 
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    !board[newRow][newCol].isRevealed) {
                    revealCell(board, newRow, newCol);
                }
            }
        }
    }
    
    // Check for win
    const unrevealed = board.flat().filter(cell => !cell.isRevealed).length;
    if (unrevealed === MINES_COUNT) {
        return { board, gameOver: true, win: true };
    }
    
    // Calculate score
    const score = board.flat().filter(cell => cell.isRevealed && !cell.isMine).length * 10;
    
    return { board, gameOver: false, score };
}

export function flagCell(board, row, col) {
    if (!board[row][col].isRevealed) {
        board[row][col].isFlagged = !board[row][col].isFlagged;
    }
    return board;
}