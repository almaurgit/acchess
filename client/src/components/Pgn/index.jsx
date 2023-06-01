import './style.css'

export function Pgn({
  pgn,
  currentMove,
  setCurrentMove,
  numberOfMoves,
  scroll,
}) {
  const onChangeCurrentMove = (idx) => {
    if (idx >= numberOfMoves) return
    setCurrentMove(idx + 1)
  }

  return (
    <div className={'pgn' + (scroll ? ' scroll' : '')}>
      {typeof pgn !== 'string' ? (
        pgn.map((move, idx) => {
          return (
            <span
              key={idx}
              className={
                (idx < numberOfMoves ? 'move' : '') +
                (idx + 1 === currentMove ? ' current' : '')
              }
              onClick={() => onChangeCurrentMove(idx)}
            >
              {move + ' '}
            </span>
          )
        })
      ) : (
        <p>{pgn}</p>
      )}
    </div>
  )
}
