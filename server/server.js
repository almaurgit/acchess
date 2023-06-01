import http from 'http'
import app from './app.js'
import { Server } from 'socket.io'
import { games } from './globals.js'
import socketIoCookieParser from 'socket.io-cookie-parser'
import play from './controllers/play.js'
import dotenv from 'dotenv'
dotenv.config()

const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: 'https://acchess.org',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.use(socketIoCookieParser())

io.on('connection', (socket) => {
  socket.on('send_move_solo', (data) => {
    const { id, from, to, namePromotion } = data
    const game = games[id]
    if (!game || game.status !== 'playing') return
    if (game.registeredPlayer !== socket.request.cookies['userId']) return
    try {
      game.playMove(from, to, namePromotion)
    } catch (e) {
      console.log(e)
    }
    io.to(id).emit('move_received', {
      ...game.parsedChessboard(),
      from,
      to,
      status: game.status,
      result: game.result,
      pgn: game.pgn,
      inCheck: game.inCheck,
    })
  })

  socket.on('new_user', (data) => {
    const { gameId } = data
    console.log('new user', gameId)
    const game = games[gameId]
    if (!game) return
    socket.join(gameId)

    if (game.numberOfPlayers === 2 && game.status === 'waiting') {
      game.status = 'playing'
      socket.to(gameId).emit('start_game')
    }
  })

  socket.on('send_move', (data) => {
    const { id, from, to, namePromotion, blindMove } = data
    const game = games[id]
    if (!game || game.status !== 'playing') return
    if (
      !Object.keys(game.registeredPlayers).includes(
        socket.request.cookies['userId']
      )
    )
      return
    if (
      game.colorToMove !==
      game.registeredPlayers[socket.request.cookies['userId']]
    )
      return
    try {
      game.playMove(from, to, namePromotion, blindMove)
      game.updateTimer(id)
    } catch (e) {
      if (blindMove) {
        io.to(id).emit('incorrect_move', { colorAtFault: game.colorToMove })
        return
      }
      console.log(e)
    }

    io.to(id).emit('move_received', {
      ...game.parsedChessboard(),
      from,
      to,
      status: game.status,
      result: game.result,
      pgn: game.pgn,
      inCheck: game.inCheck,
    })
    if (game.drawOfferedBy) io.to(id).emit('reject_draw')
  })

  socket.on('draw_offer', ({ id }) => {
    const userId = socket.request.cookies['userId']
    const game = games[id]
    if (!game) return
    if (!Object.keys(game.registeredPlayers).includes(userId)) return

    const color = game.registeredPlayers[userId]
    game.drawOfferedBy = color

    io.to(id).emit('draw_offered', { color })
  })

  socket.on('cancel_draw_offer', ({ id }) => {
    const userId = socket.request.cookies['userId']
    const game = games[id]
    if (!game) return
    if (!Object.keys(game.registeredPlayers).includes(userId)) return

    if (game.registeredPlayers[userId] === game.drawOfferedBy) {
      io.to(id).emit('draw_offer_cancelled')
      game.drawOfferedBy = null
    }
    return
  })

  socket.on('response_draw_offer', ({ id, response }) => {
    const userId = socket.request.cookies['userId']
    const game = games[id]
    if (!game) return
    if (!Object.keys(game.registeredPlayers).includes(userId)) return

    if (game.registeredPlayers[userId] === game.drawOfferedBy) return
    if (response === 'accept') {
      game.drawAgreement()
      io.to(id).emit('accept_draw', { pgn: game.pgn })
    } else if (response === 'reject') {
      game.drawOfferedBy = null
      io.to(id).emit('reject_draw')
    }
  })

  socket.on('resign', ({ id }) => {
    const userId = socket.request.cookies['userId']
    const game = games[id]
    if (!game) return
    if (!Object.keys(game.registeredPlayers).includes(userId)) return

    game.endByResignation(game.registeredPlayers[userId])
    io.to(id).emit('resignation', {
      color: game.registeredPlayers[userId],
      pgn: game.pgn,
    })
  })

  socket.on('import-pgn', ({ pgn }) => {
    const id = play.createAnalysisGame(pgn)
    socket.emit('analyse-pgn', { id })
  })
})

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
})

server.listen(port)
