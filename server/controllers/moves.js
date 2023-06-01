import { games } from '../globals.js'

function getAvailableMoves(req, res, next) {
  const { index, id } = req.params

  const accessibleSquares = games[id]
    .getSquareWithIndex(index)
    .accessibleSquares()
  const dataAvailableSquares = {}
  accessibleSquares.forEach((square) => {
    dataAvailableSquares[square.row * games[id].dimensions + square.col] =
      square.capture
  })
  res.json({ dataAvailableSquares })
}

function playMove(req, res, next) {
  let { id, startIndex, endIndex } = req.params
  const game = games[id]
  startIndex = Number(startIndex)
  endIndex = Number(endIndex)
  const pieceToMove = game.getSquareWithIndex(startIndex)
  game.playMove(startIndex, endIndex)
  res.json(game.parsedChessboard())
}

export default { getAvailableMoves, playMove }
