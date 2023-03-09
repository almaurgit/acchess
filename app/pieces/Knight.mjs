import { Piece } from "./Piece.mjs"

export class Knight extends Piece {

    symbol = "N"
    value = 3
    constructor(game, position, color) {
        super(game, position, color)
    }

    canAccess(endRow, endCol, capture) {

        console.log(endRow, this.row, endCol, this.col, [Math.abs(endRow - this.row), Math.abs(endCol - this.col)])
        if ([[1, 2], [2, 1]].some(array => array[0] === Math.abs(endRow - this.row) && array[1] === Math.abs(endCol - this.col))) 
        {
            console.log("yeaaaah")
            return true

        }
        return false
    }

    accessibleSquares() {
        let squares = []
        const distances = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
        for (let dist of distances) {
            if (this.row + dist[0] > this.game.dimensions || this.row + dist[0] < 0
                || this.col + dist[1] > this.game.dimensions || this.col + dist[1] < 0)
                continue
            let square = this.game.chessboard[this.row + dist[0]][this.col + dist[1]]
            if (square === null) {
                squares.push({
                    row: this.row + dist[0],
                    col: this.col + dist[1],
                    capture: false
                })
            }
            else if (square instanceof Piece && square.color != this.color) {
                squares.push({
                    row: this.row + dist[0],
                    col: this.col + dist[1],
                    capture: true
                })
            }
        }
        return squares
        // if (this.row + 2 < this.chessboard.dimensions && this.col + 1 < this.chessboard.dimensions)
        //     squares.push()
    }
}