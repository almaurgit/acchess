import { Piece } from './Piece.mjs'
import { accessibleSquaresLine, canAccessLine } from './piecesRules.mjs'

export class Rook extends Piece {
  symbol = 'R'
  name = 'rook'
  value = 5
  constructor(game, position, color, index) {
    super(game, position, color, index)
  }

  canAccess = canAccessLine.bind(this)

  accessibleSquares = accessibleSquaresLine.bind(this)
}
