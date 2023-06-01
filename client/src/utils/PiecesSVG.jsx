import rooklight from '../assets/Chess_rlt45.svg'
import knightlight from '../assets/Chess_nlt45.svg'
import bishoplight from '../assets/Chess_blt45.svg'
import queenlight from '../assets/Chess_qlt45.svg'
import kinglight from '../assets/Chess_klt45.svg'
import pawnlight from '../assets/Chess_plt45.svg'
import rookdark from '../assets/Chess_rdt45.svg'
import knightdark from '../assets/Chess_ndt45.svg'
import bishopdark from '../assets/Chess_bdt45.svg'
import queendark from '../assets/Chess_qdt45.svg'
import kingdark from '../assets/Chess_kdt45.svg'
import pawndark from '../assets/Chess_pdt45.svg'
import { useState } from 'react'

const pieces = {
  rooklight,
  knightlight,
  bishoplight,
  queenlight,
  kinglight,
  pawnlight,
  rookdark,
  knightdark,
  bishopdark,
  queendark,
  kingdark,
  pawndark,
}

export function Piece({
  name,
  color,
  style,
  pieceMoving,
  pieceDragged,
  idx,
  onMouseDown,
  onMouseUp,
  dragCustomPage = false,
  className = '',
}) {
  if (pieceDragged && pieceDragged >= 0 && pieceDragged === idx) {
    style = {
      ...style,
      left: pieceMoving.x + 'px',
      top: pieceMoving.y + 'px',
      transform: 'translate3D(-50%, -50%, 0)',
      zIndex: 10,
    }
  }
  if (dragCustomPage) {
    style = {
      ...style,
      left: pieceMoving.x + 'px',
      top: pieceMoving.y + 'px',
      transform: 'translate3D(-50%, -50%, 0)',
      zIndex: 10,
    }
  }
  const pieceColor = color === 'white' ? 'light' : 'dark'
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      name={name}
      color={color}
    >
      <img
        src={pieces[`${name}${pieceColor}`]}
        alt={`${name} ${color}`}
        className={'piece' + className}
        style={{ ...style, '--color': color }}
      />
    </div>
  )
}
