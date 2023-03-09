import { Piece } from "./Piece.mjs"
import { Rook } from "./Rook.mjs"
import { Bishop } from "./Bishop.mjs"
import { accessibleSquaresDiagonal, accessibleSquaresLine, canAccessLine, canAccessDiagonal } from "./piecesRules.mjs"


export class Queen extends Piece {

    symbol = "Q"
    value = 10
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess (endRow, endCol) {
        return canAccessLine.bind(this)(endRow, endCol) || canAccessDiagonal.bind(this)(endRow, endCol)
    }

    accessibleSquares() {
        return accessibleSquaresLine.bind(this).concat(accessibleSquaresDiagonal.bind(this))
    }
}