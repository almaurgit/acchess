import { filterChessboard } from '../functions.js'
import { Piece } from './Piece.mjs'
import { Rook } from './Rook.mjs'

export class King extends Piece {
  symbol = 'K'
  name = 'king'
  constructor(game, position, color, index) {
    super(game, position, color, index)
    this.check = false
  }

  canAccess(
    endRow,
    endCol,
    capture,
    forKingSquares,
    forCastle,
    accessIfNoKing
  ) {
    if (this.row === endRow && this.col === endCol) return false
    const canTouch =
      Math.abs(endCol - this.col) <= 1 && Math.abs(endRow - this.row) <= 1
    if (canTouch && this.color !== this.game.colorToMove) return true
    if (
      canTouch &&
      !(
        this.game.chessboard[endRow][endCol] instanceof Piece &&
        this.game.chessboard[endRow][endCol].color === this.color
      ) &&
      !this.#squareInCheck(endRow, endCol)
    ) {
      return true
    } else if (
      !forCastle &&
      this.moves.length === 0 &&
      endCol - this.col === 2 && //SHORT CASTLE
      !this.game.inCheck &&
      this.game.chessboard[this.row][this.col + 1] === null &&
      !this.#squareInCheck(this.row, this.col + 1) &&
      this.game.chessboard[this.row][this.col + 2] === null &&
      !this.#squareInCheck(this.row, this.col + 2) &&
      this.game.chessboard[this.row][this.col + 3] instanceof Rook &&
      this.game.chessboard[this.row][this.col + 3].moves.length === 0
    ) {
      return true
    } else if (
      !forCastle &&
      this.moves.length === 0 &&
      endCol - this.col === -2 && //LONG CASTLE
      !this.game.inCheck &&
      this.game.chessboard[this.row][this.col - 1] === null &&
      !this.#squareInCheck(this.row, this.col - 1) &&
      this.game.chessboard[this.row][this.col - 2] === null &&
      !this.#squareInCheck(this.row, this.col - 2) &&
      this.game.chessboard[this.row][this.col - 3] === null &&
      !this.#squareInCheck(this.row, this.col - 3) &&
      this.game.chessboard[this.row][this.col - 4] instanceof Rook &&
      this.game.chessboard[this.row][this.col - 4].moves.length === 0
    ) {
      return true
    }
    return false
  }

  accessibleSquares() {
    let squares = []
    if (this.color === this.game.colorToMove && this.game.inCheck) {
      this.game.chessboard[this.row][this.col] = null
    }
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (!row && !col) continue
        if (
          this.row + row < 0 ||
          this.row + row >= this.game.dimensions ||
          this.col + col < 0 ||
          this.col + col >= this.game.dimensions
        )
          continue
        const pieceOnSquare =
          this.game.chessboard[this.row + row][this.col + col]
        if (
          this.canAccess(this.row + row, this.col + col, false, true, false)
        ) {
          squares.push({
            row: this.row + row,
            col: this.col + col,
            capture: !!pieceOnSquare && this.color !== pieceOnSquare.color,
          })
        }
      }
    }

    if (this.canAccess(this.row, this.col + 2, false, true, false)) {
      squares.push({
        row: this.row,
        col: this.col + 2,
        capture: false,
        castle: true,
      })
    }

    if (this.canAccess(this.row, this.col - 2, false, true, false)) {
      squares.push({
        row: this.row,
        col: this.col - 2,
        capture: false,
        castle: true,
      })
    }
    if (this.color === this.game.colorToMove && this.game.inCheck) {
      this.game.chessboard[this.row][this.col] = this
    }
    return squares
  }

  #squareInCheck(row, col) {
    const piecesOnBoard = this.game.chessboard
      .flat()
      .filter((piece) => piece instanceof Piece)
    for (let piece of piecesOnBoard) {
      if (
        piece !== null &&
        piece.color !== this.color &&
        piece.canAccess(row, col, true, true, true)
      ) {
        return true
      }
    }
    return false
  }

  isInCheck(getPiece, symbol, position) {
    let row = this.row
    let col = this.col
    const piecesOnBoard = this.game.chessboard
      .flat()
      .filter((piece) => piece instanceof Piece)
    for (let piece of piecesOnBoard) {
      if (
        piece instanceof Piece &&
        piece.color !== this.color &&
        piece.symbol !== 'K' &&
        piece.canAccess(row, col, true, true)
      ) {
        if (getPiece) return piece
        return true
      }
    }
    return false
  }

  numberOfChecks(getPiece) {
    let row = this.row
    let col = this.col
    let number = 0
    let piecePinning = null
    const piecesOnBoard = this.game.chessboard
      .flat()
      .filter((piece) => piece instanceof Piece)

    for (let piece of piecesOnBoard) {
      if (
        piece instanceof Piece &&
        piece.color !== this.color &&
        piece.symbol !== 'K' &&
        piece.canAccess(row, col, true, true)
      ) {
        number++
        piecePinning = piece
      }
    }
    if (getPiece && number === 1) return { piece: piecePinning, number }
    return { number }
  }
}
