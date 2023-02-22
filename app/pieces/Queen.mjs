import { Piece } from "./Piece.mjs"

export class Queen extends Piece {

    symbol = "Q"
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