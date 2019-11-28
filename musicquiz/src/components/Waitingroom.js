import React, { Component } from 'react'
import { withRouter } from 'react-router';

class Waitingroom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            gamemode: ''
        }
    }

    componentDidMount() {
        this.props.socket.on('roominfo', (data) => {
            this.setState(() => {
                const host = data.find(user => user.isHost)
                return {
                    users: data,
                    gamemode: host.gamemode
                }
            })
        })
        this.props.socket.emit('getinfo')
        this.props.socket.on('game-started', () => {
            this.props.history.push('/GameMode');
        })
    }

    startGame = (e) => {
        e.preventDefault();
        this.props.socket.emit('start-game')
        this.props.history.push('/GameMode');
    }

    beautifyGameMode = () => {
        switch (this.state.gamemode) {
            case 'DisplayArtist':
                return "Guess the Artist";
            case 'DisplaySong':
                return "Guess the Song";
            case 'DisplayLyrics':
                return "Guess the Lyrics";
        }
    }

    render() {
        return (
            <div className="waiting-room">
                <h2 className="waiting-room__header__h2 header__tag">Lobby</h2>
                <h3 className="waiting-room__header__h3 header__tag">Mode: </h3>
                <p className="paragraph waiting-room__paragraph">{this.beautifyGameMode()}</p>

                <h3 className="waiting-room__header__h3 header__tag">List of people joined</h3>
                <h4 className="waiting-room__header__h4 header__tag">Host:</h4>
                {this.state.users.filter(user => user.isHost).map(user =>
                    <p
                        className="paragraph waiting-room__paragraph waiting-room__paragraph-host"
                        key={user.id}>
                        {user.username}
                    </p>
                )}

                <h4 className="waiting-room__header__h4 header__tag">Player(s):</h4>
                {this.state.users.filter(user => !user.isHost).map(user =>
                    <p
                        className="paragraph waiting-room__paragraph waiting-room__paragraph-player"
                        key={user.id}>
                        {user.username}
                    </p>
                )}

                {this.state.users.find(user => this.props.socket.id === user.id && user.isHost)
                    ? <button
                        className="btn waiting-room__btn"
                        onClick={this.startGame}>Start Game!</button>
                    : <p className="paragraph waiting-room__paragraph waiting-room__paragraph-waiting">Wait for the game to be started....</p>
                }
            </div>
        )
    }
}

export default withRouter(Waitingroom);
