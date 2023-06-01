import { Piece } from './Piece.mjs'

export class Knight extends Piece {
  symbol = 'N'
  name = 'knight'
  value = 3
  constructor(game, position, color, index) {
    super(game, position, color, index)
  }

  canAccess(endRow, endCol, capture, forKingSquares) {
    if (!forKingSquares && this.isPiecePinned().pinned) return false
    if (!forKingSquares && !this.mustBlockCheck(endRow, endCol)) return false
    if (
      [
        [1, 2],
        [2, 1],
      ].some(
        (array) =>
          array[0] === Math.abs(endRow - this.row) &&
          array[1] === Math.abs(endCol - this.col)
      )
    )
      return true
    return false
  }

  accessibleSquares() {
    let squares = []
    if (this.isPiecePinned().pinned) return squares

    const distances = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ]
    for (let dist of distances) {
      if (
        this.row + dist[0] >= this.game.dimensions ||
        this.row + dist[0] < 0 ||
        this.col + dist[1] >= this.game.dimensions ||
        this.col + dist[1] < 0
      )
        continue
      if (!this.mustBlockCheck(this.row + dist[0], this.col + dist[1])) continue

      let square = this.game.chessboard[this.row + dist[0]][this.col + dist[1]]
      if (square === null) {
        squares.push({
          row: this.row + dist[0],
          col: this.col + dist[1],
          capture: false,
        })
      } else if (square instanceof Piece && square.color != this.color) {
        squares.push({
          row: this.row + dist[0],
          col: this.col + dist[1],
          capture: true,
        })
      }
    }
    return squares
  }
}
