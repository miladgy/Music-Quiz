import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlist: [],
      selectedPlaylist: [],
      myPlaylist: []
    }
  }

  //   componentDidMount() {
  //     const city = 'athens'
  //     fetch(`http://localhost:5000/search/${city}`)
  //     .then(res => res.json())
  //     .then(data => this.setState({...this.state, cityWeather: data, finishedLoading: true}))
  // }
  getAllPlaylists = () => {
    const access_token = window.location.hash.split('=')[1].split('&')[0];
    // const refresh_token = window.location.hash.split('refresh_token=')[1];
    fetch(`http://localhost:5000/playlist?token=${access_token}`
      // , {
      // headers: {
      //   "Accept": "application/json",
      //   "Content-Type": "application/json",
      //   "Authorization": 'Bearer ' + access_token
      // }
      // }
    )
      .then(response => response.json())
      .then(data => {
        console.log('get all playlists', data)
        this.setState({ myPlaylist: data })
      });
  }

  getAllTracks = () => {
    const playlistId = '37i9dQZF1DWXfgo3OOonqa';

    const access_token = window.location.hash.split('=')[1].split('&')[0];
    // const refresh_token = window.location.hash.split('refresh_token=')[1];
    fetch(`http://localhost:5000/playlist/${playlistId}?token=${access_token}`
      // , {
      // headers: {
      //   "Accept": "application/json",
      //   "Content-Type": "application/json",
      //   "Authorization": 'Bearer ' + access_token
      // }
      // }
    )
      .then(response => response.json())
      .then(data => {
        console.log('we fetch', data)
        this.setState({ playlist: data })
      });

  }

  getSpecificId = (id) => {
    console.log('this is the id of a specific playlist', id);
    const access_token = window.location.hash.split('=')[1].split('&')[0];
    const refresh_token = window.location.hash.split('refresh_token=')[1];
    fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + access_token
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('selected PLAYLIST', data)
        this.setState({ selectedPlaylist: data.tracks.items }, () => {
          this.refs.audio.load();
        })
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello Quiz!</h1>
        <a href="http://localhost:5000/login">Click for login</a>
        <button onClick={this.getAllTracks}>Show Tracks</button>
        <button onClick={this.getAllPlaylists}>Show all playlists</button>
        {this.state.playlist.map((playlist, index) => {
          return <div key={index} onClick={() => this.getSpecificId(playlist.id)}>{playlist.name} {playlist.id}</div>
        })}
        {this.state.playlist.map((item, index) => {
          return <div key={index}>{item.track.name}
            <audio key={index} controls ref="audio" src={item.track.preview_url} type="audio/mpeg">

            </audio>
          </div>
        })}
        {this.state.myPlaylist.map((item, index) => {
          return <div key={index}>
            {item.name}
          </div>
        })}
      </div>
    );
  }
}

export default App;
