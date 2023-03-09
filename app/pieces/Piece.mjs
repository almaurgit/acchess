import { validCoordinate, validColor, findChessboard } from "../functions.js"
import { Game } from "../Game.js"

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
        if (this.game.chessboard[endRow][endCol] === null) {
            console.log("YES")
            return true 
        }
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

    makeMove(position, capture, castle) {
        console.log("makemove")
        if (capture)
            this.game.capturedPieces.push(this)
        const { row, col } = this.game.parseSquareToBoard(position)
        this.game.chessboard[this.row][this.col] = null
        this.game.chessboard[row][col] = this
        this.updatePosition(row, col)
        if (castle) {
            let shiftRook = castle === "short" ? -2 : +3
            let rook = null
            if (castle === "short") {
                rook = findChessboard(this.game.chessboard, piece => {
                    return (piece?.symbol === "R" && (piece.col > this.col))
                })
            }
            else if (castle === "long") {
                rook = findChessboard(this.game.chessboard, piece => {
                    return (piece?.symbol === "R" && (piece.col < this.col))
                })
            }
            console.log("modify rook position :", rook.row, rook.row, rook.col, rook.col + shiftRook)
            if (!rook) throw new Error("Impossible to find rook to castle")
            this.game.chessboard[rook.row][rook.col] = null
            this.game.chessboard[rook.row][rook.col + shiftRook] = this
            rook.updatePosition(rook.row, rook.col + shiftRook)
        }
        this.game.numberOfMoves++
        this.game.colorToMove = this.game.nextColor[this.game.colorToMove]
        this.moves.push(position)
    }

    makeCapture(position) {
        this.makeMove(position)
    }

    updatePosition(row, col) {
        console.log("update pos :", this.game.dimensions, row, col, this.game.colLetters[col] + this.game.rowNumbers[this.game.dimensions - 1 - row])
        this.row = row
        this.col = col
        this.position = this.game.colLetters[col] + this.game.rowNumbers[this.game.dimensions - 1 - row]
    }
}