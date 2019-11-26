import React, { Component } from 'react'
import { withRouter } from 'react-router'

class ChooseGameMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            gamemodes: ['DisplaySong', 'DisplayArtist', 'DisplayLyrics'],
        }
    }

    componentDidMount() {

    }

    // {this.state.gamemodes.map(gamemode =>
    //     <p 
        
    //     onClick={() => this.props.setSelectedGameMode(gamemode)}>{gamemode}</p>
    
    // )}
    goToPlaylist = () => {
        this.props.socket.emit('set-gamemode', this.props.selectedGameMode)
        this.props.history.push('/Playlists')
    }


    render() {
        return (
            <div>
                <h2>Choose your game mode</h2>
                {this.state.gamemodes.map(gamemode =>
                    <p 
                    className={gamemode === this.props.selectedGameMode
                    ? 'selected_gamemode'
                    : ''}
                    onClick={() => {
                        this.props.setSelectedGameMode(gamemode)
                    }
                    
                    }>{gamemode}</p>
                )}


                <button className="selected_gamemode_btn"
                    type="submit"
                    onClick={this.goToPlaylist}
                    style={this.props.selectedGameMode === ''
                        ? { visibility: "hidden" }
                        : { visibility: "visible" }}>
                    Next(Choose your playlist)
                </button>
            </div >
        )
    }
}

export default withRouter(ChooseGameMode);