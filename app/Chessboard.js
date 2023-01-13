import {Piece} from "./Piece.mjs"
import { pion, rook, knight, bishop, queen, king, white, black }  from "./const.js"
import { validCoordinate } from "./functions.js"

export class Chessboard {

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
        // if (piecesOnBoard === null) {
        //     this.piecesOnBoard = [
        //         new Piece(pion, "a2", white),
        //         new Piece(pion, "b2", white),
        //         new Piece(pion, "c2", white),
        //         new Piece(pion, "d2", white),
        //         new Piece(pion, "e2", white),
        //         new Piece(pion, "f2", white),
        //         new Piece(pion, "g2", white),
        //         new Piece(pion, "h2", white),
        //         new Piece(rook, "a1", white),
        //         new Piece(knight, "b1", white),
        //         new Piece(bishop, "c1", white),
        //         new Piece(queen, "d1", white),
        //         new Piece(king, "e1", white),
        //         new Piece(bishop, "f1", white),
        //         new Piece(knight, "g1", white),
        //         new Piece(rook, "h1", white),
        //         new Piece(pion, "a7", black),
        //         new Piece(pion, "b7", black),
        //         new Piece(pion, "c7", black),
        //         new Piece(pion, "d7", black),
        //         new Piece(pion, "e7", black),
        //         new Piece(pion, "f7", black),
        //         new Piece(pion, "g7", black),
        //         new Piece(pion, "h7", black),
        //         new Piece(rook, "a8", black),
        //         new Piece(knight, "b8", black),
        //         new Piece(bishop, "c8", black),
        //         new Piece(queen, "d8", black),
        //         new Piece(king, "e8", black),
        //         new Piece(bishop, "f8", black),
        //         new Piece(knight, "g8", black),
        //         new Piece(rook, "h8", black),
        //     ] // change to one class by type of piece
        // }


    }

    addPiece(piece) {
        const positionInChessboard = this.parseSquareToBoard(piece.position)
        this.chessboard[positionInChessboard.row][positionInChessboard.col].add(piece)
    }

    addPieces(pieces) {
        pieces.map(piece => this.addPiece(piece))
    }

    parseSquareToBoard(square) {
        if (validCoordinate(square)) {
            const row = this.dimensions - parseInt(square.slice(1))
            const col = square[0].charCodeAt() % "a".charCodeAt()
    
            return {row, col}
        }
     }

     printBoard() {
        // this.square('a1') = "R "
        // this.square('b1') = "N "
        // this.square('c1') = "B "
        // this.square('d1') = "Q "
        // this.square('e1') = "K "
        // this.square('f1') = "B "
        // this.square('g1') = "N "
        // this.square('h1') = "R "
        this.chessboard.map(row => {
            // row.map(piece => process.stdout.write(piece instanceof Piece ? piece.symbol : "X "))
            row.map(piece => process.stdout.write(piece ? piece : "X "))
            console.log()
        })
     }

     square(coordinate) {
        const {row, col} = this.parseSquareToBoard(coordinate)
        return this.chessboard[row][col]
     }

}