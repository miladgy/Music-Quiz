import React, { Component } from 'react'

class CurrentScore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.props.socket.emit('getinfo')
        this.props.socket.on('roominfo', (data) => {
            console.log('This is the data from socket-listener of "roominfo" inside waitingroom.JS', data)
            this.setState({
                users: data
            })
            
        })
        this.props.socket.on('score-updated')
    }


    render() {
        return (
            <div>
                <h2>sexy current scores</h2>
            <h3>{this.state.users.map(user => {
            return (<p>{user.username}: {user.score}</p>
                    
                    )})}</h3>

            </div >
        )
    }
}

export default CurrentScore;