import { Piece } from './Piece.mjs'
import { Rook } from './Rook.mjs'
import { Bishop } from './Bishop.mjs'
import {
  accessibleSquaresDiagonal,
  accessibleSquaresLine,
  canAccessLine,
  canAccessDiagonal,
} from './piecesRules.mjs'

export class Queen extends Piece {
  symbol = 'Q'
  name = 'queen'
  value = 10
  constructor(game, position, color, index) {
    super(game, position, color, index)
  }

  canAccess(endRow, endCol, capture, forKingSquares) {
    return (
      canAccessLine.bind(this)(endRow, endCol, capture, forKingSquares) ||
      canAccessDiagonal.bind(this)(endRow, endCol, capture, forKingSquares)
    )
  }

  accessibleSquares() {
    return accessibleSquaresLine
      .bind(this)()
      .concat(accessibleSquaresDiagonal.bind(this)())
  }
}
