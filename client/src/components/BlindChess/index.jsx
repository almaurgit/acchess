import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { socket } from '../../App'
import './style.css'

export function BlindChess({
  id,
  colorToMove,
  selfColor,
  spectatorMode,
  pgn,
  numberOfMoves,
  players,
  setIncorrectMove,
  incorrectMove,
}) {
  const [waitingForOpponent, setWaitingForOpponent] = useState(false)
  const [move, setMove] = useState('')
  const lastMove = useRef('')
  const canSendMove = useRef(false)

  function sendMove(move) {
    setIncorrectMove(false)
    if (canSendMove.current)
      socket.emit('send_move', { id, from: -1, to: -1, blindMove: move })
  }

  function onChangeInputMove(e) {
    if (e.target.value.length >= 15) return
    setMove(e.target.value)
  }

  useEffect(() => {
    setMove('')
    if (colorToMove !== selfColor) {
      setWaitingForOpponent(true)
      canSendMove.current = false
    } else {
      setWaitingForOpponent(false)
      canSendMove.current = true
    }
    const splitPgn = pgn.trim().split(' ')
    if (splitPgn.length === 0) return
    const fmt = /^\d+\./
    let last = splitPgn.at(-1)
    last = last.replace(fmt, '')
    lastMove.current = last
  }, [pgn, numberOfMoves, colorToMove])

  return (
    <div className="blind-chess">
      <div className="last-move-info">
        <div className="move-number">
          {numberOfMoves &&
            (numberOfMoves % 2
              ? Math.floor(numberOfMoves / 2) + 1 + '.'
              : numberOfMoves / 2 + '...')}
        </div>
        <div className="last-move">{lastMove.current}</div>
      </div>
      {!spectatorMode && (
        <div className="player-field-blind">
          <input
            type="text"
            onChange={onChangeInputMove}
            value={move}
            disabled={!canSendMove.current}
            className="input blind"
          />
          <button onClick={() => sendMove(move)} className="main-button send">
            Send move for {selfColor}
          </button>
          {waitingForOpponent && (
            <div className="waiting-opponent-move">
              Waiting for opponent move
            </div>
          )}
          {incorrectMove && (
            <div className="incorrect-move">Incorrect move !</div>
          )}
        </div>
      )}
    </div>
  )
}
