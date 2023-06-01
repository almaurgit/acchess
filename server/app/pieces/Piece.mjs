import { validCoordinate, validColor, findChessboard } from '../functions.js'
import { Game } from '../Game.js'

export class Piece {
  constructor(game, position = null, color = null, index = null) {
    if (!(game instanceof Game)) throw new Error('invalid chessboard')
    this.game = game
    if (position) {
      game.validCoordinate(position)
      this.position = position
      const { row, col } = game.parseSquareToBoard(position)
      this.row = row
      this.col = col
    }
    if (index !== null) {
      if (index >= game.dimensions * game.dimensions)
        throw new Error('Impossible to create piece : invalid index')
      this.row = Math.floor(index / game.dimensions)
      this.col = index % game.dimensions
      this.position = game.positionToSquare(this.row, this.col)
    }
    if (color) game.validColor(color)
    this.color = color
    this.moves = []
    this.doingEnPassant = false
  }

  isPiecePinned() {
    const king = findChessboard(
      this.game.chessboard,
      (piece) => piece?.symbol === 'K' && piece?.color === this.color
    )
    if (!this.game.inCheck) {
      this.game.chessboard[this.row][this.col] = null
      const pieceChecking = king?.numberOfChecks(true)
      if (pieceChecking.number > 1) {
        return { pinned: true }
      }
      if (pieceChecking.number === 1) {
        const directionPin = this.#getDirectionPin(
          pieceChecking.piece.row,
          pieceChecking.piece.col,
          this.row,
          this.col
        )
        this.game.chessboard[this.row][this.col] = this
        return { pinned: true, direction: directionPin }
      }
    } else {
      let numberChecksBefore = king.numberOfChecks().number
      this.game.chessboard[this.row][this.col] = null
      let numberChecksAfter = king.numberOfChecks().number
      this.game.chessboard[this.row][this.col] = this
      if (numberChecksAfter === numberChecksBefore) return { pinned: false }
      else return { pinned: true }
    }
    this.game.chessboard[this.row][this.col] = this
    return { pinned: false }
  }

  mustBlockCheck(row, col) {
    if (!this.game.inCheck) return true
    let lastPiece
    if (this.doingEnPassant) {
      lastPiece =
        this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col]
      this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col] = null
    } else lastPiece = this.game.chessboard[row][col]
    this.game.chessboard[row][col] = this
    const king = findChessboard(
      this.game.chessboard,
      (piece) => piece?.symbol === 'K' && piece?.color === this.color
    )
    if (!king?.isInCheck()) {
      if (this.doingEnPassant) {
        this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col] =
          lastPiece
      } else this.game.chessboard[row][col] = lastPiece
      return true
    }
    this.game.chessboard[row][col] = lastPiece
    return false
  }

  canMove(position) {
    const { row: endRow, col: endCol } = this.game.parseSquareToBoard(position)

    if (!this.canAccess(endRow, endCol, false)) {
      return false
    }
    if (this.game.chessboard[endRow][endCol] === null) {
      return true
    }
    return false
  }

  canCapture(position) {
    const { row: endRow, col: endCol } = this.game.parseSquareToBoard(position)
    this.doingEnPassant = this.#enPassantAvailable()
    if (
      !this.doingEnPassant &&
      (this.game.chessboard[endRow][endCol] === null ||
        this.game.chessboard[endRow][endCol].color === this.color)
    )
      return false
    if (!this.canAccess(endRow, endCol, true)) {
      return false
    }
    return true
  }

  makeMove(position, row, col, capture, option) {
    if (capture) this.game.capturedPieces.push(this.game.chessboard[row][col])
    if (this.doingEnPassant)
      this.game.capturedPieces.push(
        this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col]
      )

    let [lastRow, lastCol] = [this.row, this.col]
    this.game.chessboard[this.row][this.col] = null
    this.game.chessboard[row][col] = this
    if (this.doingEnPassant)
      this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col] = null
    if (option && option.promotion) this.#promote(option.promotionPiece)
    if (option && option.castle) this.#makeCastle(row, col, option.castle)

    this.updatePosition(row, col)
    if (this.#inCheck()) {
      let lastPiece = null
      if (capture || this.doingEnPassant)
        lastPiece = this.game.capturedPieces.pop()
      this.game.chessboard[lastRow][lastCol] = this
      this.game.chessboard[row][col] = this.doingEnPassant ? null : lastPiece
      if (this.doingEnPassant)
        this.game.chessboard[row + (this.color === 'white' ? +1 : -1)][col] =
          lastPiece
      else this.game.chessboard[row][col] = lastPiece
      this.updatePosition(lastRow, lastCol)
      throw new Error(
        'ERROR : this move puts your king in CHECK ! ILLEGAL MOVE'
      )
    }
    this.game.numberOfMoves++
    if (this.symbol === 'P') this.game.lastPawnMove = this.game.numberOfMoves
    if (capture || this.doingEnPassant)
      this.game.lastCapture = this.game.numberOfMoves
    this.game.colorToMove = this.game.nextColor[this.game.colorToMove]
    this.moves.push(position)
  }

  makeCapture(position) {
    this.makeMove(position)
  }

  updatePosition(row, col) {
    this.row = row
    this.col = col
    this.position =
      this.game.colLetters[col] +
      this.game.rowNumbers[this.game.dimensions - 1 - row]
  }

  #makeCastle(row, col, castle) {
    let shiftRook = castle === 'short' ? -2 : +3
    let rook = null
    if (castle === 'short') {
      rook = findChessboard(this.game.chessboard, (piece) => {
        return (
          piece?.symbol === 'R' &&
          piece.color === this.game.colorToMove &&
          piece.col > this.col
        )
      })
    } else if (castle === 'long') {
      rook = findChessboard(this.game.chessboard, (piece) => {
        return (
          piece?.symbol === 'R' &&
          piece.color === this.game.colorToMove &&
          piece.col < this.col
        )
      })
    }
    if (!rook) throw new Error('Impossible to find rook to castle')
    this.game.chessboard[rook.row][rook.col] = null
    this.game.chessboard[rook.row][rook.col + shiftRook] = rook
    rook.updatePosition(rook.row, rook.col + shiftRook)
  }

  #enPassantAvailable() {
    let shift = [-1, +1]
    for (let i = 0; i < 2; i++) {
      if (
        this.symbol === 'P' &&
        this.game.chessboard[this.row][this.col + shift[i]]?.symbol === 'P' &&
        this.game.chessboard[this.row][this.col + shift[i]]?.enPassant &&
        this.game.chessboard[this.row][this.col + shift[i]]?.enPassantMove ===
          this.game.numberOfMoves - 1
      )
        return true
    }
    return false
  }

  #inCheck() {
    let king = findChessboard(
      this.game.chessboard,
      (piece) => piece?.symbol === 'K' && piece?.color === this.color
    )
    if (king.isInCheck()) {
      return true
    }
    return false
  }

  #promote(promotionPiece) {
    promotionPiece.color = this.color
    promotionPiece.moves = this.moves
    this.game.chessboard[promotionPiece.row][promotionPiece.col] =
      promotionPiece
  }

  #getDirectionPin(pinnerRow, pinnerCol, row, col, capture) {
    if (this.symbol === 'P') {
      if (pinnerCol > col) return 'colUp'
      if (pinnerCol < col) return 'colDown'
      if (pinnerCol === col) return 'push'
    }
    if (pinnerRow === row) return 'row'
    if (pinnerCol === col) return 'col'
    if (
      (pinnerRow < row && pinnerCol < col) ||
      (pinnerRow > row && pinnerCol > col)
    )
      return 'diagonalDown'
    if (
      (pinnerRow > row && pinnerCol < col) ||
      (pinnerRow < row && pinnerCol > col)
    )
      return 'diagonalUp'
  }
}
