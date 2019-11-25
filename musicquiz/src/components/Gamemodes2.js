import React, { Component } from 'react'

class Gamemodes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinner: 'Loading...',
            finishedLoading: false,
            playlist: [],
            selectedPlaylist: [],
            myPlaylist: [],
            questions: [],
            counter: 0,
            round: 0,
            isGameOver: false,
            access_token: ''
        }
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
                console.log('response back from fetching all tracks from specific playlist in Gamemodes.js', data)
                this.setState({ playlist: data, finishedLoading: true })
            });
    }

    render() {
        return (
            <div>
                <button onClick={this.getAllTracks}>Show Tracks</button>
            </div>
        )
    }
}

export default Gamemodes;