import React, { Component } from 'react'
import { withRouter } from 'react-router';

class Playlists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlaylists: [],
            access_token: '',
            selectedPlaylistId: '',
            imageURL: ''
        }
    }

    getAllPlaylists = () => {
        fetch('/playlist')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({ myPlaylists: data})
        })
    }
    
    getSpecificPlaylistId = (data) => {
        const imageURL = data.images[1] ? data.images[1].url : 'https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png'
        const {id} = data
        this.setState({ selectedPlaylistId: id, imageURL})
        this.props.setSelectedPlaylist(id)
    }

    connectToRoom = () => {
        this.props.socket.emit('set-playlist', {selectedPlaylistId: this.state.selectedPlaylistId, imageURL: this.state.imageURL})
        this.props.history.push('/Waitingroom')
    }

    componentDidMount() {
        this.getAllPlaylists()
    }

    render() {
        return (
            <div className="playlists">
            <h2 className="playlists__header__h2">Quizzify your spotify playlists:</h2>

                {this.state.myPlaylists.map((item, index) => {
                    
                    return <div 
                    className="playlists__container"
                    key={index}>
                        <section className={item.id === this.state.selectedPlaylistId
                            ? 'playlists__container__paragraph-selected paragraph playlists__container__paragraph'
                            : 'paragraph playlists__container__paragraph'}
                            onClick={() => this.getSpecificPlaylistId(item)}>
                            <img 
                            className="playlists__container__paragraph__thumbnail"
                            src={item.images[1] ? item.images[1].url : 'https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png'} />
                            <p className="playlists__container__paragraph__playlistname">{item.name}</p>
                        </section>
                    </div>
                })}
                <button className="btn playlists__btn"
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
