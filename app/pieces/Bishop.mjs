import { Piece } from "./Piece.mjs"

export class Bishop extends Piece {

    symbol = "B"
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