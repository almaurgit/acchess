import { useEffect } from 'react'
import { useMemo } from 'react'
import { useRef } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Piece } from '../../utils/PiecesSVG'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'

import './style.css'

export function CustomGame(props) {
  const [dimension, setDimension] = useState(8)
  const [chessboardDirection, setChessboardDirection] = useState('white')
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [overInfo, setOverInfo] = useState(false)
  const [pieces, setPieces] = useState({})
  const [width, setWidth] = useState(500)
  const [dragPieceX, setDragPieceX] = useState(0)
  const [dragPieceY, setDragPieceY] = useState(0)
  const [validBoard, setValidBoard] = useState(false)
  const [colorToMove, setColorToMove] = useState('white')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const history = useHistory()

  useEffect(() => {
    document.addEventListener('mousedown', cancelSelection)
    document.addEventListener('mousemove', onMouseMove)
    addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', cancelSelection)
      document.removeEventListener('mousemove', onMouseMove)
    }
  })
  const onResize = (event) => {
    const windowWidth = event.currentTarget.innerWidth
    if (windowWidth > 600) {
      if (windowWidth < width + 256) {
        setWidth((width) => Math.min(windowWidth - 256, width))
      }
    } else {
      setWidth(windowWidth - 10)
    }
  }
  // \/ NE MARCHE PAS QUAND ON CHANGE TROP RAPIDEMENT DE DIMENSION \/
  //   useEffect(() => {
  //     const newPieces = {}
  //     const piecesCopy = { ...pieces }
  //     if (Object.keys(piecesCopy).length > 0) {
  //       const minDimension = Math.min(dimension, lastDimension.current)
  //       const maxDimension = Math.max(dimension, lastDimension.current)
  //       const diff = maxDimension - minDimension
  //       for (let row = 0; row < minDimension; row++) {
  //         console.log('first loop')
  //         let addRow = 0
  //         if (row >= lastDimension.current / 2) addRow = diff
  //         for (let col = 0; col < minDimension; col++) {
  //           let index = (row + addRow) * dimension + col
  //           let lastIndex = row * lastDimension.current + col

  //           if (piecesCopy[lastIndex]) {
  //             console.log('dimension :', dimension)
  //             console.log('lastDimension.current :', lastDimension.current)
  //             console.log('index :', index)
  //             console.log('lastIndex :', lastIndex)
  //             console.log('row :', row)
  //             console.log('col :', col)
  //             newPieces[index] = piecesCopy[lastIndex]
  //           }
  //         }
  //       }
  //       setPieces(newPieces)
  //     }
  //     lastDimension.current = dimension
  //   }, [dimension]) // keep pieces at first rows if dimension changes

  useEffect(() => {
    const newPieces = {}
    const size = dimension * dimension
    Object.entries(pieces).forEach(([index, piece]) => {
      if (index < size) newPieces[index] = piece
    })
    setPieces(newPieces)
  }, [dimension])

  useEffect(() => {
    if (window.innerWidth < width + 256 && window.innerWidth > 600)
      setWidth(window.innerWidth - 256)
    else if (window.innerWidth <= 600) setWidth(window.innerWidth - 10)
    addEventListener('resize', handleResponsiveMode)
    function handleResponsiveMode(e) {
      setWindowWidth(e.currentTarget.innerWidth)
    }
    return () => {
      removeEventListener('resize', handleResponsiveMode)
    }
  }, [])

  useEffect(() => {
    if (!selectedPiece) {
      setDragPieceX(null)
      setDragPieceY(null)
      return
    }
  }, [selectedPiece])

  useEffect(() => {
    if (dragPieceX === null || dragPieceY === null) return
  }, [dragPieceX, dragPieceY])

  useEffect(() => {
    const kings = Object.values(pieces).filter((piece) => {
      return piece.name === 'king'
    })
    if (kings.length == 2) {
      const colors = [kings[0].color, kings[1].color]
      if (
        ['white', 'black'].includes(colors[0]) &&
        ['white', 'black'].includes(colors[1]) &&
        colors[0] !== colors[1]
      ) {
        setValidBoard(true)
        return
      }
    }
    setValidBoard(false)
  }, [pieces])

  const startGrowingChessboard = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const cornerChessboardPosition = { x: e.pageX, y: e.pageY }

    const currentWidth = width

    const handleGrowChessboard = (e) => {
      const offsetY = e.pageY - cornerChessboardPosition.y
      const newWidth = Math.min(
        currentWidth + offsetY * 2,
        document.querySelector('.container').clientHeight,
        document.querySelector('.container').clientWidth - 256
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

  function startGame(e) {
    e.preventDefault()
    history.push({
      pathname: '/create',
      state: {
        pieces,
        dimension,
        colorToMove,
        custom: true,
      },
    })
  }

  function cancelSelection(e) {
    if (e.target.className.includes('piece')) return
    setSelectedPiece(null)
  }

  function placePiece(index) {
    if (!selectedPiece) {
      if (Object.keys(pieces).includes(index.toString())) {
        const newPieces = { ...pieces }
        delete newPieces[index]
        setPieces(newPieces)
      }
    } else {
      setPieces((pieces) => {
        return {
          ...pieces,
          [index]: selectedPiece,
        }
      })
    }
  }

  function onMouseMove(e) {
    if (!selectedPiece) return
    const rect = document.querySelector('.custom-board').getBoundingClientRect()
    const x = e.pageX
    const y = e.pageY
    setDragPieceX(x)
    setDragPieceY(y)
  }

  function hideSelectedPiece() {
    setOverInfo(true)
  }

  function showSelectedPiece() {
    setOverInfo(false)
  }

  return (
    <>
      {selectedPiece !== null && !overInfo && (
        <Piece
          name={selectedPiece.name}
          color={selectedPiece.color}
          pieceMoving={{ x: dragPieceX, y: dragPieceY }}
          style={{
            '--pieceSize': `${width / Math.max(dimension, 8)}px`,
            pointerEvents: 'none',
          }}
          dragCustomPage={true}
        />
      )}
      <div className="custom-page">
        <div className="custom-board" style={{ '--boardWidth': `${width}px` }}>
          <PiecesSelection
            color={chessboardDirection === 'white' ? 'black' : 'white'}
            setSelectedPiece={setSelectedPiece}
            setDragPieceX={setDragPieceX}
            setDragPieceY={setDragPieceY}
            width={width}
            size={width / 8}
          />
          <CustomChessboard
            chessboardDirection={chessboardDirection}
            dimension={dimension}
            width={width}
            pieces={pieces}
            placePiece={placePiece}
            selectedPiece={selectedPiece}
            size={width / dimension}
            startGrowingChessboard={startGrowingChessboard}
          />
          <PiecesSelection
            color={chessboardDirection}
            setSelectedPiece={setSelectedPiece}
            setDragPieceX={setDragPieceX}
            setDragPieceY={setDragPieceY}
            width={width}
            size={width / 8}
          />
        </div>
        <InfoCustomGame
          onMouseEnter={hideSelectedPiece}
          onMouseLeave={showSelectedPiece}
          dimension={dimension}
          setDimension={setDimension}
          setChessboardDirection={setChessboardDirection}
          setPieces={setPieces}
          selectedPiece={selectedPiece}
          width={width}
          validBoard={validBoard}
          setColorToMove={setColorToMove}
          startGame={startGame}
        />
      </div>
    </>
  )
}

function CustomChessboard({
  chessboardDirection,
  pieces,
  dimension,
  width,
  placePiece,
  selectedPiece,
  size,
  startGrowingChessboard,
}) {
  const mouseDownSquare = useCallback(
    (index, e) => {
      e.stopPropagation()
      placePiece(index)
    },
    [selectedPiece, pieces]
  )

  const boundClick = useCallback(
    (index) => {
      return mouseDownSquare.bind(null, index)
    },
    [mouseDownSquare]
  )

  const chessboard = useMemo(() => {
    const board = []
    for (let row = 0; row < dimension; row++) {
      for (let col = 0; col < dimension; col++) {
        let squareColor = (row + col) % 2 ? 'dark' : 'light'
        let index = row * dimension + col
        if (chessboardDirection === 'black')
          index = dimension * dimension - index - 1
        board.push(
          <div
            key={index}
            className={`square ${squareColor}`}
            onMouseDown={boundClick(index)}
            onMouseUp={boundClick(index)}
          >
            {pieces[index] && (
              <Piece
                style={{ '--pieceSize': `${size}px` }}
                name={pieces[index].name}
                color={pieces[index].color}
              />
            )}
          </div>
        )
      }
    }
    return board
  }, [dimension, boundClick, chessboardDirection, width])

  return (
    <div
      className="custom-chessboard"
      style={{ '--dimension': dimension, '--width': width }}
    >
      {chessboard}
      {window.innerWidth > 600 && (
        <FontAwesomeIcon
          className="grow-icon"
          icon={faCaretUp}
          color="grey"
          onMouseDown={startGrowingChessboard}
        />
      )}
    </div>
  )
}

function PiecesSelection({
  color,
  setSelectedPiece,
  setDragPieceX,
  setDragPieceY,
  size,
  width,
}) {
  function onSelectPiece(e) {
    e.preventDefault()
    setSelectedPiece({
      name: e.currentTarget.getAttribute('name'),
      color: e.currentTarget.getAttribute('color'),
    })
    const x = e.pageX
    const y = e.pageY
    setDragPieceX(x)
    setDragPieceY(y)
  }

  return (
    <div
      className="piece-selection"
      style={{
        '--pieceSize': `${size}px`,
        '--width': `${(width * width) / (width + size)}px`,
      }}
    >
      <Piece
        className=" piece-selection-item"
        name="queen"
        color={color}
        onMouseDown={onSelectPiece}
        onMouseUp={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
      />
      <Piece
        className=" piece-selection-item"
        name="king"
        color={color}
        onMouseDown={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
        onMouseUp={onSelectPiece}
      />
      <Piece
        className=" piece-selection-item"
        name="rook"
        color={color}
        onMouseDown={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
        onMouseUp={onSelectPiece}
      />
      <Piece
        className=" piece-selection-item"
        name="bishop"
        color={color}
        onMouseDown={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
        onMouseUp={onSelectPiece}
      />
      <Piece
        className=" piece-selection-item"
        name="knight"
        color={color}
        onMouseDown={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
        onMouseUp={onSelectPiece}
      />
      <Piece
        className=" piece-selection-item"
        name="pawn"
        color={color}
        onMouseDown={onSelectPiece}
        style={{ '--pieceSize': `${size}px` }}
        onMouseUp={onSelectPiece}
      />
    </div>
  )
}

function InfoCustomGame({
  dimension,
  setDimension,
  setChessboardDirection,
  setPieces,
  selectedPiece,
  width,
  onMouseEnter,
  onMouseLeave,
  validBoard,
  setColorToMove,
  startGame,
}) {
  function dimensionChange(e) {
    setDimension(e.target.value)
  }

  function resetPieces() {
    setPieces({})
  }

  function onChangeDirection() {
    setChessboardDirection((prev) => (prev === 'white' ? 'black' : 'white'))
  }

  const changeColorToMove = (e) => {
    setColorToMove(e.target.value)
  }

  return (
    <div
      className="info-custom-game"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="board-buttons">
        <button onClick={resetPieces} className="main-button board-button">
          Reset board
        </button>
        <button
          onClick={onChangeDirection}
          className="main-button board-button"
        >
          Invert chessboard
        </button>
      </div>
      <div className="info-dimension">
        <p>Dimension : {dimension}</p>
        <input
          type="range"
          id="dimension"
          name="dimension"
          min="4"
          max="16"
          value={dimension}
          step="1"
          onChange={dimensionChange}
        />
      </div>
      <div className="color-to-move">
        <div>
          <div>
            <input
              type="radio"
              id="white"
              name="color"
              value="white"
              onChange={changeColorToMove}
            />
            <label htmlFor="white">White</label>
          </div>
          <div>
            <input
              type="radio"
              id="black"
              name="color"
              value="black"
              onChange={changeColorToMove}
            />
            <label htmlFor="black">Black</label>
          </div>
        </div>
        ...to move
      </div>
      <div className="current-piece-selected">
        <p>Selected piece</p>
        <div className="selected-piece-container">
          {selectedPiece !== null && (
            <Piece
              name={selectedPiece.name}
              color={selectedPiece.color}
              style={{
                '--pieceSize': `${46}px`,
                position: 'absolute',
              }}
            />
          )}
        </div>
      </div>
      <div className="info-start-button">
        <button
          onClick={startGame}
          disabled={!validBoard}
          className={'main-button' + (validBoard ? '' : ' disabled')}
        >
          {validBoard ? 'Start game !' : 'One king of each color is required'}
        </button>
      </div>
    </div>
  )
}
