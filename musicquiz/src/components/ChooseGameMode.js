import React, { Component } from 'react'
import { withRouter } from 'react-router'

class ChooseGameMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            gamemodes: ['DisplaySong', 'DisplayArtist', 'DisplayLyrics']
        }
    }

    componentDidMount() {

    }


    render() {
        return (
            <div>
                <h2>Choose your game mode</h2>
        {this.state.gamemodes.map(gamemode => 
            <p onClick={() => this.props.setSelectedGameMode(gamemode)}>{gamemode}</p>
        )}
            </div >
        )
    }
}

export default withRouter(ChooseGameMode);