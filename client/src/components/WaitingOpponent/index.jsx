import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import './style.css'
import { useState } from 'react'
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleWhite } from '@fortawesome/free-regular-svg-icons'
import { faCircle as faCircleBlack } from '@fortawesome/free-solid-svg-icons'
import { faCircleHalfStroke as faCircleRandom } from '@fortawesome/free-solid-svg-icons'

export function WaitingOpponent(props) {
  const [tooltipCopy, setTooltipCopy] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

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
  const self = creatorColor === 'white' ? 'white' : 'black'

  function showTooltip() {
    setTooltipCopy(true)
  }

  function hideTooltip() {
    setTooltipCopy(false)
    setLinkCopied(false)
  }

  function selectLink(e) {
    e.target.select()
    e.target.setSelectionRange(0, 9999)
  }
  function copyLinkToClipboard(e) {
    const link = document.querySelector('.input-link')
    link.select()
    link.setSelectionRange(0, 99999)

    navigator.clipboard.writeText(link.value)
    setLinkCopied(true)
  }

  function tooltipDisplay() {
    return linkCopied ? 'Link copied' : 'Copy link'
  }

  return (
    <div className="waiting-card">
      <div className="waiting-card-header">
        Send this link to a friend to start a game !
      </div>
      <div className="copy-field">
        <input
          readOnly
          value={'https://www.acchess.org/play/' + id}
          className="input-link input"
          onClick={selectLink}
          size={40}
        />
        <FontAwesomeIcon
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          icon={faCopy}
          className="copy-icon"
          onClick={copyLinkToClipboard}
        />
        {tooltipCopy && <div className="tooltip-copy">{tooltipDisplay()}</div>}
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
                'color-icon ' + (creatorColor === 'white' ? 'selected' : '')
              }
            >
              <FontAwesomeIcon icon={faCircleWhite} />
            </span>
            <span
              className={
                'color-icon ' + (creatorColor === 'black' ? 'selected' : '')
              }
            >
              <FontAwesomeIcon icon={faCircleBlack} />
            </span>
          </div>
        </div>
        <div>Dimensions {dimensions}</div>
      </div>
      <div className="blindfold-container">{blindChess && 'Blindfold'}</div>
    </div>
  )
}
