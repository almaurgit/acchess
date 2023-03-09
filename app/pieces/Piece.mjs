import { validCoordinate, validColor } from "../functions.js"
import {Game} from "../Game.js"

export class Piece {

    constructor(game, position, color) {
        if (!(game instanceof Game)) throw new Error("invalid chessboard")
        this.game = game
        game.validCoordinate(position)
        this.position = position
        const {row, col} = game.parseSquareToBoard(position)
        this.row = row
        this.col = col
        game.validColor(color)
        this.color = color
        this.moves = []
    }

    canMove(position) {
        console.log("canMove to", position, "from", this.position)
        const {row: endRow, col: endCol} = this.game.parseSquareToBoard(position)
        // console.log(position, this.position)
        // console.log(endRow, endCol, this.row, this.col)
        // console.log("access ?", this.canAccess(endRow, endCol, false))
        if (!this.canAccess(endRow, endCol, false)) {
            console.log("cannot access", position, this.position)
            return false
        }
        if (this.game.chessboard[endRow][endCol] === null)
            return true 
        console.log("false ret", position, this.position)
        return false
    }

    canCapture(position) {
        const {row: endRow, col: endCol} = this.game.parseSquareToBoard(position)
        if (!this.canAccess(endRow, endCol, true))
            return false
        if (this.game.chessboard[endRow][endCol] === null || this.game.chessboard[endRow][endCol].color === this.color)
            return false
        return true 
    }

    makeMove(position) {
        console.log("makemove")
        const { row, col } = this.game.parseSquareToBoard(position)
        this.game.chessboard[this.row][this.col] = null
        this.game.chessboard[row][col] = this
        this.updatePosition(row, col)
        this.game.numberOfMoves++
        this.game.colorToMove = this.game.nextColor[this.game.colorToMove]
        this.moves.push(position)
    }

    makeCapture(position) {
        this.game.capturedPieces.push(this.game.chessboard[this.row][this.col])
        this.makeMove(position)
    }

    updatePosition(row, col) {
        console.log("update pos :", this.game.dimensions, row, col, this.game.colLetters[col] + this.game.rowNumbers[this.game.dimensions - row])
        this.row = row
        this.col = col
        this.position = this.game.colLetters[col] + this.game.rowNumbers[this.game.dimensions - 1 - row]
    }
}