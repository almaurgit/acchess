import { filterChessboard } from "../functions.js"
import { Piece } from "./Piece.mjs"
import { Rook } from "./Rook.mjs"

export class King extends Piece {

    symbol = "K"
    constructor(game, position, color) {
        super(game, position, color)
        this.check = false
    }

    canAccess(endRow, endCol) {

        if (Math.abs(endCol - this.col) <= 1 && Math.abs(endRow - this.row) <= 1
            && !this.#squareInCheck(endRow, endCol)) {
            return true
        }
        else if (this.moves.length === 0 && (endCol - this.col === 2) //SHORT CASTLE
            && this.game.chessboard[this.row][this.col + 1] === null
            && !this.#squareInCheck(this.row, this.col + 1)
            && this.game.chessboard[this.row][this.col + 2] === null
            && !this.#squareInCheck(this.row, this.col + 2)
            && this.game.chessboard[this.row][this.col + 3] instanceof Rook
            && this.game.chessboard[this.row][this.col + 3].moves.length === 0)
            return true
        else if (this.moves.length === 0 && (endCol - this.col === -2) //LONG CASTLE
            && this.game.chessboard[this.row][this.col - 1] === null
            && !this.#squareInCheck(this.row, this.col - 1)
            && this.game.chessboard[this.row][this.col - 2] === null
            && !this.#squareInCheck(this.row, this.col - 2)
            && this.game.chessboard[this.row][this.col - 3] === null
            && !this.#squareInCheck(this.row, this.col - 3)
            && this.game.chessboard[this.row][this.col - 4] instanceof Rook
            && this.game.chessboard[this.row][this.col - 4].moves.length === 0)
            return true
    }

    accessibleSquares() {
        let squares = filterChessboard(this.game.chessboard, this.canAccess)
    }

    #squareInCheck(row, col) {

        for (let piece of this.game.chessboard.flat()) {
            if (piece !== null && piece.color !== this.color
                && piece.canAccess(row, col, true))
                return true
        }
        return false
    }
}