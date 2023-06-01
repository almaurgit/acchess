import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react'
import { Piece } from '../../utils/PiecesSVG'
import { Square } from '../Square'
import { useFetch } from '../../utils/hooks'
import { socket } from '../../App'
import { PromoteSelection } from '../PromoteSelection'
import serverDomain from '../../utils/serverName'

export function Chessboard({
  id,
  dimensions,
  pieces,
  setPieces,
  colorToMove,
  lastMove,
  setLastMove,
  spectatorMode,
  chessboardDirection,
  selfColor,
  inCheck,
  players,
}) {
  const [width, setWidth] = useState(500)
  const [pieceMoving, setPieceMoving] = useState({
    x: null,
    y: null,
  })
  const [pieceDragged, setPieceDragged] = useState(-1)
  const [selectedPiece, setSelectedPiece] = useState(-1)
  const [hoverredIndex, setHoverredIndex] = useState(-1)
  const [availableSquares, setAvailableSquares] = useState([])
  const [availableSquaresCapture, setAvailableSquaresCapture] = useState([])
  const updatedAvailableSquares = useRef([])
  const [displayPromoteSelection, setDisplayPromoteSelection] = useState({
    display: false,
    idx: null,
    from: null,
  })

  const chessboard = new Array(dimensions * dimensions).fill(null)

  function sendMove(id, from, to) {
    if (selfColor !== colorToMove) return
    if (
      pieces[from].name === 'pawn' &&
      (to < dimensions || to >= dimensions * (dimensions - 1))
    ) {
      setDisplayPromoteSelection({ display: true, from, idx: to })
    } else {
      sendMoveServer(id, from, to)
    }
  }

  function sendMoveServer(id, from, to, namePromotion = null) {
    setDisplayPromoteSelection({
      display: false,
      from: null,
      idx: null,
    })
    socket.emit('send_move', { id, from, to, namePromotion })
    setLastMove({ from, to })
    const newPieces = { ...pieces }
    const piece = pieces[from]
    delete newPieces[from]
    setPieces({
      ...newPieces,
      [to]: piece,
    })
  }

  const promote = (name) => {
    const { from, idx, display } = displayPromoteSelection
    if (!display) {
      return
    }
    sendMoveServer(id, from, idx, name)
  }

  useEffect(() => {
    if (window.innerWidth < width + 226 && window.innerWidth > 600)
      setWidth(window.innerWidth - 226)
    else if (window.innerWidth <= 600) setWidth(window.innerWidth - 10)
  }, [])

  const startGrowingChessboard = (e) => {
    e.preventDefault()
    const cornerChessboardPosition = { x: e.pageX, y: e.pageY }

    const currentWidth = width

    const handleGrowChessboard = (e) => {
      const offsetY = e.pageY - cornerChessboardPosition.y
      const newWidth = Math.min(
        currentWidth + offsetY * 2,
        document.querySelector('.container').clientHeight,
        document.querySelector('.container').clientWidth - 226
      )
      if (newWidth <= 100) return
      setWidth(newWidth)
    }

    const stopGrowingChessboard = (e) => {
      document.body.removeEventListener('mousemove', handleGrowChessboard)
    }

    document.body.addEventListener('mousemove', handleGrowChessboard)
    document.body.addEventListener('mouseup', stopGrowingChessboard, {
      once: true,
    })
  }

  useEffect(() => {
    ;(async function () {
      if (selectedPiece < 0 && pieceDragged < 0) {
        setAvailableSquares([])
        return
      }
      try {
        let availableSquaresForPieceIndex =
          pieceDragged >= 0 ? pieceDragged : selectedPiece
        const data = await fetch(
          `${serverDomain}/moves/${id}/${availableSquaresForPieceIndex}`,
          { credentials: 'include' }
        )
        const dataJson = await data.json()
        const { dataAvailableSquares } = dataJson

        updatedAvailableSquares.current = Object.keys(dataAvailableSquares).map(
          (idx) => Number(idx)
        )

        setAvailableSquares(
          Object.keys(dataAvailableSquares).map((idx) => Number(idx))
        )
        setAvailableSquaresCapture(
          Object.entries(dataAvailableSquares)
            .filter(([idx, capture]) => capture)
            .map(([idx, capture]) => Number(idx))
        )
      } catch (e) {}
    })()
  }, [selectedPiece, pieceDragged])

  useEffect(() => {
    // hover squares when dragging a piece
    if (pieceDragged < 0) {
      setHoverredIndex(-1)
    } else {
      const squareSize = width / dimensions
      let indexToHover =
        dimensions * Math.floor(pieceMoving.y / squareSize) +
        Math.floor(pieceMoving.x / squareSize)
      if (chessboardDirection === 'black')
        indexToHover = dimensions * dimensions - indexToHover - 1
      setHoverredIndex(indexToHover)
    }
  }, [pieceMoving])

  async function moveSelectedPiece(e) {
    const rect = document.querySelector('.chessboard').getBoundingClientRect()
    const squareSize = width / dimensions
    let indexSelected =
      dimensions * Math.floor((e.pageY - rect.top) / squareSize) +
      Math.floor((e.pageX - rect.left) / squareSize)
    if (chessboardDirection === 'black')
      indexSelected = dimensions * dimensions - 1 - indexSelected
    if (
      !(
        e.pageX > rect.left &&
        e.pageX < rect.right &&
        e.pageY > rect.top &&
        e.pageY < rect.bottom
      )
    ) {
      if (selectedPiece < 0) {
        return
      } else {
        setSelectedPiece(() => {
          return -1
        })
        return
      }
    }

    if (selectedPiece < 0 && !!pieces[indexSelected]) {
      setSelectedPiece(() => {
        return indexSelected
      })
    } else {
      if (!updatedAvailableSquares.current.includes(indexSelected)) {
        setSelectedPiece(() => {
          return -1
        })
        setPieceDragged(() => {
          return -1
        })
        updatedAvailableSquares.current = []
        return
      }

      try {
        if (selectedPiece !== indexSelected) {
          sendMove(id, selectedPiece, indexSelected)
        }
        setSelectedPiece(() => {
          return -1
        })
      } catch (e) {}
    }
  }

  const startMovingPiece = (e, idx) => {
    e.preventDefault()
    if (spectatorMode) return
    if (!pieces[idx] && !selectedPiece) return
    if (
      pieces[idx] &&
      pieces[idx].color !== selfColor &&
      !availableSquaresCapture.includes(idx)
    )
      return

    const rect = document.querySelector('.chessboard').getBoundingClientRect()
    let x = e.pageX - rect.left
    let y = e.pageY - rect.top

    setPieceMoving((pieceMoving) => {
      return { x, y }
    })
    if (
      pieces[idx] &&
      pieces[idx].color === selfColor &&
      (selectedPiece < 0 ||
        (selectedPiece >= 0 &&
          pieces[selectedPiece].color === pieces[idx].color))
    ) {
      setPieceDragged(() => {
        return idx
      })
    }

    function handleMovingPiece(e) {
      if (selectedPiece >= 0)
        setSelectedPiece(() => {
          return -1
        })
      x = e.pageX - rect.left
      y = e.pageY - rect.top
      setPieceMoving((pieceMoving) => {
        return { x, y }
      })
    }
    async function stopMovingPiece(e) {
      document.body.removeEventListener('mousemove', handleMovingPiece)

      const squareSize = width / dimensions
      let endIndex =
        dimensions * Math.floor((e.pageY - rect.top) / squareSize) +
        Math.floor((e.pageX - rect.left) / squareSize)
      if (chessboardDirection === 'black')
        endIndex = dimensions * dimensions - 1 - endIndex

      // drag une pièce après en avoir sélectionné une (une autre ou la même)
      if (selectedPiece >= 0 && pieceDragged >= 0) {
        setSelectedPiece(() => {
          return -1
        })
      }

      // un clic
      if (idx === endIndex) {
        setPieceDragged(() => {
          return -1
        })
        moveSelectedPiece(e)
        return
      }
      if (!updatedAvailableSquares.current.includes(endIndex)) {
        setSelectedPiece(() => {
          return -1
        })
        setPieceDragged(() => {
          return -1
        })
        updatedAvailableSquares.current = []

        return
      }

      setPieceMoving(() => {
        return { x: null, y: null }
      })
      setPieceDragged(() => {
        return -1
      })

      if (
        !(
          e.pageX > rect.left &&
          e.pageX < rect.right &&
          e.pageY > rect.top &&
          e.pageY < rect.bottom
        )
      ) {
        return
      }
      try {
        sendMove(id, idx, endIndex)
      } catch (e) {}
    }
    document.addEventListener('mouseup', stopMovingPiece, { once: true })
    document.body.addEventListener('mousemove', handleMovingPiece)
  }

  addEventListener('resize', (event) => {
    const windowWidth = event.currentTarget.innerWidth
    if (windowWidth > 600) {
      if (windowWidth < width + 226) {
        setWidth((width) => Math.min(windowWidth - 226, width))
      }
    } else {
      setWidth(windowWidth - 10)
    }
  })
  let kingIdx
  if (inCheck) {
    const king = Object.entries(pieces).find(
      ([_, piece]) => piece.name === 'king' && piece.color === colorToMove
    )
    kingIdx = Number(king[0])
  }

  return (
    <div
      className="chessboard"
      style={{ '--dimensions': dimensions, width: width }}
    >
      {chessboard.map((_, i) => {
        let idx = i
        if (chessboardDirection === 'black') {
          idx = dimensions * dimensions - i - 1
        }
        let squareColor = ''
        if (dimensions % 2) {
          squareColor = idx % 2 ? 'dark' : 'light'
        } else {
          squareColor =
            (idx + Math.floor(idx / dimensions)) % 2 ? 'dark' : 'light'
        }
        let className = `square ${squareColor} ${
          selectedPiece === idx || pieceDragged === idx ? 'selected' : ''
        }`
        if (availableSquares.includes(idx)) {
          className += 'available' + (hoverredIndex === idx ? ' hover' : '')
        }
        if (Object.values(lastMove).includes(idx)) className += ' lastmove'
        if (availableSquaresCapture.includes(idx)) className += ' capture'
        if (inCheck && idx === kingIdx) {
          className += ' incheck'
        }
        return (
          <Square
            className={className}
            key={idx}
            onMouseDown={(e) => startMovingPiece(e, idx)}
          >
            {!!pieces[idx] && (
              <Piece
                name={pieces[idx].name}
                color={pieces[idx].color}
                style={{ '--pieceSize': `${width / dimensions}px` }}
                pieceMoving={pieceMoving}
                pieceDragged={pieceDragged}
                idx={idx}
                width={width}
              />
            )}
            {displayPromoteSelection.display &&
              displayPromoteSelection.idx === idx && (
                <PromoteSelection
                  squareWidth={width / dimensions}
                  color={selfColor}
                  sendPromotion={promote}
                />
              )}
          </Square>
        )
      })}
      {window.innerWidth > 600 && (
        <FontAwesomeIcon
          className="grow-icon"
          icon={faCaretUp}
          color="grey"
          onMouseDown={startGrowingChessboard}
        />
      )}
      <div className="above-name">
        {chessboardDirection === 'white' ? players?.black : players?.white}
      </div>
      <div className="below-name">
        {chessboardDirection === 'black' ? players?.black : players?.white}
      </div>
    </div>
  )
}
