import React, { Component } from 'react'
import { withRouter } from 'react-router';

class Waitingroom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
            // WE MUST STORE GAME MODES HERE SO START GAME
            // BUTTON REALIZEZ WHAT GAME SHOULD BE STARTED
        }
    }

    componentDidMount() {
        this.props.socket.on('roominfo', (data) => {
            console.log('This is the data from socket-listener of "roominfo" inside waitingroom.JS', data)
            this.setState({
                users: data
                // name of player
                // number of players
                // room id
                // score       
            })
        })
        this.props.socket.emit('getinfo')

        this.props.socket.on('game-started', (data) => {
            this.props.history.push('/GuessSong');
        })
    }

    startGame = (e) => {
        e.preventDefault();
        this.props.socket.emit('start-game', 'asd')
        this.props.history.push('/GuessSong');
    }

    render() {
        return (
            <div>
                <h2>This is the Waiting Room</h2>
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

                {this.state.users.find(user => this.props.socket.id === user.id)
                    ? <button onClick={this.startGame}>Start Game!</button>
                    : <p>Wait for the game to be started....</p>
                }
            </div>
        )
    }
}

export default withRouter(Waitingroom);
