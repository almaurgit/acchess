import {Piece} from "./pieces/Piece.mjs"
import { Rook } from "./pieces/Rook.mjs"
import { Knight } from "./pieces/Knight.mjs"
import { Bishop } from "./pieces/Bishop.mjs"
import { Queen } from "./pieces/Queen.mjs"
import { King } from "./pieces/King.mjs"
import { Pawn } from "./pieces/Pawn.mjs"
import { filterChessboard } from "./functions.js"

export class Game {

    constructor (
        dimensions = 8,
        numberOfMoves = 0,
        piecesOnBoard = null
    ) {
        this.dimensions = dimensions
        if (this.dimensions >= 16 || this.dimensions < 8)
        {
            throw new Error("Wrong dimensions")
        }
        this.numberOfMoves = numberOfMoves
        this.capturedPieces = []
        this.pgn = ""
        this.chessboard = new Array(this.dimensions).fill(null).map(() => new Array(this.dimensions).fill(null))
        
        this.timer = {
            "white": 0.0,
            "black": 0.0
        }
        this.hasStarted = false
        this.playing = false
        this.over = false

        this.pieceSymbols = ["R", "N", "B", "Q", "K"]
        this.colLetters = new Array(dimensions).fill(null).map((_, i) => String.fromCharCode("a".charCodeAt() + i))
        this.rowNumbers = new Array(dimensions).fill(null).map((_, i) => (i + 1).toString())

        if (piecesOnBoard === null) {
            this.piecesOnBoard = [
                new Rook(this, "a1", "white"),
                new Pawn(this, "a2", "white"),
                new Pawn(this, "b2", "white"),
                new Pawn(this, "c2", "white"),
                new Pawn(this, "d2", "white"),
                new Pawn(this, "e2", "white"),
                new Pawn(this, "f2", "white"),
                new Pawn(this, "g2", "white"),
                new Pawn(this, "h2", "white"),
                new Knight(this, "b1", "white"),
                new Bishop(this, "c1", "white"),
                new Queen(this, "d1", "white"),
                new King(this, "e1", "white"),
                new Bishop(this, "f1", "white"),
                new Knight(this, "g1", "white"),
                new Rook(this, "h1", "white"),
                new Pawn(this, "a7", "black"),
                new Pawn(this, "b7", "black"),
                new Pawn(this, "c7", "black"),
                new Pawn(this, "d7", "black"),
                new Pawn(this, "e7", "black"),
                new Pawn(this, "f7", "black"),
                new Pawn(this, "g7", "black"),
                new Pawn(this, "h7", "black"),
                new Rook(this, "a8", "black"),
                new Knight(this, "b8", "black"),
                new Bishop(this, "c8", "black"),
                new Queen(this, "d8", "black"),
                new King(this, "e8", "black"),
                new Bishop(this, "f8", "black"),
                new Knight(this, "g8", "black"),
                new Rook(this, "h8", "black"),
            ]
            this.addPieces(this.piecesOnBoard)
        }
    }

    addPiece(piece) {
        const positionInChessboard = this.parseSquareToBoard(piece.position)
        this.chessboard[positionInChessboard.row][positionInChessboard.col] = piece
    }

    addPieces(pieces) {
        pieces.forEach(piece => this.addPiece(piece))
    }

    validColor(color) {
        return (color === "white" || color === "black")
    }
    
    validCoordinate(coordinate) {
        if (typeof coordinate !== 'string') {
            throw new Error("The square is not in string format")
        }
        const squareRegex = /^[a-z]\d\d?$/
        if (!squareRegex.test(coordinate)) {
            throw new Error("The square is not in a good format (example : g2)")
        }
        if (!this.colLetters.includes(coordinate[0])) throw new Error("Invalid column")
        if (!this.rowNumbers.includes(coordinate.slice(1))) throw new Error("Invalid row")
        return true
    }

    parseSquareToBoard(square) {
        if (this.validCoordinate(square)) {
            const row = this.dimensions - parseInt(square.slice(1))
            const col = square[0].charCodeAt() % "a".charCodeAt()
    
            return {row, col}
        }
     }

     printBoard() {
        this.chessboard.map(row => {
            row.map(piece => {
                process.stdout.write(piece instanceof Piece ? piece.symbol + ' ' : ". ")
            })
            console.log()
        })
     }

     getSquare(coordinate) {
        const {row, col} = this.parseSquareToBoard(coordinate)
        return this.chessboard[row][col]
     }

     setSquare(coordinate, piece) {
        const {row, col} = this.parseSquareToBoard(coordinate)
        this.chessboard[row][col] = piece 
     }


    /**
        * A move must be :
        * Either just a square => it means it's a pawn move,
        * A letter from a to h followed by an 'x' then a square => a pawn capture,
        * A letter amongst [R, N, B, Q, K] followed by a square => a piece move,
        * A letter amongst [R, N, B, Q, K] followed by an 'x' then a square => a piece capture,
        * A letter amongst [R, N, B, Q, K] followed by (a letter from a to the size of the board || a number from 1 to the size of the board) 
        *   then an 'x' then a square => a piece capture with ambiguity,
        * Like above but with the exact square of the piece to move if still ambiguous (three queens for example)
        * O-O or O-O-O in pgn notation, with 0 with FIDE notation, for short and long castle
        * A pawn move is followed by '=X' with X being the symbol of the piece to promote to.
        * All moves can be followed by '?' if inaccuracy/suspicious move, '??' for a blunder,
        *   '!' for a good move, '!!' for an impressive move, '+' for checks, '#' for checkmate
    */
    parseMove(move) {
        if (typeof move !== 'string')
            throw new Error("The move isn't valid (not a string)")
        if (move.length < 2) throw new Error("Move invalid (not enough characters")

        if (!move.includes("x") && !move.includes("=")) { // Not a capture nor a promotion
            //Pawn move
            if (move.length === 2 && this.validCoordinate(move)) {
                for (let row of this.chessboard) {
                    for (let piece of row) {
                        if (piece instanceof Pawn && piece.canMove(move)) {
                            return {piece, square: move, capture: false}
                        }
                    }
                }
            }

            //Piece move
            if (move.length >= 3 && move.length <= 5) {
                const pieceString = move.slice(0, -2)
                const squareToMove = move.slice(-2)

                if (!this.validCoordinate(squareToMove)) throw new Error("Wrong coordinates to move to")

                const pieceToMove = this.identifyPiece(pieceString, squareToMove)
                if (!pieceToMove) throw new Error("Error in the move (wrong syntax, or amiguity)")

                return {piece: pieceToMove, square: squareToMove, capture: false}
            }
        }
        else if (move.includes("x")) { // A capture
            const [pieceString, squareToMove, ...rest] = move.split("x")
            if (rest) throw new Error("Move error : one capture allowed")

            if (pieceString.length === 1 && this.colLetters.includes(pieceString) && this.validCoordinate(squareToMove)) { // pawn
                for (let row of this.chessboard) {
                    for (let piece of row) {
                        if (piece instanceof Pawn && piece.canCapture(squareToMove)) {
                            return {piece, square: squareToMove, capture: true}
                        }
                    }
                }
            }

            const pieceToMove = this.identifyPiece(pieceString)
            if (!pieceToMove) throw new Error("Error in the move (wrong syntax, or amiguity")

            return {piece: pieceToMove, square: squareToMove, capture: true}


        }
        else return null
    }
    

    identifyPiece(pieceString, squareToMove) {
        const pieceSymbol = pieceString[0]
        const pieceDisambiguation = pieceString.slice(1)
        console.log(pieceSymbol + "--" + pieceDisambiguation + "--" + squareToMove)
        if (pieceDisambiguation.length === 1) {
            if (!this.rowNumbers.includes(pieceDisambiguation) && !this.colLetters.includes(pieceDisambiguation))
                throw new Error("Amibiguity not handled", pieceDisambiguation, pieceString, squareToMove)
        }
        else if (pieceDisambiguation >= 1 && !this.validCoordinate(pieceDisambiguation)) {
            throw new Error("Amibiguity not handled", pieceDisambiguation, pieceString, squareToMove)
        }
        if (this.pieceSymbols.includes(pieceSymbol)) {
            const involvedPieces = filterChessboard(this.chessboard, (piece => {
                return piece instanceof Piece && piece.symbol === pieceSymbol && piece.position.includes(pieceDisambiguation)
            }))
            let numberOfPiecesThatCanMakeThatMove = 0
            let pieceToMove = null
            for (let piece of involvedPieces) {
                if (piece.canMove(squareToMove)) {
                    numberOfPiecesThatCanMakeThatMove++
                    pieceToMove = piece
                }
            }
            if (numberOfPiecesThatCanMakeThatMove > 1) throw new Error("Ambiguity regarding the piece to move")
            console.log("piece to move :", pieceToMove)
            return pieceToMove
        }
        return null
    }


}