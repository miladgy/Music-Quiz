import React from 'react';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import './App.css';
import openSocket from 'socket.io-client';
import EnterName from './components/EnterName'
import Gamemodes from './components/Gamemodes'
const socket = openSocket('http://localhost:5000');

socket.on('message', (data) => {
  console.log('This is the data from socket', data)
})

// socket.emit('addClient', 'playerMilad');
// socket.emit('addClient', 'playerModi');

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      access_token : ''
    }
  }

setToken = (token) => {
  this.setState({access_token: token});
}

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <h1>Hello Quiz!</h1>
          <Link to="/EnterName">Skip</Link><br />
          <Link to="/login">Log in with Spotify</Link><br />
          <Link to={!this.state.access_token ? "/login" : `/Gamemodes/#access_token=${this.state.access_token}`}>Game Modes!</Link><br />


          
          

          <Switch>
            <Route path="/EnterName">
              <EnterName />
            </Route>
            <Route path="/Gamemodes">
              <Gamemodes setToken={this.setToken}/>
            </Route>
            <Route path="/login">
            <a href="http://localhost:5000/login">Click for login</a>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
