import { Piece } from './Piece.mjs'

export class Pawn extends Piece {
  symbol = 'P'
  name = 'pawn'
  value = 1
  constructor(game, position, color, index) {
    super(game, position, color, index)
    this.enPassant = false
  }

  canAccess(endRow, endCol, capture, forKingSquares) {
    if (!forKingSquares) {
      const pinned = this.isPiecePinned()
      if (pinned.pinned) {
        if (!pinned.direction) return false
        if (endCol > this.col && pinned.direction !== 'colUp') return false
        if (endCol < this.col && pinned.direction !== 'colDown') return false
        if (endCol === this.col && pinned.direction !== 'push') return false
      }
      if (!this.mustBlockCheck(endRow, endCol)) {
        return false
      }
    }
    if (capture === false) {
      if (this.col !== endCol) return false
      if (this.color === 'white') {
        if (endRow === this.row - 1) return true
        if (
          this.moves.length === 0 &&
          endRow === this.row - 2 &&
          this.game.chessboard[this.row - 1][this.col] === null
        ) {
          //1st move
          this.enPassant = true
          this.enPassantMove = this.game.numberOfMoves
          return true
        }
      } else if (this.color === 'black') {
        if (endRow === this.row + 1) return true
        if (
          this.moves.length === 0 &&
          endRow === this.row + 2 &&
          this.game.chessboard[this.row + 1][this.col] === null
        ) {
          //1st move
          this.enPassant = true
          this.enPassantMove = this.game.numberOfMoves
          return true
        }
      }
    } else if (capture === true) {
      if (this.color === 'white') {
        if (
          (this.col === endCol + 1 || this.col === endCol - 1) &&
          this.row - 1 === endRow
        ) {
          if (this.color === this.game.colorToMove) {
            if (this.game.chessboard[endRow][endCol]?.color === 'black')
              return true
            else if (this.#enPassant(endRow, endCol, 'white')) return true
            else return false
          }
          return true
        }
      } else if (this.color === 'black') {
        if (
          (this.col === endCol + 1 || this.col === endCol - 1) &&
          this.row + 1 === endRow
        ) {
          if (this.color === this.game.colorToMove) {
            if (this.game.chessboard[endRow][endCol]?.color === 'white')
              return true
            else if (this.#enPassant(endRow, endCol, 'black')) return true
            else return false
          }
          return true
        }
      }
    }

    return false
  }

  #enPassant(row, col, color) {
    if (color === 'white') {
      const pawnToCapture = this.game.chessboard[row + 1][col]
      if (
        pawnToCapture instanceof Pawn &&
        pawnToCapture.enPassant === true &&
        this.game.numberOfMoves === pawnToCapture.enPassantMove + 1
      ) {
        pawnToCapture.enPassant = false
        return true
      }
    } else if (color === 'black') {
      const pawnToCapture = this.game.chessboard[row - 1][col]
      if (
        pawnToCapture instanceof Pawn &&
        pawnToCapture.enPassant === true &&
        this.game.numberOfMoves === pawnToCapture.enPassantMove + 1
      ) {
        pawnToCapture.enPassant = false
        return true
      }
    }
    return false
  }

  accessibleSquares() {
    let squares = []
    const pinned = this.isPiecePinned()
    if (
      pinned.pinned &&
      pinned.direction !== 'colUp' &&
      pinned.direction !== 'colDown' &&
      pinned.direction !== 'push'
    )
      return squares
    if (this.color === 'white') {
      if (
        this.game.chessboard[this.row - 1][this.col] === null &&
        this.mustBlockCheck(this.row - 1, this.col) &&
        !(pinned.pinned && pinned.direction !== 'push')
      ) {
        squares.push({
          row: this.row - 1,
          col: this.col,
          capture: false,
        })
      }
      if (
        this.moves.length === 0 &&
        this.game.chessboard[this.row - 1][this.col] === null &&
        this.game.chessboard[this.row - 2][this.col] === null &&
        this.mustBlockCheck(this.row - 2, this.col) &&
        !(pinned.pinned && pinned.direction !== 'push')
      ) {
        squares.push({
          row: this.row - 2,
          col: this.col,
          capture: false,
        })
      }
      if (
        this.game.chessboard[this.row - 1][this.col - 1] instanceof Piece &&
        this.game.chessboard[this.row - 1][this.col - 1].color === 'black' &&
        this.mustBlockCheck(this.row - 1, this.col - 1) &&
        !(pinned.pinned && pinned.direction !== 'colDown')
      ) {
        squares.push({
          row: this.row - 1,
          col: this.col - 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row - 1][this.col + 1] instanceof Piece &&
        this.game.chessboard[this.row - 1][this.col + 1].color === 'black' &&
        this.mustBlockCheck(this.row - 1, this.col + 1) &&
        !(pinned.pinned && pinned.direction !== 'colUp')
      ) {
        squares.push({
          row: this.row - 1,
          col: this.col + 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row][this.col + 1] instanceof Pawn &&
        this.game.chessboard[this.row][this.col + 1].color === 'black' &&
        this.mustBlockCheck(this.row - 1, this.col + 1) &&
        this.game.chessboard[this.row][this.col + 1].enPassant === true &&
        this.game.chessboard[this.row][this.col + 1].enPassantMove ===
          this.game.numberOfMoves - 1 &&
        !(pinned.pinned && pinned.direction !== 'colUp')
      ) {
        squares.push({
          row: this.row - 1,
          col: this.col + 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row][this.col - 1] instanceof Pawn &&
        this.game.chessboard[this.row][this.col - 1].color === 'black' &&
        this.mustBlockCheck(this.row - 1, this.col - 1) &&
        this.game.chessboard[this.row][this.col - 1].enPassant === true &&
        this.game.chessboard[this.row][this.col - 1].enPassantMove ===
          this.game.numberOfMoves - 1 &&
        !(pinned.pinned && pinned.direction !== 'colDown')
      ) {
        squares.push({
          row: this.row - 1,
          col: this.col - 1,
          capture: true,
        })
      }
    } else if (this.color === 'black') {
      if (
        this.game.chessboard[this.row + 1][this.col] === null &&
        this.mustBlockCheck(this.row + 1, this.col) &&
        !(pinned.pinned && pinned.direction !== 'push')
      ) {
        squares.push({
          row: this.row + 1,
          col: this.col,
          capture: false,
        })
      }
      if (
        this.moves.length === 0 &&
        this.game.chessboard[this.row + 1][this.col] === null &&
        this.game.chessboard[this.row + 2][this.col] === null &&
        this.mustBlockCheck(this.row + 2, this.col) &&
        !(pinned.pinned && pinned.direction !== 'push')
      ) {
        squares.push({
          row: this.row + 2,
          col: this.col,
          capture: false,
        })
      }
      if (
        this.game.chessboard[this.row + 1][this.col - 1] instanceof Piece &&
        this.game.chessboard[this.row + 1][this.col - 1].color === 'white' &&
        this.mustBlockCheck(this.row + 1, this.col - 1) &&
        !(pinned.pinned && pinned.direction !== 'colDown')
      ) {
        squares.push({
          row: this.row + 1,
          col: this.col - 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row + 1][this.col + 1] instanceof Piece &&
        this.game.chessboard[this.row + 1][this.col + 1].color === 'white' &&
        this.mustBlockCheck(this.row + 1, this.col + 1) &&
        !(pinned.pinned && pinned.direction !== 'colUp')
      ) {
        squares.push({
          row: this.row + 1,
          col: this.col + 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row][this.col + 1] instanceof Pawn &&
        this.game.chessboard[this.row][this.col + 1].color === 'white' &&
        this.mustBlockCheck(this.row + 1, this.col + 1) &&
        this.game.chessboard[this.row][this.col + 1].enPassant === true &&
        this.game.chessboard[this.row][this.col + 1].enPassantMove ===
          this.game.numberOfMoves - 1 &&
        !(pinned.pinned && pinned.direction !== 'colUp')
      ) {
        squares.push({
          row: this.row + 1,
          col: this.col + 1,
          capture: true,
        })
      }
      if (
        this.game.chessboard[this.row][this.col - 1] instanceof Pawn &&
        this.game.chessboard[this.row][this.col - 1].color === 'white' &&
        this.mustBlockCheck(this.row + 1, this.col - 1) &&
        this.game.chessboard[this.row][this.col - 1].enPassant === true &&
        this.game.chessboard[this.row][this.col - 1].enPassantMove ===
          this.game.numberOfMoves - 1 &&
        !(pinned.pinned && pinned.direction !== 'colDown')
      ) {
        squares.push({
          row: this.row + 1,
          col: this.col - 1,
          capture: true,
        })
      }
    }
    return squares
  }
}
