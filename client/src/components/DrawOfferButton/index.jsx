import './style.css'
import { socket } from '../../App'
import { useState } from 'react'
import { useEffect } from 'react'

export function DrawOfferButton(props) {
  const { id, drawOffered, drawRequest, moves, isPlaying } = props

  const rejectDraw = () => {
    socket.emit('response_draw_offer', { id, response: 'reject' })
  }

  const acceptDraw = () => {
    socket.emit('response_draw_offer', { id, response: 'accept' })
  }

  const sendDrawOffer = () => {
    socket.emit('draw_offer', { id })
  }

  const cancelDrawOffer = () => {
    socket.emit('cancel_draw_offer', { id })
  }

  return (
    <div className="draw-buttons">
      {isPlaying &&
        (drawOffered ? (
          drawRequest === 'receiver' ? (
            <div className="receive-draw-offer">
              <button
                onClick={rejectDraw}
                className="main-button draw-button reject"
              >
                Reject
              </button>
              <button
                onClick={acceptDraw}
                className="main-button draw-button accept"
              >
                Accept
              </button>
            </div>
          ) : (
            <button
              className="main-button draw-button"
              onClick={cancelDrawOffer}
            >
              Cancel
            </button>
          )
        ) : (
          <button className="main-button draw-button" onClick={sendDrawOffer}>
            Offer draw
          </button>
        ))}
    </div>
  )
}
