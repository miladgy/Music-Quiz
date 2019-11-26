import React, { Component } from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import './normalize.css';
import './App.css';
import openSocket from 'socket.io-client';

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
          <h1 className="app__header app__header__h1">Hello Quiz!</h1>
          <img 
          className="app__image"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEWKhob19fX5+fmGgoKDfn6+vLzh4OD7+/u5t7fm5ubx8fGsqqrb2trQz8/09PSUkJCfnJzr6+uXk5OkoaGOi4uqp6fGxMSzsbHV1NR/enrMysqVkZGbmJjIxsaFllE0AAAEb0lEQVR4nO3Z23aiMBSAYUminFUUFK19/9cczA6QoNiuWSPTmfV/V5Ud02wScsDVCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPi36N7vFtDGRs1sBe9VH+52s3G9Op6KTZpuyvPhaQ6mbj6LNE2L03H1LK7r5mrj17w2f6zZ36fX8d1m5n/rel3FSqkoUiqOiuNDMb37zIYC1fohR3O4jvFteVu+H/W6++eRmslQN9U93FOqnBQw521QoDqGKZgkjEenxVN8maFZ+82zTUzroMB1UkCp3K/JlPG0gmLpkfoqQ7OO+3YrO9BsL3kp6qtfwP25H3tJl0/ixcK9+CJDfZT2qaxNzufPVE1bqM+uQFUm56TMpEA2VKUTuRJX1y5+dQM+XnigvurDStpf1jLb55JCfO5bWG+lwGl1L2DqUuLrPv4RBfFV4kbqftEU5zN0PaBOfUh/ZNJJroHuIVRJX8C09kLlPhvJWJ2HCvbxXxinL/rQdqEf0Y1rsmuh62LvqzIOb/KhlnyuY9w92Gr/jkzmzGaojzLm/CFlCq+w6+Ott1kwbZRl2yjXY81RFky+ctc+l+zE+QxPtoGp3xidx2OjZUyGs79skCQndzvKYPU4yX/7GRlKAye3W0bZ0RaogiH7WLN9alUe3CKZnrd/rPnfMP8cVuHEaRnJKrlf3NkM4ltfkcdeOMhjegsqnXxpCbMZ1tKWcFIwG1vargc3Wd36evJRY1PcS4aTWuW+NQsO09kMd3axiw/BRffs2TVbMogvLhLFA7tcuJlKXcJqU/ul/Adl+BFcfJFhFg3SfyNDN57Cs0IwSuUWuMXgIcN+lNZf1/pe8zNNOk4qg0s2Tj9u0jhKxGzH3bVkuIuerO4y/UzG/nt9tVqUQYayTYlsq9286nahurHSMUPp1fAW9Qvq+/J5NJ+h25LoJ9fkg912qtR9U17FVF6G7WPNuv1BK36/GvgLolvkW9m1uV2q/0zd4jFD11/BSUJGbpz8jAz1xnXY0BzZcw3zhBuG3r7uIocL161GHkSvwy7Fw1b2/foMLw97kr6P0tp97o9TG7cA6MQdhtw90P07AZehdieJto+7VwL+aWOxDKP0nHhkUyVb5+6In+y0MfW+UJPZUcuxX1V5bQu0yl8tOpWLN11c1417SxCeNpbK0L2KEf2z587wUZylm02lHl5C6H30pMCYoVv0pxUsuWXzMvT154Uugz44tD72lw+dD1/uC2R+H/YvcoIK1gu/bHuVYZdiFUaVCl8j6SZ4Hdp18H0yGjLsbkE0qSCaPW29SzcdqKlxhdCrq9dEpdLpS29dF8rrx+SSd9WNGYbxrkCx/Etvfe4ekYnUe1LM4TON7jchjrMif/LDhNlfK2ULZG3X/Fv3/TY89JYurqp2yf3o2ALzKByJq0PTza/5vp75ccmsbnlX4CiryvTrQzy/1X/r16evvfxt7TsFvqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/3S/uLCwOFk6YQgAAAABJRU5ErkJggg==" />
          <nav className="app__navigator">
            {/* <p><Link to="/EnterName">Join as host</Link></p>
            <p><Link to="/Waitingroom">waitingroom carter</Link></p>
            <p><Link to="/CurrentScore">Current score</Link></p>
            <p><Link to="/ChooseGameMode"> CHOOSE Game Mode!!</Link></p>
            <p><Link to="/GameMode">Game Mode</Link></p> */}
            <p><Link className="app__link app__link__join__player"
            to="/Join">Join a game as player</Link></p>
            {/* <p><Link to={!this.state.access_token ? "/login" : `/Gamemodes/#access_token=${this.state.access_token}`}>Game Modes!</Link></p> */}
            <p><Link className="app__link app__link__join__host"
            to={this.state.access_token ? `/EnterName/#access_token=${this.state.access_token}` : "/login"}>Log in with Spotify(Host)!</Link></p>
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
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
