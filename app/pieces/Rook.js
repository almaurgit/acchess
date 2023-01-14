export class Rook extends Piece {

    canMove(position, chessboard) {
        const {row: endRow, col: endCol} = chessboard.parseSquareToBoard(position)
        const {row, col} = chessboard.parseSquareToBoard(this.position)
        if (position === this.position) return false // we don't want to allow to make a move to the same square

        // specific rules for the rook (move verticaly and horizontally)
        if (endRow !== row && endCol !== col) return false
        if (endRow === row) {
            if (col > endCol) {
                for (let i = col - 1; i > endCol; i--) {
                    if (!(chessboard.chessboard[row][i] === "null")) return false
                }
            }
            else {
                for (let i = col + 1; i < endCol; i++) {
                    if (!(chessboard.chessboard[row][i] === "null")) return false
                }
            }
        }
        else {
            if (row > endRow) {
                for (let i = row - 1; i > endRow; i--) {
                    if (!(chessboard.chessboard[i][col] === "null")) return false
                }
            }
            else {
                for (let i = row + 1; i < endRow; i++) {
                    if (!(chessboard.chessboard[i][col] === "null")) return false
                }
            }
        }
        return true
    }

    canCapture(position, chessboard) {
        if (!this.canMove(position, chessboard))
            return false
        const {row, col} = chessboard.parseSquareToBoard(position)
        if (!chessboard.chessboard[row][col] || chessboard.chessboard[row][col].color === this.color)
            return false
        // add verif if this is the king
        return true 
    }

    // makeMove
    // makeCapture
}