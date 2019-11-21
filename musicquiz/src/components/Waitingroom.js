import React from 'react'
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:5000');

//   socket.emit('addClient', 'playerMilad from waiting room');

class Waitingroom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
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

    render() {
        return (
            <div>
                <p>This is the Waiting Room</p>
                <p>List of people joined</p>
                {this.state.users.map(user => <h4>{user}</h4>)}
                <button>Start Game!</button>


            </div>
        )
    }
}
export default Waitingroom;
