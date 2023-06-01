import { Chessboard } from '../Chessboard/'
import { InfoGame } from '../InfoGame'
import { Timer } from '../Timer'
import { Pgn } from '../Pgn'
import { useState, useEffect, useMemo } from 'react'
import './style.css'
import { Piece } from '../../utils/PiecesSVG.jsx'
import { useFetch } from '../../utils/hooks'
import { socket } from '../../App.jsx'
import { useParams } from 'react-router-dom'
import { JoinGameModal } from '../JoinGameModal'
import { WaitingOpponent } from '../WaitingOpponent'
import { ResignButton } from '../ResignButton'
import { DrawOfferButton } from '../DrawOfferButton'
import { useRef } from 'react'
import { BlindChess } from '../BlindChess'
import serverDomain from '../../utils/serverName'

export function Game() {
  const [timer, setTimer] = useState({ white: 0, black: 0 })
  const [dimensions, setDimensions] = useState(8)
  const [players, setPlayers] = useState({ white: '', black: '' })
  const [creatorName, setCreatorName] = useState('')
  const [creatorColor, setCreatorColor] = useState('')
  const increment = useRef({
    white: { method: 'none', duration: 0 },
    black: { method: 'none', duration: 0 },
  })
  const timerIntervals = useRef({
    white: null,
    black: null,
  })
  const [pgn, setPgn] = useState('')
  const [waitingModal, setWaitingModal] = useState(false)
  const [joinModal, setJoinModal] = useState(false)
  const [spectatorMode, setSpectatorMode] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [chessboardDirection, setChessboardDirection] = useState('white')

  const [isPlaying, setIsPlaying] = useState(false)
  const [drawOffered, setDrawOffered] = useState(false)
  const [drawRequest, setDrawRequest] = useState('')

  const [lastMove, setLastMove] = useState({ from: -1, to: -1 })
  const numberOfMoves = useRef(0)
  const [pieces, setPieces] = useState({})
  const [colorToMove, setColorToMove] = useState('white')
  const [result, setResult] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [inCheck, setInCheck] = useState(false)
  const blindChess = useRef(false)
  const [incorrectMove, setIncorrectMove] = useState(false)

  const userColor = useRef('')

  const { id } = useParams()

  socket.on('start_game', () => {
    setWaitingModal(false)
    setJoinModal(false)
    history.go()
  })

  useEffect(() => {
    addEventListener('resize', handleResponsiveMode)
    function handleResponsiveMode(e) {
      setWindowWidth(e.currentTarget.innerWidth)
    }

    socket.emit('new_user', { gameId: id })
    async function getGameSettings() {
      const res = await fetch(serverDomain + '/play/gamesettings/' + id, {
        credentials: 'include',
      })
      const data = await res.json() // all infos about da game
      if (data.dimensions) setDimensions(data.dimensions)
      if (data.timer)
        setTimer({ white: data.timer.white, black: data.timer.black })
      if (data.increment) {
        increment.current.white = data.increment.white
        increment.current.black = data.increment.black
      }
      if (data.players)
        setPlayers({ white: data.players.white, black: data.players.black })
      if (data.creatorName) setCreatorName(data.creatorName)
      if (data.creatorColor) setCreatorColor(data.creatorColor)

      if (data?.numberOfPlayers === 1 && data.isPlayer) {
        setWaitingModal(true)
      } else if (data?.numberOfPlayers === 1 && !data.isPlayer) {
        setJoinModal(true)
      } else if (data.numberOfPlayers === 2 && data.isPlayer) {
        setSpectatorMode(false)
        setChessboardDirection(data.colorPlayer)
        userColor.current = data.colorPlayer
        numberOfMoves.current = data.numberOfMoves
      }
      if (data.blindChess) blindChess.current = true
      setLoadingSettings(false)
    }
    getGameSettings()

    socket.on('move_received', onMoveReceived)
    socket.on('resignation', onResignation)
    socket.on('draw_offered', onDrawOffer)
    socket.on('draw_offer_cancelled', drawRejected)
    socket.on('accept_draw', drawAccepted)
    socket.on('reject_draw', drawRejected)
    socket.on('timeout', onTimeout)
    socket.on('incorrect_move', onIncorrectMove)

    return () => {
      socket.off('move_received', onMoveReceived)
      socket.off('resignation', onResignation)
      socket.off('draw_offered', onDrawOffer)
      socket.off('draw_offer_cancelled', drawRejected)
      socket.off('accept_draw', drawAccepted)
      socket.off('reject_draw', drawRejected)
      socket.off('timeout', onTimeout)
      socket.off('incorrect_move', onIncorrectMove)
      removeEventListener('resize', handleResponsiveMode)
    }
  }, [])

  useEffect(() => {
    if (result) {
      clearInterval(timerIntervals.current['white'])
      clearInterval(timerIntervals.current['black'])
    }
  }, [result])

  function onIncorrectMove(data) {
    if (data.colorAtFault === userColor.current) setIncorrectMove(true)
  }

  function onTimeout({ winner, pgn, timer }) {
    setIsPlaying(false)
    setResult(winner)
    setSpectatorMode(true)
    setPgn(pgn)
    setTimer(timer)
  }

  function onDrawOffer(data) {
    const { color } = data
    setDrawOffered(true)
    if (color === userColor.current) setDrawRequest('emitter')
    else setDrawRequest('receiver')
  }

  function drawAccepted({ pgn }) {
    setIsPlaying(false)
    setResult('draw')
    setSpectatorMode(true)
    setPgn(pgn)
    setDrawOffered(false)
    setDrawRequest('')
  }

  function drawRejected() {
    setDrawOffered(false)
    setDrawRequest('')
  }

  function onResignation(data) {
    const { color, pgn } = data
    setIsPlaying(false)
    setResult(color)
    setSpectatorMode(true)
    setPgn(pgn)
  }
  function onMoveReceived(data) {
    const { from, to, pgn, status, result, inCheck } = data
    if (data.chessboard) setPieces(data.chessboard)
    setLastMove({ from, to })

    const otherColor = { white: 'black', black: 'white' }

    if (data.colorToMove) setColorToMove(data.colorToMove)
    if (data.timer)
      setTimer({ white: data.timer.white, black: data.timer.black })
    if (data.numberOfMoves >= 2) {
      let delay = 0
      if (timerIntervals.current[otherColor[data.colorToMove]] !== null) {
        clearInterval(timerIntervals.current[otherColor[data.colorToMove]])
      }
      if (increment.current[otherColor[data.colorToMove]].method === 'delay') {
        delay = increment.current[otherColor[data.colorToMove]].duration
      }
      const interval = setInterval(() => {
        if (delay > 0) delay -= 1
        else {
          setTimer((timer) => ({
            ...timer,
            [data.colorToMove]:
              timer[data.colorToMove] >= 0 ? timer[data.colorToMove] - 1 : 0,
          }))
        }
      }, 1000)
      timerIntervals.current[data.colorToMove] = interval
    }

    if (pgn) setPgn(pgn)
    if (status === 'playing') setIsPlaying(true)
    else setIsPlaying(false)
    if (status === 'over') {
      // stop timer
      setResult(data.result.winner || 'draw')
      setSpectatorMode(true)
    }
    setInCheck(inCheck)
    setIncorrectMove(false)
    numberOfMoves.current = data.numberOfMoves
  }

  const { loading, data, error } = useFetch(
    serverDomain + 'play/chessboard/' + id
  )

  useEffect(() => {
    if (data.chessboard) setPieces(data.chessboard)
    if (data.colorToMove) setColorToMove(data.colorToMove)
    if (data.timer)
      setTimer({ white: data.timer.white, black: data.timer.black })
    if (data.pgn) setPgn(data.pgn)
  }, [data])

  let displayInfo

  if (windowWidth <= 600) {
    displayInfo = (
      <div className="display-infos">
        <div
          className="timerMobile self"
          style={{ '--chessboardWidth': (window.innerWidth - 10) / 590 }}
        >
          <Timer
            timer={chessboardDirection === 'white' ? timer.white : timer.black}
          />
        </div>
        <div className="buttons-onplay-responsive">
          <ResignButton id={id} isPlaying={isPlaying} />
          <DrawOfferButton
            id={id}
            drawOffered={drawOffered}
            drawRequest={drawRequest}
            isPlaying={isPlaying}
            move={numberOfMoves.current}
          />
        </div>
        <Pgn pgn={pgn} />
      </div>
    )
  } else {
    displayInfo = (
      <InfoGame
        timer={timer}
        pgn={pgn}
        chessboardDirection={chessboardDirection}
        id={id}
        isPlaying={isPlaying}
        drawOffered={drawOffered}
        drawRequest={drawRequest}
        numberOfMoves={numberOfMoves.current}
      />
    )
  }

  return (
    <>
      <div className="game">
        {windowWidth <= 600 && (
          <div
            className="timerMobile opponent"
            style={{ '--chessboardWidth': (window.innerWidth - 10) / 590 }}
          >
            <Timer
              timer={
                chessboardDirection === 'white' ? timer.black : timer.white
              }
            />
          </div>
        )}
        {blindChess.current ? (
          <BlindChess
            id={id}
            colorToMove={colorToMove}
            selfColor={userColor.current}
            spectatorMode={spectatorMode}
            pgn={pgn}
            numberOfMoves={numberOfMoves.current}
            players={players}
            setIncorrectMove={setIncorrectMove}
            incorrectMove={incorrectMove}
          />
        ) : (
          <Chessboard
            id={id}
            className="chessboard"
            dimensions={dimensions}
            pieces={pieces}
            setPieces={setPieces}
            colorToMove={colorToMove}
            lastMove={lastMove}
            setLastMove={setLastMove}
            spectatorMode={spectatorMode}
            chessboardDirection={chessboardDirection}
            selfColor={userColor.current}
            isPlaying={isPlaying}
            inCheck={inCheck}
            players={players}
          />
        )}
        {displayInfo}
      </div>
      {!loadingSettings && waitingModal && (
        <WaitingOpponent
          players={players}
          dimensions={dimensions}
          blindChess={blindChess.current}
          timer={timer}
          increment={increment.current}
          creatorName={creatorName}
          creatorColor={creatorColor}
          id={id}
        />
      )}
      {!loadingSettings && joinModal && (
        <JoinGameModal
          players={players}
          dimensions={dimensions}
          blindChess={blindChess.current}
          timer={timer}
          increment={increment.current}
          creatorName={creatorName}
          creatorColor={creatorColor}
          id={id}
        />
      )}
    </>
  )
}
