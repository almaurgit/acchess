import { Piece } from "./Piece.mjs"
import { accessibleSquaresLine, canAccessLine } from "./piecesRules.mjs"

export class Rook extends Piece {

    symbol = "R"
    value = 5
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess(endRow, endCol) {
        return canAccessLine.bind(this)(endRow, endCol)
    }

    accessibleSquares() { 
        return accessibleSquaresLine.bind(this)
    }
}

