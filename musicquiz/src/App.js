import React, { Component } from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import './App.css';
import openSocket from 'socket.io-client';

import EnterName from './components/EnterName'
import Join from './components/Join'
import Waitingroom from './components/Waitingroom'
import Playlists from './components/Playlists'
import GameMode from './components/GameMode'
import ChooseGameMode from './components/ChooseGameMode'
import CurrentScore from './components/CurrentScore'

const socket = openSocket('http://localhost:5000');

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
        <div className="App">
          <h1>Hello Quiz!</h1>
          <nav className="navigator">
            <p><Link to="/EnterName">Join as host</Link></p>
            <p><Link to="/Waitingroom">waitingroom carter</Link></p>
            <p><Link to="/CurrentScore">Current score</Link></p>
            <p><Link to="/ChooseGameMode"> CHOOSE Game Mode!!</Link></p>
            <p><Link to="/GameMode">Game Mode</Link></p>
            <p><Link to="/Join">Join a game as player</Link></p>
            <p><Link to={!this.state.access_token ? "/login" : `/Gamemodes/#access_token=${this.state.access_token}`}>Game Modes!</Link></p>
            <p><Link to={this.state.access_token ? `/EnterName/#access_token=${this.state.access_token}` : "/login"}>Log in with Spotify(Host)!</Link></p>
          </nav>

          <Switch>
            <Route path="/EnterName">
              <EnterName setToken={this.setToken} socket={socket} />
            </Route>

            <Route path="/Join">
              <Join socket={socket} />
            </Route>
            <Route path="/Playlists">
              <Playlists
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
                selectedGameMode={this.state.selectedGameMode} 
                selectedPlaylistId={this.state.selectedPlaylistId}
                socket={socket} access_token={this.state.access_token} />
            </Route>
            <Route path="/ChooseGameMode">
              <ChooseGameMode
               selectedGameMode={this.state.selectedGameMode} 
               setSelectedGameMode={this.setSelectedGameMode} 
              />
            </Route>
            <Route path='/login' component={() => {
              window.location.href = 'http://localhost:5000/login';
              return null;
            }} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
