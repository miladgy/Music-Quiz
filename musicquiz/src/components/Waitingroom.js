import React from 'react'
import { withRouter } from 'react-router';


class Waitingroom extends React.Component {
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
            console.log('This is the data from socket inside waitingroom.JS', data)
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
                <p>This is the Waiting Room</p>
                <p>List of people joined</p>
        {this.state.users.map(user => 
        <div><h3>{user.isHost ? 'Host' : 'Player '}</h3>
        <h4>{user.username}</h4></div>)}
    
        {this.state.users.find(user => {
            console.log(user)
        return user.isHost })? 
        <button onClick={this.startGame} >Start Game!</button>
        : 'Wait for the game to be started....'
        }


            </div>
        )
    }
}
export default withRouter(Waitingroom);
