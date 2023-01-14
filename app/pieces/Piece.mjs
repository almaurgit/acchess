import { validCoordinate, validColor } from "./functions.js"

export class Piece {

    constructor(position, color) {
        validCoordinate(position)
        this.position = position
        validColor(color)
        this.color = color
    }

    // function for generic moves (diagonally, vertically, horizontally)
}