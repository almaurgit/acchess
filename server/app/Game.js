import { Piece } from './pieces/Piece.mjs'
import { Rook } from './pieces/Rook.mjs'
import { Knight } from './pieces/Knight.mjs'
import { Bishop } from './pieces/Bishop.mjs'
import { Queen } from './pieces/Queen.mjs'
import { King } from './pieces/King.mjs'
import { Pawn } from './pieces/Pawn.mjs'
import { filterChessboard, findChessboard, sleep } from './functions.js'
import shortHash from 'short-hash'
import { io } from '../server.js'

export class Game {
  constructor(id, newGameParameters = {}, creatorColor) {
    const {
      dimensions = 8,
      numberOfMoves = 0,
      piecesOnBoard = null,
      withNoPiece = false,
      whiteTime = 180,
      blackTime = 180,
      whiteIncrement = 0,
      blackIncrement = 0,
      whiteTimingMethod = 'none',
      blackTimingMethod = 'none',
      colorToMove = 'white',
      gameCreatorName = '',
      gameCreatorColor = 'random',
      armageddon = false,
      pressClock = false,
      analysis = false,
      pgn = '',
      blindChess = false,
    } = newGameParameters
    this.id = id
    if (dimensions > 16 || dimensions < 4) {
      throw new Error('Wrong dimensions')
    }

    this.moves = []
    this.branchMoves = [] // for analysis

    this.dimensions = dimensions
    this.players = {
      white: null,
      black: null,
    }
    ;(this.creatorName = gameCreatorName), (this.creatorColor = creatorColor)

    this.numberOfPlayers = 0
    this.registeredPlayers = {}

    this.players[creatorColor] = gameCreatorName

    this.hashPosition = ''

    this.drawOfferedBy = null

    this.numberOfMoves = numberOfMoves
    this.capturedPieces = []
    this.pgn = pgn
    this.colorToMove = colorToMove
    this.lastCapture = null
    this.lastPawnMove = null
    this.numberOfEachPositions = {}
    this.nextColor = {
      white: 'black',
      black: 'white',
    }
    this.chessboard = new Array(this.dimensions)
      .fill(null)
      .map(() => new Array(this.dimensions).fill(null))

    this.timer = {
      white: whiteTime,
      black: blackTime,
    }
    this.clock = {
      white: 0,
      black: 0,
    }
    this.timerIntervals = {
      white: null,
      black: null,
    }

    this.increment = {
      white: { method: whiteTimingMethod, duration: whiteIncrement },
      black: { method: blackTimingMethod, duration: blackIncrement },
    }

    this.inCheck = false

    this.status = 'waiting'
    this.result = {
      method: '',
      winner: null,
      endedBy: '',
      result: '',
    }

    this.blindChess = blindChess
    this.armageddon = armageddon
    this.pressClock = pressClock

    this.pieceSymbols = ['R', 'N', 'B', 'Q', 'K']
    this.colLetters = new Array(dimensions)
      .fill(null)
      .map((_, i) => String.fromCharCode('a'.charCodeAt() + i))
    this.rowNumbers = new Array(dimensions)
      .fill(null)
      .map((_, i) => (i + 1).toString())

    if (!withNoPiece && piecesOnBoard === null && dimensions === 8) {
      this.piecesOnBoard = [
        new Rook(this, 'a1', 'white'),
        new Pawn(this, 'a2', 'white'),
        new Pawn(this, 'b2', 'white'),
        new Pawn(this, 'c2', 'white'),
        new Pawn(this, 'd2', 'white'),
        new Pawn(this, 'e2', 'white'),
        new Pawn(this, 'f2', 'white'),
        new Pawn(this, 'g2', 'white'),
        new Pawn(this, 'h2', 'white'),
        new Knight(this, 'b1', 'white'),
        new Bishop(this, 'c1', 'white'),
        new Queen(this, 'd1', 'white'),
        new King(this, 'e1', 'white'),
        new Bishop(this, 'f1', 'white'),
        new Knight(this, 'g1', 'white'),
        new Rook(this, 'h1', 'white'),
        new Pawn(this, 'a7', 'black'),
        new Pawn(this, 'b7', 'black'),
        new Pawn(this, 'c7', 'black'),
        new Pawn(this, 'd7', 'black'),
        new Pawn(this, 'e7', 'black'),
        new Pawn(this, 'f7', 'black'),
        new Pawn(this, 'g7', 'black'),
        new Pawn(this, 'h7', 'black'),
        new Rook(this, 'a8', 'black'),
        new Knight(this, 'b8', 'black'),
        new Bishop(this, 'c8', 'black'),
        new Queen(this, 'd8', 'black'),
        new King(this, 'e8', 'black'),
        new Bishop(this, 'f8', 'black'),
        new Knight(this, 'g8', 'black'),
        new Rook(this, 'h8', 'black'),
      ]
      this.addPieces(this.piecesOnBoard)
    }
  }

  addPiece(piece) {
    const positionInChessboard = this.parseSquareToBoard(piece.position)
    this.chessboard[positionInChessboard.row][positionInChessboard.col] = piece
  }

  addPieces(pieces) {
    pieces.forEach((piece) => this.addPiece(piece))
  }

  validColor(color) {
    return color === 'white' || color === 'black'
  }

  validCoordinate(coordinate) {
    if (typeof coordinate !== 'string') {
      throw new Error('The square is not in string format')
    }
    const squareRegex = /^[a-z]\d\d?$/
    if (!squareRegex.test(coordinate)) {
      throw new Error('The square is not in a good format (example : g2)')
    }
    if (!this.colLetters.includes(coordinate[0]))
      throw new Error('Invalid column')
    if (!this.rowNumbers.includes(coordinate.slice(1)))
      throw new Error('Invalid row')
    return true
  }

  parseSquareToBoard(square) {
    if (this.validCoordinate(square)) {
      const row = this.dimensions - parseInt(square.slice(1))
      const col = square[0].charCodeAt() % 'a'.charCodeAt()

      return { row, col }
    }
  }

  positionToSquare(row, col) {
    return this.colLetters[col] + this.rowNumbers[this.dimensions - 1 - row]
  }

  getSquare(coordinate) {
    const { row, col } = this.parseSquareToBoard(coordinate)
    return this.chessboard[row][col]
  }

  getSquareWithIndex(index) {
    return this.chessboard[Math.floor(index / this.dimensions)][
      index % this.dimensions
    ]
  }

  setSquare(coordinate, piece) {
    const { row, col } = this.parseSquareToBoard(coordinate)
    this.chessboard[row][col] = piece
  }

  addHashPosition() {
    let longHash = ''
    this.chessboard.flat().forEach((square, i) => {
      if (square instanceof Piece) longHash += square.symbol
      longHash += i + '-'
    })
    longHash += this.colorToMove
    const hash = shortHash(longHash)
    if (this.numberOfEachPositions[hash] === undefined)
      this.numberOfEachPositions[hash] = 1
    else this.numberOfEachPositions[hash] += 1
    this.hashPosition = hash
  }

  /**
   * A move must be :
   * Either just a square => it means it's a pawn move,
   * A letter from a to h followed by an 'x' then a square => a pawn capture,
   * A letter amongst [R, N, B, Q, K] followed by a square => a piece move,
   * A letter amongst [R, N, B, Q, K] followed by an 'x' then a square => a piece capture,
   * A letter amongst [R, N, B, Q, K] followed by (a letter from a to the size of the board || a number from 1 to the size of the board)
   *   then an 'x' then a square => a piece capture with ambiguity,
   * Like above but with the exact square of the piece to move if still ambiguous (three queens for example)
   * O-O or O-O-O in pgn notation, with 0 with FIDE notation, for short and long castle
   * A pawn move is followed by '=X' with X being the symbol of the piece to promote to.
   * All moves can be followed by '?' if inaccuracy/suspicious move, '??' for a blunder,
   *   '!' for a good move, '!!' for an impressive move, '+' for checks, '#' for checkmate
   */
  parseMove(move) {
    if (typeof move !== 'string') {
      throw new Error("The move isn't valid (not a string)")
    }
    if (move.length < 2) throw new Error('Move invalid (not enough characters')

    if (move.endsWith('?!') || move.endsWith('??') || move.endsWith('!!'))
      move = move.slice(0, -2)
    if (
      move.endsWith('+') ||
      move.endsWith('#') ||
      move.endsWith('?') ||
      move.endsWith('!')
    )
      move = move.slice(0, -1)

    let promotion = null
    if (move.includes('=')) {
      let [moveCopy, promotionCopy, ...rest] = move.split('=')
      if (rest[0])
        throw new Error("One '=' allowed in the move if it is a promotion")
      move = moveCopy
      promotion = promotionCopy
      if (!['Q', 'R', 'B', 'N'].includes(promotion))
        throw new Error('Wrong promotion : only Q, B, R, or N')
    }

    if (!move.includes('x')) {
      // Not a capture
      //Pawn move
      if (move.length === 2 && this.validCoordinate(move)) {
        for (let piece of filterChessboard(
          this.chessboard,
          (piece) => piece?.color === this.colorToMove
        )) {
          if (piece instanceof Pawn && piece.canMove(move)) {
            let promotionPiece = null
            if (promotion) {
              if (
                !(piece.color === 'white' && piece.row === 1) &&
                !(piece.color === 'black' && piece.row === this.dimensions - 2)
              )
                throw new Error('You cannot promote !')
              else promotionPiece = this.createPromotionPiece(promotion, move)
            } else if (
              (piece.color === 'white' && piece.row === 1) ||
              (piece.color === 'black' && piece.row === this.dimensions - 2)
            )
              throw new Error('You NEED to promote !')
            return {
              piece,
              square: move,
              capture: false,
              option: { promotion, promotionPiece },
            }
          }
        }
      } else if (move === 'O-O' || move === 'O-O-O') {
        //castling
        let king = findChessboard(
          this.chessboard,
          (piece) => piece instanceof King && piece?.color === this.colorToMove
        )
        let square =
          this.colLetters[move === 'O-O' ? king.col + 2 : king.col - 2] +
          this.rowNumbers[this.dimensions - 1 - king.row]
        let castle = move === 'O-O' ? 'short' : 'long'
        if (king.canMove(square))
          return { piece: king, square, capture: false, option: { castle } }
        else throw new Error('Impossible to castle, sorry about that')
      }
      //Piece move
      else if (move.length >= 3 && move.length <= 5) {
        const pieceString = move.slice(0, -2)
        const squareToMove = move.slice(-2)

        if (!this.validCoordinate(squareToMove))
          throw new Error('Wrong coordinates to move to')

        const pieceToMove = this.identifyPiece(pieceString, squareToMove, false)
        if (!pieceToMove)
          throw new Error('Error in the move (wrong syntax, or amiguity)')

        return { piece: pieceToMove, square: squareToMove, capture: false }
      }
    } else if (move.includes('x')) {
      // A capture
      const [pieceString, squareToMove, ...rest] = move.split('x')
      if (rest[0]) throw new Error('Move error : one capture allowed')

      //pawn
      if (
        pieceString.length === 1 &&
        this.colLetters.includes(pieceString) &&
        this.validCoordinate(squareToMove)
      ) {
        const filteredChessboard = filterChessboard(
          this.chessboard,
          (piece) => piece?.color === this.colorToMove
        )
        for (let piece of filteredChessboard) {
          if (
            piece instanceof Pawn &&
            piece.position[0] === pieceString &&
            piece.canCapture(squareToMove)
          ) {
            let promotionPiece = null
            if (promotion) {
              if (
                !(piece.color === 'white' && piece.row === 1) &&
                !(piece.color === 'black' && piece.row === this.dimensions - 2)
              )
                throw new Error(
                  'You cannot promote ! ' + piece.color + piece.row
                )
              else
                promotionPiece = this.createPromotionPiece(
                  promotion,
                  squareToMove
                )
            } else if (
              (piece.color === 'white' && piece.row === 1) ||
              (piece.color === 'black' && piece.row === this.dimensions - 2)
            )
              throw new Error('You need to promote !')

            return {
              piece,
              square: squareToMove,
              capture: true,
              option: { promotion, promotionPiece },
            }
          }
        }
      }

      //piece
      const pieceToMove = this.identifyPiece(pieceString, squareToMove, true)
      if (!pieceToMove)
        throw new Error('Error in the move (wrong syntax, or amiguity')

      return { piece: pieceToMove, square: squareToMove, capture: true }
    }
    return { piece: null, square: null, capture: null }
  }

  identifyPiece(pieceString, squareToMove, capture) {
    const pieceSymbol = pieceString[0]
    const pieceDisambiguation = pieceString.slice(1)
    if (pieceDisambiguation.length === 1) {
      if (
        !this.rowNumbers.includes(pieceDisambiguation) &&
        !this.colLetters.includes(pieceDisambiguation)
      )
        throw new Error(
          'Amibiguity not handled',
          pieceDisambiguation,
          pieceString,
          squareToMove
        )
    } else if (
      pieceDisambiguation >= 1 &&
      !this.validCoordinate(pieceDisambiguation)
    ) {
      throw new Error(
        'Amibiguity not handled',
        pieceDisambiguation,
        pieceString,
        squareToMove
      )
    }
    if (this.pieceSymbols.includes(pieceSymbol)) {
      const involvedPieces = filterChessboard(this.chessboard, (piece) => {
        return (
          piece instanceof Piece &&
          piece.symbol === pieceSymbol &&
          this.colorToMove === piece.color &&
          piece.position.includes(pieceDisambiguation)
        )
      })
      let numberOfPiecesThatCanMakeThatMove = 0
      let pieceToMove = null
      for (let piece of involvedPieces) {
        if (
          capture ? piece.canCapture(squareToMove) : piece.canMove(squareToMove)
        ) {
          numberOfPiecesThatCanMakeThatMove++
          pieceToMove = piece
        }
      }
      if (numberOfPiecesThatCanMakeThatMove > 1)
        throw new Error('Ambiguity regarding the piece to move')
      return pieceToMove
    }
    return null
  }

  playMove(
    startIndex = -1,
    endIndex = -1,
    promotionSymbol = null,
    moveToParse = null
  ) {
    let piece, row, col, position, capture, option, startRow, startCol
    option = {}
    if (this.numberOfMoves === 0) this.addMove(-1, -1)
    if (moveToParse) {
      const parsedMove = this.parseMove(moveToParse)
      piece = parsedMove.piece
      capture = parsedMove.capture
      option = parsedMove.option || option
      position = parsedMove.square
      startRow = piece.row
      startCol = piece.col
      let parsedSquare = this.parseSquareToBoard(position)
      row = parsedSquare.row
      col = parsedSquare.col
      piece.makeMove(position, row, col, capture, option)
    } else {
      piece = this.getSquareWithIndex(startIndex)
      startRow = piece.row
      startCol = piece.col
      row = Math.floor(endIndex / this.dimensions)
      col = endIndex % this.dimensions

      capture = false
      if (this.chessboard[row][col] instanceof Piece) capture = true
      position = this.positionToSquare(row, col)
      if (capture) {
        if (!piece.canCapture(position)) throw new Error('Illegal move')
      } else if (
        !piece.canMove(position) &&
        !(piece instanceof Pawn && piece.canCapture(position))
      ) {
        throw new Error('Illegal move')
      }
      if (piece instanceof King) {
        if (startIndex - endIndex === -2) option.castle = 'short'
        else if (startIndex - endIndex === 2) option.castle = 'long'
      }
      if (
        (piece instanceof Pawn && row === 0) ||
        (piece instanceof Pawn && row === this.dimensions - 1)
      ) {
        let promotionPiece = this.createPromotionPiece(
          promotionSymbol || 'Q',
          position
        )
        option.promotion = promotionSymbol || 'Q'
        option.promotionPiece = promotionPiece
      }
      piece.makeMove(position, row, col, capture, option)
    }
    const king = findChessboard(
      this.chessboard,
      (piece) => piece?.symbol === 'K' && piece?.color === this.colorToMove
    )
    if (king.isInCheck()) this.inCheck = true
    else this.inCheck = false
    this.addHashPosition()
    if (this.isGameOver()) {
      clearInterval(this.timerIntervals.white)
      clearInterval(this.timerIntervals.black)
    } // check if the game is over yet
    this.addMovePgn(
      piece.symbol,
      piece.color,
      startRow,
      startCol,
      position,
      row,
      col,
      capture,
      option
    )
    this.addMove(
      startRow * this.dimensions + startCol,
      row * this.dimensions + col
    )
  }

  addMovePgn(
    symbol,
    color,
    startRow,
    startCol,
    position,
    endRow,
    endCol,
    capture,
    option
  ) {
    let move = ''
    if (this.numberOfMoves % 2) move += (this.numberOfMoves + 1) / 2 + '.'
    if (option.castle === 'short') {
      move += 'O-O '
      this.pgn += move
      return
    }
    if (option.castle === 'long') {
      move += 'O-O-O '
      this.pgn += move
      return
    }
    if (symbol === 'P') {
      if (endCol !== startCol) {
        move += this.colLetters[startCol]
        capture = true
      }
    } else move += symbol
    let piecesAmbiguity = this.chessboard.flat().filter((p) => {
      if (!(p instanceof Piece) || p instanceof Pawn) return false
      if (p.symbol !== symbol || p.color !== color) return false
      if (p.canAccess(endRow, endCol)) {
        return true
      }
    })
    if (piecesAmbiguity.length >= 1) {
      if (piecesAmbiguity.every((p) => p.col !== startCol))
        move += this.colLetters[startCol]
      else if (piecesAmbiguity.every((p) => p.row !== startRow))
        move += this.rowNumbers[this.dimensions - 1 - startRow]
      else {
        move += this.colLetters[startCol]
        move += this.rowNumbers[this.dimensions - 1 - startRow]
      }
    }
    if (capture) move += 'x'
    move += position
    if (option.promotion) {
      move += '=' + option.promotionPiece.symbol
    }
    if (this.inCheck) {
      if (this.result.method === 'mate') move += '#'
      else move += '+'
    }
    move += ' '

    if (this.status === 'over') {
      move += this.result.result
    }
    this.pgn += move
  }

  addMove(from, to) {
    const parsedChessboard = {}
    this.chessboard.forEach((row, i) => {
      row.forEach((piece, j) => {
        if (piece instanceof Piece) {
          parsedChessboard[i * this.dimensions + j] = {
            name: piece.name,
            color: piece.color,
          }
        }
      })
    })
    this.moves.push({
      chessboard: parsedChessboard,
      from,
      to,
      inCheck: this.inCheck,
    })
  }

  updateTimer(id) {
    if (this.numberOfMoves < 2) return
    const otherColor = { white: 'black', black: 'white' }
    if (this.timerIntervals[otherColor[this.colorToMove]] !== null)
      clearInterval(this.timerIntervals[otherColor[this.colorToMove]])
    if (
      this.numberOfMoves > 2 &&
      this.increment[otherColor[this.colorToMove]].method === 'increment'
    ) {
      this.timer[otherColor[this.colorToMove]] +=
        this.increment[otherColor[this.colorToMove]].duration
    }
    let delay = 0
    if (this.increment[otherColor[this.colorToMove]].method === 'delay') {
      delay = this.increment[otherColor[this.colorToMove]].duration
    }

    this.timerIntervals[this.colorToMove] = setInterval(() => {
      if (delay >= 0) delay -= 1
      if (delay <= 0) this.timer[this.colorToMove] -= 1
      if (this.timer[this.colorToMove] < 1) {
        this.endByTimeout()
        io.to(id).emit('timeout', {
          winner: this.colorToMove === 'white' ? 'black' : 'white',
          pgn: this.pgn,
          timer: this.timer,
        })
        clearInterval(this.timerIntervals[otherColor[this.colorToMove]])
        clearInterval(this.timerIntervals[this.colorToMove])
        return true
      }
    }, 1000)
    return false
  }

  createPromotionPiece(promotion, position) {
    switch (promotion) {
      case 'Q':
        let queen = new Queen(this, position)
        return queen
        break
      case 'R':
        let rook = new Rook(this, position)
        return rook
        break
      case 'B':
        let bishop = new Bishop(this, position)
        return bishop
        break
      case 'N':
        let knight = new Knight(this, position)
        return knight
        break
      default:
        return null
    }
    return null
  }

  isResult(str) {
    if (str === '1-0') {
      this.endByResignation('black')
      return true
    } else if (str === '0-1') {
      this.endByResignation('white')
      return true
    } else if (str === '1/2-1/2') {
      this.drawAgreement()
      return true
    }
    return false
  }

  importPgn(pgn) {
    pgn = pgn.trim().replaceAll('.', '. ').split(/\s+/)
    let movenumber = 0
    for (let i = 0; i < pgn.length; i += 3) {
      if (!pgn[i]) {
        this.drawAgreement()
        return
      }

      if (this.isResult(pgn[i])) return
      let tmp = this.#parseMoveNumber(pgn[i])
      if (movenumber + 1 !== tmp) throw new Error('Wrong move number at ' + tmp)
      movenumber = tmp
      if (!pgn[i + 1]) {
        this.drawAgreement()
        return
      }
      if (this.isResult(pgn[i + 1])) return
      this.playMove(-1, -1, null, pgn[i + 1])
      if (!pgn[i + 2]) {
        this.drawAgreement()
        return
      }
      if (this.isResult(pgn[i + 2])) return

      if (this.status === 'over') return
      if (!pgn[i + 2]) {
        this.drawAgreement()
        return
      }
      this.playMove(-1, -1, null, pgn[i + 2])
      if (this.status === 'over') return
    }
    this.drawAgreement()
  }

  parsePgn(pgn) {
    const moveNumberReg = /\d+\./
    const moveReg = / /
    const result = ['1/2-1/2', '1-0', '0-1']
  }

  #parseMoveNumber(str) {
    const fmt = /^\d+\./
    if (!fmt.test(str)) throw new Error('invalid pgn format: ' + str)
    return parseInt(str)
  }

  endByResignation(color) {
    this.status = 'over'
    this.result = {
      method: 'resignation',
      winner: color === 'white' ? 'black' : 'white',
      result: color === 'white' ? '0-1' : '1-0',
      endedBy: 'win',
    }
    this.pgn += ' ' + this.result.result
    clearInterval(this.timerIntervals.white)
    clearInterval(this.timerIntervals.black)
  }

  endByTimeout(color) {
    this.status = 'over'
    this.result = {
      method: 'clock',
      winner: color === 'white' ? 'black' : 'white',
      result: color === 'white' ? '0-1' : '1-0',
      endedBy: 'win',
    }
    this.pgn += ' ' + this.result.result
    clearInterval(this.timerIntervals.white)
    clearInterval(this.timerIntervals.black)
  }

  drawAgreement() {
    this.status = 'over'
    this.result = {
      method: 'agreement',
      winner: null,
      result: '1/2-1/2',
      endedBy: 'draw',
    }
    this.pgn += ' ' + this.result.result
    clearInterval(this.timerIntervals.white)
    clearInterval(this.timerIntervals.black)
  }

  isGameOver() {
    let res = this.isMate()
    if (res) {
      this.status = 'over'
      this.result = {
        method: 'mate',
        winner: this.colorToMove === 'black' ? 'white' : 'black',
        endedBy: 'win',
        result: this.colorToMove === 'black' ? '1-0' : '0-1',
      }
      return true
    }
    if (this.isStaleMate()) {
      this.status = 'over'
      this.result = {
        method: 'stalemate',
        winner: null,
        result: '1/2-1/2',
        endedBy: 'draw',
      }
      return true
    }
    if (this.fiftyMovesRule()) {
      this.status = 'over'
      this.result = {
        method: 'fiftymoves',
        winner: null,
        result: '1/2-1/2',
        endedBy: 'draw',
      }
      return true
    }
    if (this.repetitionRule()) {
      this.status = 'over'
      this.result = {
        method: 'repetition',
        winner: null,
        result: '1/2-1/2',
        endedBy: 'draw',
      }
      return true
    }

    return false
  }

  isMate() {
    const king = findChessboard(
      this.chessboard,
      (piece) => piece?.symbol === 'K' && piece?.color === this.colorToMove
    )

    if (!king.isInCheck()) return false
    if (king.accessibleSquares().length >= 1) return false

    let piecesThisColor = this.chessboard
      .flat()
      .filter((piece) => piece?.color === this.colorToMove)
    for (let piece of piecesThisColor) {
      if (piece.accessibleSquares().length >= 1) {
        return false
      }
    }

    return true
  }

  isStaleMate() {
    let piecesThisColor = this.chessboard
      .flat()
      .filter((piece) => piece?.color === this.colorToMove)
    for (let piece of piecesThisColor) {
      if (piece.accessibleSquares().length >= 1) return false
    }
    return true
  }

  fiftyMovesRule(number = 50) {
    if (
      this.lastPawnMove + number * 2 <= this.numberOfMoves &&
      this.lastCapture + number * 2 <= this.numberOfMoves
    )
      return true

    return false
  }

  repetitionRule() {
    if (this.numberOfEachPositions[this.hashPosition] >= 3) return true
  }

  getGameSettings() {
    return {
      id: this.id,
      creatorName: this.creatorName,
      creatorColor: this.creatorColor,
      players: this.players,
      timer: this.timer,
      increment: this.increment,
      dimensions: this.dimensions,
      pgn: this.pgn,
      armageddon: this.armageddon,
      pressClock: this.pressClock,
    }
  }

  parsedChessboard() {
    const parsedChessboard = {}
    this.chessboard.forEach((row, i) => {
      row.forEach((piece, j) => {
        if (piece instanceof Piece) {
          parsedChessboard[i * this.dimensions + j] = {
            name: piece.name,
            color: piece.color,
          }
        }
      })
    })
    return {
      chessboard: parsedChessboard,
      numberOfMoves: this.numberOfMoves,
      colorToMove: this.colorToMove,
      timer: this.timer,
      pgn: this.pgn,
    }
  }

  getMoves() {
    return this.moves
  }
}
