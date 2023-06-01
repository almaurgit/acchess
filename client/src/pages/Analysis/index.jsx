import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Chessboard } from '../../components/Chessboard'
import { Pgn } from '../../components/Pgn'
import serverDomain from '../../utils/serverName'
import './style.css'

export function Analysis() {
  const moves = useRef([])
  const [currentMove, setCurrentMove] = useState(-1)
  const [lastMove, setLastMove] = useState({ from: -1, to: -1 })
  const [inCheck, setInCheck] = useState(false)
  const [loading, setLoading] = useState(true)
  const pgn = useRef([])
  const numberOfMoves = useRef(-1)
  const isPlayable = useRef(false)
  const dimension = useRef(8)
  const withId = useRef(false)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      withId.current = true
    }
    async function fetchGame() {
      if (withId) {
        const res = await fetch(
          serverDomain + '/play/analysis/' + id
        )
        const data = await res.json()
        if (data.status !== 200) throw new Error('failed to load game')
        moves.current = data.moves
        dimension.current = data.dimension
        numberOfMoves.current = data.moves.length
        pgn.current = data.pgn.split(' ')
        setCurrentMove(data.moves.length - 1)
        setLoading(false)
      }
    }
    fetchGame()
    document.addEventListener('keydown', handleKeypress)

    return () => {
      document.removeEventListener('keydown', handleKeypress)
    }
  }, [])

  useEffect(() => {
    if (currentMove === -1) return
    if (currentMove === numberOfMoves.current - 1) {
      isPlayable.current = true
    } else isPlayable.current = false
    setLastMove({
      from: moves.current[currentMove].from,
      to: moves.current[currentMove].to,
    })
    setInCheck(moves.current[currentMove].inCheck)
  }, [currentMove])

  function handleKeypress(e) {
    if (e.key === 'ArrowLeft') {
      setCurrentMove((currentMove) => {
        if (currentMove === 0) return currentMove
        return currentMove - 1
      })
    } else if (e.key === 'ArrowRight') {
      setCurrentMove((currentMove) => {
        if (currentMove === numberOfMoves.current - 1) return currentMove
        return currentMove + 1
      })
    }
  }
  return (
    <div className="analysis">
      {!loading && (
        <>
          <Chessboard
            id={id}
            dimensions={dimension.current}
            pieces={moves.current[currentMove].chessboard}
            setPieces={() => null}
            spectatorMode={true}
            colorToMove={['white', 'black'][currentMove % 2]}
            lastMove={lastMove}
            setLastMove={setLastMove}
            chessboardDirection="white"
            selfColor="white"
            inCheck={inCheck}
            analysis={true}
          />
          <Pgn
            pgn={pgn.current}
            currentMove={currentMove}
            setCurrentMove={setCurrentMove}
            numberOfMoves={numberOfMoves.current}
            scroll={true}
          />
        </>
      )}
    </div>
  )
}
