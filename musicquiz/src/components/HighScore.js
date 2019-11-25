import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class HighScore extends Component {
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
    }

    // Score
    // Title - artist
    // Link to play quiz again
    // Link to playlist


    render() {
        return (
            <div>
                <h2>HighScore</h2>
                <h3>{this.state.users.map(user => {
                    return (<p>{user.username}: {user.score}</p>
                    )
                })}</h3>

                <h2>Title and Artist</h2>
                {this.props.questions.map(question => {
                return (<p>{question.correct.title}, by {question.correct.artist}</p>)
                })}
                <p>Songs were generated from the following playlist: 
                <a href={`https://open.spotify.com/playlist/${this.props.selectedPlaylistId}`} target="_blank">Follow the playlist!</a>
                </p>
            <Link to="/">Play again</Link>
                

            </div >
        )
    }
}

export default HighScore;