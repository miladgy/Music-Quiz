import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: []
    }
  }

 
  handleClick = () => {
    const access_token = window.location.hash.split('=')[1].split('&')[0];
    const refresh_token = window.location.hash.split('refresh_token=')[1];
    fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + access_token
          }
        })
          .then(response => response.json())
          .then(data =>{ console.log('we fetch', data)
          this.setState({playlists: data.items })
        });
  }
  render() {
    return (
      <div className="App">
        <h1>Hello Quiz!</h1>
        <a href="http://localhost:5000/login">Click for login</a>
        <button onClick={this.handleClick}>Show Genres</button>
        {this.state.playlists.map(playlist => {
        return <div>{playlist.name} {playlist.id}</div>
        })}
      </div>
    );
  }
}

export default App;
