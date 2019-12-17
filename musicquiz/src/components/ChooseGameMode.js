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

    goToPlaylist = () => {
        this.props.socket.emit('set-gamemode', this.props.selectedGameMode)
        this.props.history.push('/Playlists')
    }

    beautifyGameMode = (gamemode) => {
        switch (gamemode) {
            case 'DisplayArtist':
                return "Guess the Artist";
            case 'DisplaySong':
                return "Guess the Song";
            case 'DisplayLyrics':
                return "Guess the Lyrics";
            default:
                break;
        }
    }

    render() {
        return (
            <div className="choose-gamemode">
                <h2 className="choose-gamemode__header__h2 header__tag">Choose your game mode</h2>
                {this.state.gamemodes.map(gamemode =>
                    <p
                        className={gamemode === this.props.selectedGameMode
                            ? 'choose-gamemode__paragraph-selected paragraph choose-gamemode__paragraph'
                            : 'paragraph choose-gamemode__paragraph'}
                        onClick={() => {
                            this.props.setSelectedGameMode(gamemode)
                        }

                        }>{this.beautifyGameMode(gamemode)}</p>
                )}

                <button onClick={() => this.props.history.goBack()} className="btn enter-name__form__btn-back" type="button">← BACK</button>
                <button className="btn choose-gamemode__btn"
                    type="submit"
                    onClick={this.goToPlaylist}
                    style={this.props.selectedGameMode === ''
                        ? { visibility: "hidden" }
                        : { visibility: "visible" }}>
                    CONTINUE
                </button>
            </div>
        )
    }
}

export default withRouter(ChooseGameMode);
