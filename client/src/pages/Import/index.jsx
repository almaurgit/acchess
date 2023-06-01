import { useState } from 'react'
import './style.css'
import { socket } from '../../App'
import { useHistory } from 'react-router-dom'

export function Import() {
  const [pgn, setPgn] = useState('')
  const history = useHistory()

  const onPgn = (e) => {
    setPgn(e.target.value)
  }

  const sendPgn = () => {
    socket.emit('import-pgn', { pgn: pgn })
  }

  useState(() => {
    socket.on('analyse-pgn', redirectToAnalyse)

    return () => {
      socket.off('analyse-pgn', redirectToAnalyse)
    }
  }, [])

  function redirectToAnalyse({ id }) {
    history.push('/analysis/' + id)
  }

  return (
    <div className="import-page">
      <textarea
        name="pgn"
        value={pgn}
        onChange={onPgn}
        className="input import"
      >
        {pgn}
      </textarea>
      <ImportButton sendPgn={sendPgn} />
    </div>
  )
}

function ImportButton({ sendPgn }) {
  return (
    <div>
      <button onClick={sendPgn} className="main-button">
        Importer un pgn
      </button>
    </div>
  )
}
