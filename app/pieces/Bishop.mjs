import { Piece } from "./Piece.mjs"
import { accessibleSquaresDiagonal } from "./piecesRules.mjs"

export class Bishop extends Piece {

    symbol = "B"
    value = 3
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess(endRow, endCol) {

        if (this.row === endRow && this.col === endCol) return false
        if (Math.abs(endRow - this.row) !== Math.abs(endCol - this.col)) 
            return false
        else {
            let minCol = Math.min(endCol, this.col)
            let minRow = Math.min(endRow, this.row)
            let maxCol = Math.max(endCol, this.col)
            let maxRow = Math.max(endRow, this.row)
            if (endCol > this.col) {
                let col = minCol + 1
                let row = minRow + 1
                while (col < maxCol - 1 && row < maxRow - 1) {
                    if (this.game.chessboard[row][col] !== null) return false
                    row++
                    col++
                }
            }
            else {
                let col = maxCol - 1
                let row = minRow + 1
                while (col > minCol + 1 && row < maxRow - 1) {
                    if (this.game.chessboard[row][col] !== null) return false
                    row++
                    col--
                }
            }
        }
        return true
    }

    accessibleSquares() {
        return accessibleSquaresDiagonal.bind(this)
    }
}