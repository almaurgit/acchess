import { Pgn } from '../Pgn'
import { Timer } from '../Timer'
import { ResignButton } from '../ResignButton'
import { DrawOfferButton } from '../DrawOfferButton'
import './style.css'

export function InfoGame({
  timer,
  pgn,
  id,
  drawOffered,
  chessboardDirection,
  drawRequest,
  isPlaying,
  numberOfMoves,
}) {
  return (
    <div className="info-game">
      <div className="high-timer">
        <Timer
          timer={chessboardDirection === 'white' ? timer.black : timer.white}
        />
      </div>
      <Pgn pgn={pgn} />
      <div className="low-timer">
        <Timer
          timer={chessboardDirection === 'white' ? timer.white : timer.black}
        />
      </div>
      <div className="buttons-onplay">
        <ResignButton id={id} isPlaying={isPlaying} />
        <DrawOfferButton
          id={id}
          drawOffered={drawOffered}
          drawRequest={drawRequest}
          isPlaying={isPlaying}
          move={numberOfMoves}
        />
      </div>
    </div>
  )
}
