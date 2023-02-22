import { validCoordinate, validColor } from "../functions.js"
import {Game} from "../Game.js"

export class Piece {

    constructor(game, position, color) {
        if (!(game instanceof Game)) throw new Error("invalid chessboard")
        this.game = game
        game.validCoordinate(position)
        this.position = position
        game.validColor(color)
        this.color = color
    }

    // function for generic moves (diagonally, vertically, horizontally)
}