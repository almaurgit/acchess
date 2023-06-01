import './style.css'
import { Piece } from '../../utils/PiecesSVG'

export function PromoteSelection({ color, squareWidth, sendPromotion }) {
  function onSendPromotion(e) {
    sendPromotion(e.currentTarget.getAttribute('data-name'))
  }
  return (
    <div className="promotion">
      <div
        className="promotion-square"
        style={{ '--squareWidth': `${squareWidth}px` }}
        onClick={onSendPromotion}
        data-name="R"
      >
        <Piece
          name="rook"
          color={color}
          style={{ '--pieceSize': `${squareWidth}px` }}
        />
      </div>
      <div
        className="promotion-square"
        style={{ '--squareWidth': `${squareWidth}px` }}
        onClick={onSendPromotion}
        data-name="Q"
      >
        <Piece
          name="queen"
          color={color}
          style={{ '--pieceSize': `${squareWidth}px` }}
        />
      </div>
      <div
        className="promotion-square"
        style={{ '--squareWidth': `${squareWidth}px` }}
        onClick={onSendPromotion}
        data-name="N"
      >
        <Piece
          name="knight"
          color={color}
          style={{ '--pieceSize': `${squareWidth}px` }}
        />
      </div>
      <div
        className="promotion-square"
        style={{ '--squareWidth': `${squareWidth}px` }}
        onClick={onSendPromotion}
        data-name="B"
      >
        <Piece
          name="bishop"
          color={color}
          style={{ '--pieceSize': `${squareWidth}px` }}
        />
      </div>
    </div>
  )
}
