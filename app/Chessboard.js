import Piece from "./Piece.js"
import { pion, rook, knight, bishop, queen, king, white, black }  from "./const.js"
import { sqrt } from "Math"

class Chessboard {

    constructor (
        dimensions = 64,
        numberOfMoves = 0,
        piecesOnBoard = null
    ) {
        this.dimensions = dimensions
        if (sqrt(this.dimensions) ** 2 !== this.dimensions) { 
            throw Error("Mauvaise dimension de l'échiquier") 
        }
        this.numberOfMoves = numberOfMoves
        this.capturedPieces = []
        this.pgn = ""
        this.chessboard = new Array(this.dimensions * this.dimensions)
        if (piecesOnBoard === null) {
            this.piecesOnBoard = [
                new Piece(pion, "a2", white),
                new Piece(pion, "b2", white),
                new Piece(pion, "c2", white),
                new Piece(pion, "d2", white),
                new Piece(pion, "e2", white),
                new Piece(pion, "f2", white),
                new Piece(pion, "g2", white),
                new Piece(pion, "h2", white),
                new Piece(rook, "a1", white),
                new Piece(knight, "b1", white),
                new Piece(bishop, "c1", white),
                new Piece(queen, "d1", white),
                new Piece(king, "e1", white),
                new Piece(bishop, "f1", white),
                new Piece(knight, "g1", white),
                new Piece(rook, "h1", white),
                new Piece(pion, "a7", black),
                new Piece(pion, "b7", black),
                new Piece(pion, "c7", black),
                new Piece(pion, "d7", black),
                new Piece(pion, "e7", black),
                new Piece(pion, "f7", black),
                new Piece(pion, "g7", black),
                new Piece(pion, "h7", black),
                new Piece(rook, "a8", black),
                new Piece(knight, "b8", black),
                new Piece(bishop, "c8", black),
                new Piece(queen, "d8", black),
                new Piece(king, "e8", black),
                new Piece(bishop, "f8", black),
                new Piece(knight, "g8", black),
                new Piece(rook, "h8", black),
            ] // change to one class by type of piece
        }

        // must be seen as 2d array of dim * dim
        this.chessboard = new Array(this.dimensions).fill(0)

    }

}