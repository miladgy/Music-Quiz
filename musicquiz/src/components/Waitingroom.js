import React, { Component } from 'react'
import { withRouter } from 'react-router';

class Waitingroom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            gamemode: ''
            // WE MUST STORE GAME MODES HERE SO START GAME
            // BUTTON REALIZEZ WHAT GAME SHOULD BE STARTED
        }
    }

    componentDidMount() {
        this.props.socket.on('roominfo', (data) => {
            console.log('This is the data from socket-listener of "roominfo" inside waitingroom.JS', data)
            this.setState(() => {
                console.log('this is the host', data[0])
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
            <div>
                <h2>This is the Waiting Room</h2>
        <h3>Mode: {this.beautifyGameMode()}</h3>
                <h3>List of people joined</h3>

                <h4>Host:</h4>
                {this.state.users.filter(user => user.isHost).map(user =>
                    <p key={user.id}>
                        {user.username}
                    </p>
                )}

                <h4>Player(s):</h4>
                {this.state.users.filter(user => !user.isHost).map(user =>
                    <p key={user.id}>
                        {user.username}
                    </p>
                )}

                {this.state.users.find(user => this.props.socket.id === user.id && user.isHost)
                    ? <button onClick={this.startGame}>Start Game!</button>
                    : <p>Wait for the game to be started....</p>
                }
            </div>
        )
    }
}

export default withRouter(Waitingroom);
