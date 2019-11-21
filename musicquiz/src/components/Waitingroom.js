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

    }
    startGame = (e) => {
        e.preventDefault();
        this.props.history.push('/GuessSong')
    }

    render() {
        return (
            <div>
                <p>This is the Waiting Room</p>
                <p>List of people joined</p>
                {this.state.users.map(user => <h4>{user}</h4>)}
                <button onClick={this.startGame} >Start Game!</button>


            </div>
        )
    }
}
export default withRouter(Waitingroom);
