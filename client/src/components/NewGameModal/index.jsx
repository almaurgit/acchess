import './style.css'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleWhite } from '@fortawesome/free-regular-svg-icons'
import { faCircle as faCircleBlack } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke as faCircleRandom } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import serverDomain from '../../utils/serverName.js'

export function NewGameModal({ id = null, customGame = false }) {
  const incrementTypes = ['none', 'increment', 'delay']
  const playerColors = ['white', 'random', 'black']

  const [whiteTime, setWhiteTime] = useState(180)
  const [blackTime, setBlackTime] = useState(180)
  const [blackTimeDefault, setBlackTimeDefault] = useState(true)
  const [whiteTimingMethod, setWhiteTimingMethod] = useState(incrementTypes[1])
  const [blackTimingMethod, setBlackTimingMethod] = useState(incrementTypes[1])
  const [whiteIncrement, setWhiteIncrement] = useState(2)
  const [blackIncrement, setBlackIncrement] = useState(2)
  const [dimensions, setDimensions] = useState(8)
  const [playerName, setPlayerName] = useState('Anonymous')
  const [playerColor, setPlayerColor] = useState(playerColors[1])
  const [armageddon, setArmageddon] = useState(false)
  const [pressClock, setPressClock] = useState(false)
  const [advancedSettings, setAdvancedSettings] = useState(false)
  const [blindChess, setBlindChess] = useState(false)

  const history = useHistory()
  const location = useLocation()
  const {
    pieces,
    dimension,
    colorToMove,
    custom = false,
  } = location.state !== undefined && location.state

  useEffect(() => {
    if (custom) {
      setDimensions(Number(dimension))
    }
  })
  const onChangePlayerName = (e) => {
    const pattern = /^[a-zA-Z0-9\-_]+$/
    let value = e.target.value
    if (value === '') setPlayerName('Anonymous')
    if (!pattern.test(value)) return
    if (value.length >= 20) value = value.slice(0, 20)
    setPlayerName(value)
  }

  const onChangeMinutes = (e) => {
    let value = e.target.value
    if (value > 90) value = 90
    if (value < 0) value = 0
    if (e.target.name === 'whiteMinutes') {
      setWhiteTime((time) => 60 * value + (time % 60))
      if (blackTimeDefault) setBlackTime((time) => 60 * value + (time % 60))
    } else {
      setBlackTimeDefault(false)

      setBlackTime((time) => 60 * value + (time % 60))
    }

    return
  }

  const onChangeSeconds = (e) => {
    let value = e.target.value
    if (value >= 60 || value < 0) value = 0
    if (e.target.name === 'whiteSeconds') {
      setWhiteTime((time) => time - (time % 60) + (value % 60))
      if (blackTimeDefault)
        setBlackTime((time) => time - (time % 60) + (value % 60))
    } else {
      setBlackTimeDefault(false)
      setBlackTime((time) => time - (time % 60) + (value % 60))
    }

    return
  }

  const onChangeWhiteIncrement = (e) => {
    let value = e.target.value
    if (value > 120) value = 120
    if (value < 0) value = 0
    if (e.target.name === 'whiteIncrement') {
      setWhiteIncrement(value)
      if (blackTimeDefault) setBlackIncrement(value)
    } else {
      setBlackTimeDefault(false)
      setBlackIncrement(value)
    }
  }

  const onChangeTimingMethod = (e) => {
    if (e.target.name === 'whiteTimingMethod') {
      setWhiteTimingMethod(e.target.value)
      if (e.target.value === 'none') setWhiteIncrement(0)
      if (blackTimeDefault) {
        setBlackTimingMethod(e.target.value)
        setBlackIncrement(0)
      }
    } else {
      setBlackTimeDefault(false)
      setBlackTimingMethod(e.target.value)
      if (e.target.value === 'none') setBlackIncrement(0)
    }
  }
  const dimensionsOptions = () => {
    let options = []
    for (let i = 4; i <= 16; i++) {
      options.push(
        <option key={i} value={i.toString()}>
          {i === 8 ? '8 (default)' : i.toString()}
        </option>
      )
    }
    return options
  }

  const handleNewGame = async (e) => {
    e.preventDefault()
    const gameParameters = {
      whiteTime,
      blackTime,
      whiteTimingMethod,
      blackTimingMethod,
      whiteIncrement,
      blackIncrement,
      dimensions,
      gameCreatorName: playerName,
      gameCreatorColor: playerColor,
      armageddon,
      pressClock,
      advancedSettings,
      blindChess,
    }

    let res
    if (custom) {
      res = await fetch(serverDomain + '/play/custom/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...gameParameters,
          dimensions,
          pieces,
          colorToMove,
        }),
      })
    } else {
      res = await fetch(serverDomain + '/play/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(gameParameters),
      })
    }
    const data = await res.json()
    console.log('data :', data)
    const { id } = data
    history.push('/play/' + id)
  }

  return (
    <div className="new-game-modal">
      <div className="name-color">
        <div className="input-name">
          Name
          <input
            className="input"
            type="text"
            value={playerName === 'Anonymous' ? '' : playerName}
            onChange={onChangePlayerName}
            placeholder="Anonymous"
          />
        </div>
        <div className="color-selection-container">
          Color
          <div className="color-selection">
            <span
              className={
                'color-icon ' + (playerColor === 'white' ? 'selected' : '')
              }
              onClick={() => setPlayerColor('white')}
            >
              <FontAwesomeIcon icon={faCircleWhite} />
            </span>
            <span
              className={
                'color-icon ' + (playerColor === 'random' ? 'selected' : '')
              }
              onClick={() => setPlayerColor('random')}
            >
              <FontAwesomeIcon icon={faCircleRandom} />
            </span>
            <span
              className={
                'color-icon ' + (playerColor === 'black' ? 'selected' : '')
              }
              onClick={() => setPlayerColor('black')}
            >
              <FontAwesomeIcon icon={faCircleBlack} />
            </span>
          </div>
        </div>
      </div>
      <div className="selection-time-container">
        <div className="selection-time">
          <div className="time-title">
            <FontAwesomeIcon icon={faHourglassStart} />
            <span>White</span>
          </div>
          <div className="selection-time-inputs">
            <input
              className="input"
              type="number"
              name="whiteMinutes"
              min={0}
              max={90}
              onChange={onChangeMinutes}
              value={Math.floor(whiteTime / 60)}
            />
            mn
            <input
              className="input"
              type="number"
              name="whiteSeconds"
              min={0}
              max={59}
              onChange={onChangeSeconds}
              value={Math.floor(whiteTime % 60)}
            />
            s
          </div>
          <div className="selection-increment">
            <select
              className="input"
              value={whiteTimingMethod}
              name="whiteTimingMethod"
              onChange={onChangeTimingMethod}
            >
              {incrementTypes.map((method, i) => (
                <option value={method} key={i}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
            <input
              className={
                'input' + (whiteTimingMethod === 'none' ? ' disabled' : '')
              }
              type="number"
              name="whiteIncrement"
              value={whiteIncrement}
              onChange={onChangeWhiteIncrement}
              min={0}
              max={120}
              disabled={whiteTimingMethod === 'none'}
            />
            s
          </div>
        </div>
        <div className="separation-line" />
        <div className="selection-time">
          <div className="time-title">
            <FontAwesomeIcon icon={faHourglassStart} />
            <span>Black</span>
          </div>
          <div className="selection-time-inputs">
            <input
              className="input"
              type="number"
              name="blackMinutes"
              min={0}
              max={90}
              onChange={onChangeMinutes}
              value={Math.floor(blackTime / 60)}
            />
            mn
            <input
              className="input"
              type="number"
              name="blackSeconds"
              min={0}
              max={59}
              onChange={onChangeSeconds}
              value={Math.floor(blackTime % 60)}
            />
            s
          </div>
          <div className="selection-increment">
            <select
              className="input"
              value={blackTimingMethod}
              name="blackTimingMethod"
              onChange={onChangeTimingMethod}
            >
              {incrementTypes.map((method, i) => (
                <option value={method} key={i}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
            <input
              className={
                'input' + (blackTimingMethod === 'none' ? ' disabled' : '')
              }
              type="number"
              name="blackIncrement"
              value={blackIncrement}
              onChange={onChangeWhiteIncrement}
              min={0}
              max={120}
              disabled={blackTimingMethod === 'none'}
            />
            s
          </div>
        </div>
      </div>

      <div className="selection-options">
        <div>
          Dimensions
          <select
            className="input"
            value={dimensions}
            onChange={(e) => setDimensions(parseInt(e.target.value))}
            disabled={custom}
          >
            {dimensionsOptions()}
          </select>
        </div>

        <div className="blindfold-container">
          Blindfold
          <div
            className={'blindfold-checkbox' + (blindChess ? ' selected' : '')}
            onClick={() => setBlindChess((prev) => !prev)}
          />
        </div>
      </div>
      <div className="container-button">
        <button className="main-button" onClick={handleNewGame}>
          Create game
        </button>
      </div>
    </div>
  )
}
