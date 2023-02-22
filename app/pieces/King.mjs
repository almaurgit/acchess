import { Piece } from "./Piece.mjs"

export class King extends Piece {

    symbol = "K"
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