import { Piece } from './Piece.mjs'
import { accessibleSquaresDiagonal, canAccessDiagonal } from './piecesRules.mjs'

export class Bishop extends Piece {
  symbol = 'B'
  name = 'bishop'
  value = 3
  constructor(game, position, color, index) {
    super(game, position, color, index)
  }

  canAccess = canAccessDiagonal.bind(this)

  accessibleSquares = accessibleSquaresDiagonal.bind(this)
}
