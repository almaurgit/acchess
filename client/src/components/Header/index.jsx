import { Link } from 'react-router-dom'
import './style.css'

export function Header() {
  return (
    <div className="header">
      <Link className="header-title" to="/">
        acchess.
      </Link>
      <nav className="header-nav">
        <Link to="/import" className="link">
          Import
        </Link>
        <Link to="/custom" className="link">
          Custom
        </Link>
        <Link to="/create" className="create-button link">
          Create a game
        </Link>
      </nav>
    </div>
  )
}
