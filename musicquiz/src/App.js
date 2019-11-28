import React, { Component } from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import './normalize.css';
import './App.css';
import openSocket from 'socket.io-client';
import Home from './components/Home'
import EnterName from './components/EnterName'
import Join from './components/Join'
import Waitingroom from './components/Waitingroom'
import Playlists from './components/Playlists'
import GameMode from './components/GameMode'
import ChooseGameMode from './components/ChooseGameMode'
import CurrentScore from './components/CurrentScore'

const socket = openSocket('http://192.168.38.5:5000');

socket.on('message', (data) => {
  console.log('this is the response back on the socket-listener of "message"', data)
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      access_token: '',
      selectedPlaylistId: '',
      selectedGameMode: ''
    }
  }

  setToken = (token) => {
    this.setState({ access_token: token });
  }

  setSelectedPlaylist = (id) => {
    this.setState({ selectedPlaylistId: id })
  }

  setSelectedGameMode = (gameMode) => {
    this.setState({ selectedGameMode: gameMode });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Link className="app__header__tag" to="/"><h1 className="app__header app__header__h1 header__tag">Quizzify</h1></Link>
          <Switch>
            <Route path="/EnterName">
              <EnterName setToken={this.setToken} socket={socket} />
            </Route>
            <Route path="/Join">
              <Join socket={socket} />
            </Route>
            <Route path="/Playlists">
              <Playlists
                socket={socket}
                setSelectedPlaylist={this.setSelectedPlaylist}
                selectedPlaylistId={this.state.selectedPlaylistId} access_token={this.state.access_token} />
            </Route>
            <Route path="/Waitingroom">
              <Waitingroom socket={socket} />
            </Route>
            <Route path="/CurrentScore">
              <CurrentScore socket={socket} />
            </Route>
            <Route path="/GameMode">
              <GameMode
                setSelectedGameMode={this.setSelectedGameMode}
                selectedGameMode={this.state.selectedGameMode}
                selectedPlaylistId={this.state.selectedPlaylistId}
                socket={socket} access_token={this.state.access_token} />
            </Route>
            <Route path="/ChooseGameMode">
              <ChooseGameMode
                socket={socket}
                selectedGameMode={this.state.selectedGameMode}
                setSelectedGameMode={this.setSelectedGameMode}
              />
            </Route>
            <Route path='/login' component={() => {
              window.location.href = 'http://localhost:5000/login';
              return null;
            }} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
