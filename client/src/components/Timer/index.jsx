import { useState } from 'react'
import './style.css'

export function Timer({ timer }) {
  return (
    <div className="timer">
      <div className="timer__display">
        {`${Math.floor(timer / 60)
          .toString()
          .padStart(2, '0')}`}
        <span className="double-dot">:</span>
        {`${(timer % 60).toString().padStart(2, '0')}`}
      </div>
    </div>
  )
}
