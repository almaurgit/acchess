import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { socket } from '../../App'
import { useFetch } from '../../utils/hooks'
import { faCircle as faCircleWhite } from '@fortawesome/free-regular-svg-icons'
import { faCircle as faCircleBlack } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke as faCircleRandom } from '@fortawesome/free-solid-svg-icons'

import './style.css'
import serverDomain from '../../utils/serverName'

export function JoinGameModal(props) {
  const [playerName, setPlayerName] = useState('')

  const {
    players,
    timer,
    increment,
    creatorName,
    creatorColor,
    id,
    dimensions,
    blindChess,
  } = props
  const self = creatorColor === 'white' ? 'black' : 'white'
  const history = useHistory()

  const onChangePlayerName = (e) => {
    const pattern = /^[a-zA-Z0-9\-_]+$/
    let value = e.target.value
    if (value === '') setPlayerName('Anonymous')
    if (!pattern.test(value)) return
    if (value.length >= 20) value = value.slice(0, 20)
    setPlayerName(value)
  }

  async function startGame() {
    // envoyer nom au serveur
    // serveur met à jour les 2 joueurs
    // serveur met la partie en "playing"
    // serveur émet "start"
    // les coups sont alors autorisés par le serveur

    const res = await fetch(serverDomain + '/play/join/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ playerName }),
    })
    const data = await res.json()
    history.go()
  }

  return (
    <div className="join-game-modal">
      <>
        <h2>{creatorName} wants to play with you !</h2>
        <div>
          Choose a username
          <input
            className="input"
            type="text"
            value={playerName === 'Anonymous' ? '' : playerName}
            onChange={onChangePlayerName}
            placeholder="Anonymous"
          />
        </div>
        <hr />
        <div className="selection-time-container">
          <div className="selection-time">
            <div className="time-title">
              <FontAwesomeIcon icon={faHourglassStart} />
              <span>White</span>
            </div>
            <div className="selection-time-inputs">
              {Math.floor(timer.white / 60)}mn {Math.floor(timer.white % 60)}s
            </div>
            <div className="selection-increment">
              {increment.white.method} {increment.white.duration}s
            </div>
          </div>
          <div className="separation-line" />
          <div className="selection-time">
            <div className="time-title">
              <FontAwesomeIcon icon={faHourglassStart} />
              <span>Black</span>
            </div>
            <div className="selection-time-inputs">
              {Math.floor(timer.black / 60)}mn {Math.floor(timer.black % 60)}s
            </div>
            <div className="selection-increment">
              {increment.black.method} {increment.black.duration}s
            </div>
          </div>
        </div>

        <div className="other-infos">
          <div className="color-selection-container">
            Color
            <div className="color-selection">
              <span
                className={
                  'color-icon ' + (creatorColor === 'black' ? 'selected' : '')
                }
              >
                <FontAwesomeIcon icon={faCircleWhite} />
              </span>
              <span
                className={
                  'color-icon ' + (creatorColor === 'white' ? 'selected' : '')
                }
              >
                <FontAwesomeIcon icon={faCircleBlack} />
              </span>
            </div>
          </div>
          <div>Dimensions {dimensions}</div>
        </div>
        <div className="blindfold-container">{blindChess && 'Blindfold'}</div>
      </>
      {/* )} */}
      <button onClick={startGame} className="main-button">
        Join the game !
      </button>
    </div>
  )
}
