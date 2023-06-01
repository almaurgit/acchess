import './style.css'
import { useState } from 'react'
import { socket } from '../../App'

export function ResignButton({ id, isPlaying }) {
  const [numberOfPressions, setNumberOfPressions] = useState(0)

  const onClick = async () => {
    if (numberOfPressions === 0) setNumberOfPressions(1)
    else if (numberOfPressions === 1) {
      socket.emit('resign', { id })
    }
  }
  return (
    <div className="resign-button">
      {isPlaying && (
        <button
          className={
            'main-button' + (numberOfPressions === 0 ? ' resign' : ' confirm')
          }
          onClick={onClick}
        >
          {numberOfPressions === 0 ? 'Resign' : 'Confirm'}
        </button>
      )}
    </div>
  )
}
