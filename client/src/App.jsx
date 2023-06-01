import './App.css'
import { Game } from './components/Game'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Import } from './pages/Import'
import { io } from 'socket.io-client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Analysis } from './pages/Analysis'
import { CustomGame } from './pages/CustomGame'
import { NewGame } from './pages/NewGame'
import serverDomain from './utils/serverName'

export const socket = io(serverDomain, {
  withCredentials: true,
})

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <div className="main">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/play/:id">
                <Game />
              </Route>
              <Route path="/import">
                <Import />
              </Route>
              <Route path="/custom">
                <CustomGame />
              </Route>
              <Route path="/create">
                <NewGame />
              </Route>
              <Route path="/analysis/:id">
                <Analysis />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
      <Footer />
    </>
  )
}

export default App
