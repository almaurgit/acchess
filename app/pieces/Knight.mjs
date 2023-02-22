import { Piece } from "./Piece.mjs"

export class Knight extends Piece {

    symbol = "N"
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