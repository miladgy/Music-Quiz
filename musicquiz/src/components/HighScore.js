import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class HighScore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            playlist: ''
        }
    }

    componentDidMount() {
        this.props.socket.emit('getinfo')
        this.props.socket.on('roominfo', (data) => {
            this.setState(() => {
                console.log('this is the host', data[0])
                const host = data.find(user => user.isHost)
                return {
                    users: data,
                    playlist: host.playlist
                }
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
                <h3>{this.state.users.sort((a, b) => {
                    if (a.score > b.score) {
                        return -1
                    }
                    if (a.score < b.score) {
                        return 1
                    }
                    return 0
                }).map(user => {
                    return (<p>{user.username}: {user.score}</p>
                    )
                })}</h3>

                <h2>Title and Artist</h2>
                {this.props.questions.map(question => {
                return (<p>{question.correct.title}, by {question.correct.artist}</p>)
                })}
                <p>Songs were generated from the following playlist: 
                <a href={`https://open.spotify.com/playlist/${this.state.playlist}`} target="_blank">Follow the playlist!</a>
                </p>
            <Link to="/">Play again</Link>
                

            </div >
        )
    }
}

export default HighScore;