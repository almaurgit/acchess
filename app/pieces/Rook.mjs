import { Piece } from "./Piece.mjs"
import { accessibleSquaresLine } from "./piecesRules.mjs"

export class Rook extends Piece {

    symbol = "R"
    value = 5
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess(endRow, endCol) {
        if (endRow === this.row && endCol === this.col) return false // we don't want to allow to make a move to the same square

        // specific rules for the rook (move verticaly and horizontally)
        if (endRow !== this.row && endCol !== this.col) return false
        if (endRow === this.row) {
            if (this.col > endCol) {
                for (let i = this.col - 1; i > endCol + 1; i--) {
                    if (!(this.game.chessboard[this.row][i] === "null")) return false
                }
            }
            else {
                for (let i = this.col + 1; i < endCol - 1; i++) {
                    if (!(this.game.chessboard[this.row][i] === "null")) return false
                }
            }
        }
        else {
            if (this.row > endRow) {
                for (let i = this.row - 1; i > endRow + 1; i--) {
                    if (!(this.game.chessboard[i][this.col] === "null")) return false
                }
            }
            else {
                for (let i = this.row + 1; i < endRow - 1; i++) {
                    if (!(this.game.chessboard[i][this.col] === "null")) return false
                }
            }
        }
        return true
    }

    accessibleSquares() { 
        return accessibleSquaresLine.bind(this)
    }
}

