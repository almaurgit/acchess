import { validCoordinate, validColor, findChessboard } from "../functions.js"
import { Game } from "../Game.js"

export class Piece {

    constructor(game, position = null, color = null) {
        if (!(game instanceof Game)) throw new Error("invalid chessboard")
        this.game = game
        if (position) {
            game.validCoordinate(position) 
            this.position = position
            const {row, col} = game.parseSquareToBoard(position)
            this.row = row
            this.col = col
        }
        if (color) game.validColor(color)
        this.color = color
        this.moves = []
        this.doingEnPassant = false
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
        this.doingEnPassant = this.#enPassantAvailable()
        if (!this.doingEnPassant
            && (this.game.chessboard[endRow][endCol] === null || this.game.chessboard[endRow][endCol].color === this.color))
            return false
        if (!this.canAccess(endRow, endCol, true))
            return false
        return true 
    }

    makeMove(position, capture, option) {
        console.log("makemove", option)
        if (capture)
            this.game.capturedPieces.push(this)
        const { row, col } = this.game.parseSquareToBoard(position)
        this.game.chessboard[this.row][this.col] = null
        this.game.chessboard[row][col] = this
        if (this.doingEnPassant) this.game.chessboard[row + (this.color === "white" ? +1 : -1)][col] = null
        if (option && option.promotion) this.#promote(option.promotionPiece)
        if (this.#inCheck()) {
            let lastPiece = null
            if (capture)
                lastPiece = this.game.capturedPieces.pop()
            this.game.chessboard[this.row][this.col] = this
            this.game.chessboard[row][col] = lastPiece
            if (this.doingEnPassant) this.game.chessboard[row + (this.color === "white" ? +1 : -1)][col] = lastPiece
            else this.game.chessboard[row][col] = lastPiece
            throw new Error("ERROR : this move puts your king in CHECK ! ILLEGAL MOVE")
        }
        if (option && option.castle) this.#makeCastle(row, col, option.castle)
        this.updatePosition(row, col)
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

    #makeCastle(row, col, castle) {
        let shiftRook = castle === "short" ? -2 : +3
        let rook = null
        if (castle === "short") {
            rook = findChessboard(this.game.chessboard, piece => {
                return (piece?.symbol === "R" && piece.color === this.game.colorToMove && (piece.col > this.col))
            })
        }
        else if (castle === "long") {
            rook = findChessboard(this.game.chessboard, piece => {
                return (piece?.symbol === "R" && piece.color === this.game.colorToMove && (piece.col < this.col))
            })
        }
        console.log("modify rook position :", rook.row, rook.row, rook.col, rook.col + shiftRook)
        if (!rook) throw new Error("Impossible to find rook to castle")
        this.game.chessboard[rook.row][rook.col] = null
        this.game.chessboard[rook.row][rook.col + shiftRook] = rook
        rook.updatePosition(rook.row, rook.col + shiftRook)

    }

    #enPassantAvailable() {
        let shift = [-1, +1]
        for (let i = 0; i < 2; i++) {
            if (this.symbol === "P" 
            && this.game.chessboard[this.row][this.col + shift[i]]?.symbol === "P" 
            && this.game.chessboard[this.row][this.col + shift[i]]?.enPassant
            && this.game.chessboard[this.row][this.col + shift[i]]?.enPassantMove === this.game.numberOfMoves - 1)
                return true
        }
        return false
    }

    #inCheck() {
        let king = findChessboard(this.game.chessboard, piece => piece?.symbol === "K" && piece?.color === this.color)
        if (king.isInCheck()) return true
        return false
    }

    #promote(promotionPiece) {
        console.log("PROOOOMOOOTOIIIIIOOONNNNN")
        promotionPiece.color = this.color
        promotionPiece.moves = this.moves
        this.game.chessboard[promotionPiece.row][promotionPiece.col] = promotionPiece
    }
}