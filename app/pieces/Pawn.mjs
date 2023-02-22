import { Piece } from "./Piece.mjs"

export class Pawn extends Piece {

    symbol = "P"
    constructor(game, position, color) {
        super(game, position, color)
    }

    canMove(position) {
        return true
    }

    canCapture(position) {
        return true
    }
}