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
        this.props.setSelectedGameMode('')

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
            <div className="choose-gamemode">
                <h2 className="choose-gamemode__header__h2">Choose your game mode</h2>
                {this.state.gamemodes.map(gamemode =>
                    <p 
                    className={gamemode === this.props.selectedGameMode
                    ? 'choose-gamemode__paragraph-selected paragraph choose-gamemode__paragraph'
                    : 'paragraph choose-gamemode__paragraph'}
                    onClick={() => {
                        this.props.setSelectedGameMode(gamemode)
                    }
                    
                    }>{gamemode}</p>
                )}


                <button className="btn choose-gamemode__btn"
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