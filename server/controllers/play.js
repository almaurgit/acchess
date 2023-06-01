import { Game } from '../app/Game.js'
import { games } from '../globals.js'
import { v4 as uuidv4 } from 'uuid'
import { Pawn } from '../app/pieces/Pawn.mjs'
import { Rook } from '../app/pieces/Rook.mjs'
import { Queen } from '../app/pieces/Queen.mjs'
import { Bishop } from '../app/pieces/Bishop.mjs'
import { Knight } from '../app/pieces/Knight.mjs'
import { King } from '../app/pieces/King.mjs'

function createAnalysisGame(pgn = '') {
  if (pgn !== '') {
    const id =
      Math.ceil(Math.random(0) * 0xffffff).toString(36) +
      Math.ceil(Date.now() * Math.random()).toString(36)
    let game = new Game(id, { analysis: true })
    games[id] = game

    try {
      game.importPgn(pgn)
    } catch (e) {}
    return id
  }
}

function createGame(req, res) {
  const id =
    Math.ceil(Math.random(0) * 0xffffff).toString(36) +
    Math.ceil(Date.now() * Math.random()).toString(36)
  let creatorColor = req.body.gameCreatorColor
  if (creatorColor === 'random') {
    if (Math.random() < 0.5) creatorColor = 'white'
    else creatorColor = 'black'
  }
  let game = new Game(id, req.body, creatorColor)
  games[id] = game
  game.status = 'waiting'
  const uuid = uuidv4()
  game.registeredPlayers[uuid] = creatorColor
  console.log('registered players :', uuid)
  game.numberOfPlayers++

  res
    .cookie('userId', uuid, {
      expires: new Date(Date.now() + 1440 * 60000),
      httpOnly: false,
    })
    .send({ id })
}

function joinGame(req, res) {
  const { id } = req.params
  const game = games[id]
  if (!game) {
    res.status(404)
    res.end()
    return
  }

  if (game.numberOfPlayers >= 2 || game.numberOfPlayers <= 0) {
    res.status(401)
    res.end()
    return
  }

  const { playerName } = req.body
  let playerColor = ''
  if (game.creatorColor === 'black') playerColor = 'white'
  else playerColor = 'black'
  game.players[playerColor] = playerName
  const uuid = uuidv4()
  game.registeredPlayers[uuid] = playerColor
  game.numberOfPlayers++

  console.log('join game', uuid)

  res.cookie('userId', uuid, {
    sameSite: 'none',
    secure: true,
  })
  res.status(200)
  res.json({ playerColor: playerColor })
}

function getChessboard(req, res) {
  const { id } = req.params

  if (!games[id]) {
    res.sendStatus(404)
    res.end()
    return
  }
  res.json(games[id].parsedChessboard())
}

function getGameSettings(req, res) {
  const { id } = req.params
  const game = games[id]
  if (!game) {
    res.sendStatus(404)
    res.end()
    return
  }
  const settings = game.getGameSettings()
  const { userId } = req.cookies
  console.log('get game settings', userId)
  let isPlayer = false
  let colorPlayer = null
  if (Object.keys(game.registeredPlayers).includes(userId)) {
    isPlayer = true
    colorPlayer = game.registeredPlayers[userId]
  }
  res.json({
    ...settings,
    isPlayer,
    numberOfPlayers: game.numberOfPlayers,
    colorPlayer,
    blindChess: game.blindChess,
  })
}

function getFullGame(req, res) {
  const { id } = req.params
  const game = games[id]
  if (!game) {
    res.sendStatus(404)
    res.end()
    return
  }

  const moves = game.getMoves()
  res.json({
    moves,
    dimension: game.dimensions,
    pgn: game.pgn,
    status: 200,
  })
}

function createCustomGame(req, res) {
  const { pieces, dimensions, colorToMove } = req.body
  let creatorColor = req.body.gameCreatorColor
  const id =
    Math.ceil(Math.random(0) * 0xffffff).toString(36) +
    Math.ceil(Date.now() * Math.random()).toString(36)
  if (creatorColor === 'random') {
    if (Math.random() < 0.5) creatorColor = 'white'
    else creatorColor = 'black'
  }
  if (typeof dimensions !== 'number' || dimensions < 4 || dimensions > 16) {
    res.status(401).end()
    return
  }
  const game = new Game(
    id,
    { ...req.body, dimensions, colorToMove, withNoPiece: true },
    creatorColor
  )
  const kings = Object.values(pieces).filter((piece) => {
    return piece.name === 'king'
  })
  if (!kings.length == 2) {
    res.status(401).end()
    return
  }
  const colors = [kings[0].color, kings[1].color]
  if (
    !['white', 'black'].includes(colors[0]) ||
    !['white', 'black'].includes(colors[1]) ||
    colors[0] === colors[1]
  ) {
    res.status(401).end()
    return
  }
  const newPieces = createPieces(pieces, game)
  if (newPieces === false) {
    res.status(401).end()
    return
  }
  game.addPieces(newPieces)

  if (game.isGameOver()) {
    res.status(401).end()
    return
  }

  games[id] = game
  game.status = 'waiting'
  const uuid = uuidv4()
  game.registeredPlayers[uuid] = creatorColor
  game.numberOfPlayers++
  res.cookie('userId', uuid, {
    sameSite: 'none',
    secure: true,
  })
  res.status(200).json({
    id,
  })
}

function createPieces(chessboard, game) {
  const pieces = []
  Object.entries(chessboard).forEach(([index, piece]) => {
    if (
      !['king', 'queen', 'pawn', 'knight', 'bishop', 'rook'].includes(
        piece.name
      )
    )
      return false
    if (!['white', 'black'].includes(piece.color)) return false
    if (Number(index) < 0 || Number(index >= game.dimension * game.dimension))
      return false
    pieces.push(newPiece(piece.name, piece.color, Number(index), game))
  })
  return pieces
}

function newPiece(name, color, index, game) {
  let piece
  switch (name) {
    case 'pawn':
      piece = new Pawn(game, null, color, index)
      break
    case 'rook':
      piece = new Rook(game, null, color, index)
      break
    case 'queen':
      piece = new Queen(game, null, color, index)
      break
    case 'bishop':
      piece = new Bishop(game, null, color, index)
      break
    case 'knight':
      piece = new Knight(game, null, color, index)
      break
    case 'king':
      piece = new King(game, null, color, index)
      break
    default:
      throw new Error('Impossible to create piece : wrong name')
  }
  return piece
}

const play = {
  createAnalysisGame,
  createGame,
  joinGame,
  getChessboard,
  getGameSettings,
  getFullGame,
  createCustomGame,
}
export default play
