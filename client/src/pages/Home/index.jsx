import './style.css'
import { useState } from 'react'
import { NewGameModal } from '../../components/NewGameModal'

export function Home() {
  const [newGameModalDisplay, setNewGameModalDisplay] = useState(false)

  return (
    <div className="home-container">
      <img
        src="https://www.freepnglogos.com/uploads/chess-png/favorite-chess-set-photo-16.png"
        alt="black pieces of chess"
        width="200"
      />
      <div className="home">
        <div className="welcome">
          <h1 className="welcome-title">
            welcome to <span className="welcome-acchess">acchess.</span>
          </h1>
          <div className="welcome-slogan">always access to chess</div>
          <div className="welcome-presentation">
            <p>
              The Alexosse Chess Club {'(A.C.C · acchess)'} makes chess
              accessible for everyone. Challenge your friends to regular chess
              or create your own custom-sized chessboard !
            </p>
          </div>
        </div>
        <button
          className="main-button"
          onClick={() => setNewGameModalDisplay((prev) => !prev)}
        >
          Challenge a friend
        </button>
      </div>
      {newGameModalDisplay && (
        <NewGameModal setNewGameModalDisplay={setNewGameModalDisplay} />
      )}
    </div>
  )
}
