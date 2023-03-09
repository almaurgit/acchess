import { Piece } from "./Piece.mjs"
import { accessibleSquaresDiagonal, canAccessDiagonal } from "./piecesRules.mjs"

export class Bishop extends Piece {

    symbol = "B"
    value = 3
    constructor(game, position, color) {
        super(game, position, color)
    }

    // canAccess(endRow, endCol) {
    //     return canAccessDiagonal.bind(this, endRow, endCol)
    // }

    canAccess = canAccessDiagonal.bind(this)

    accessibleSquares = accessibleSquaresDiagonal.bind(this)
    
}