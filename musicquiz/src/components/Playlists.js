import React, { Component } from 'react'
import { withRouter } from 'react-router';


class Playlists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlaylists: [],
            access_token: '',
            selectedPlaylistId: ''
        }
    }

    getAllPlaylists = () => {
        fetch('/playlist')
        .then(response => response.json())
        .then(data => {
            console.table(data)
            this.setState({ myPlaylists: data})
        })

        
        // const access_token = this.props.access_token
        
        // const refresh_token = window.location.hash.split('refresh_token=')[1];
        // fetch(`http://localhost:5000/playlist?token=${access_token}`
        //     // , {
        //     // headers: {
        //     //   "Accept": "application/json",
        //     //   "Content-Type": "application/json",
        //     //   "Authorization": 'Bearer ' + access_token
        //     // }
        //     // }
        // )
        // fetch(`http://localhost:5000/playlist`)
        //     .then(response => response)
        //     .then(data => {
        //         console.log('get all playlists', data)
        //         // this.setState({ myPlaylists: data, /* access_token: access_token */ })
        //     })
        //     .catch(error => console.log(error))
    }
    getSpecificPlaylistId = (id) => {
        // const access_token = this.props.access_token
        this.setState({ selectedPlaylistId: id })
        this.props.setSelectedPlaylist(id)
        // WHATS BELOW MIGHT BE OK TO DELETE
        // fetch(`http://localhost:5000/random/${id}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('from random endpoint', data)
        //     })
        //     .catch(error => console.log(error))


    }

    connectToRoom = () => {
        this.props.socket.emit('set-playlist', this.state.selectedPlaylistId)
        this.props.history.push('/Waitingroom')
    }

    componentDidMount() {
        // const access_token = window.location.hash.split('=')[1].split('&')[0];
        // this.props.setToken(access_token)
        this.getAllPlaylists()
    }

    render() {
        return (
            <div>
                {/* <button on={this.getAllPlaylists}>Show all playlists</button> */}
                {this.state.myPlaylists.map((item, index) => {

                    return <div key={index}>
                        <p className={item.id === this.state.selectedPlaylistId
                            ? 'selected_playlist'
                            : ''}
                            onClick={() => this.getSpecificPlaylistId(item.id)}>
                            {item.name}
                        </p>
                    </div>
                })}
                <button className="selected_playlist_btn"
                    type="submit"
                    onClick={this.connectToRoom}
                    style={this.state.selectedPlaylistId === ''
                        ? { visibility: "hidden" }
                        : { visibility: "visible" }}>
                    Next(Waiting room)
                </button>
            </div>
        )
    }
}

export default withRouter(Playlists);
