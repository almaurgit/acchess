import { Piece } from "./Piece.mjs"
import { Rook } from "./Rook.mjs"
import { Bishop } from "./Bishop.mjs"
import { accessibleSquaresDiagonal, accessibleSquaresLine } from "./piecesRules.mjs"


export class Queen extends Piece {

    symbol = "Q"
    value = 10
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess(endRow, endCol, capture) {
        return false
        // return Rook.canAccess.bind(this) && Bishop.canAccess.bind(this)
    }

    accessibleSquares() {
        return accessibleSquaresLine.bind(this).concat(accessibleSquaresDiagonal.bind(this))
    }
}