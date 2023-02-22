import { Piece } from "./Piece.mjs"

export class Rook extends Piece {

    symbol = "R"
    constructor(game, position, color) {
        super(game, position, color)
    }

    canMove(position) {
        const {row: endRow, col: endCol} = this.game.parseSquareToBoard(position)
        const {row, col} = this.game.parseSquareToBoard(this.position)
        if (position === this.position) return false // we don't want to allow to make a move to the same square

        // specific rules for the rook (move verticaly and horizontally)
        if (endRow !== row && endCol !== col) return false
        if (endRow === row) {
            if (col > endCol) {
                for (let i = col - 1; i > endCol; i--) {
                    if (!(this.game.chessboard[row][i] === "null")) return false
                }
            }
            else {
                for (let i = col + 1; i < endCol; i++) {
                    if (!(this.game.chessboard[row][i] === "null")) return false
                }
            }
        }
        else {
            if (row > endRow) {
                for (let i = row - 1; i > endRow; i--) {
                    if (!(this.game.chessboard[i][col] === "null")) return false
                }
            }
            else {
                for (let i = row + 1; i < endRow; i++) {
                    if (!(this.game.chessboard[i][col] === "null")) return false
                }
            }
        }
        return true
    }

    canCapture(position) {
        if (!this.canMove(position))
            return false
        const {row, col} = this.game.parseSquareToBoard(position)
        if (!this.game.chessboard[row][col] || this.game.chessboard[row][col].color === this.color)
            return false
        // add verif if this is the king
        return true 
    }

    // makeMove
    // makeCapture
}