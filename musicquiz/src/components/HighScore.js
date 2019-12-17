import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class HighScore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            playlist: '',
            imageURL: ''
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
                    playlist: host.playlist,
                    imageURL: host.imageURL
                }
            })
        })
    }

    // kickEmOut = () => {
    //     this.props.socket.emit('kickEmOut')
    //     // setTimeout(() => this.props.socket.destroy(), 0)
    // }

    render() {
        return (
            <div className="high-score">
                <h2 className="high-score__header__h2 header__tag">HighScore</h2>
                {this.state.users.sort((a, b) => {
                    if (a.score > b.score) {
                        return -1
                    }
                    if (a.score < b.score) {
                        return 1
                    }
                    return 0
                }).map(user => {
                    return (
                        <div className="high-score__user">
                            <p className="high-score__user__username paragraph">{user.username}:</p>
                            <p className="high-score__user__score paragraph">{user.score}</p>
                        </div>
                    )
                })}

                <div className="high-score__summary">
                    <h2 className="high-score__summary__header__h2 header__tag">Title and Artist</h2>
                    {this.props.questions.map(question => {
                        return (
                            <div className="high-score__summary__content">
                                <p className="high-score__summary__content__title paragraph">{question.correct.title}</p>
                                <p className="high-score__summary__content__artist paragraph"> {question.correct.artist}</p>
                            </div>)
                    })}
                    <p className="high-score__summary__playlist paragraph">Songs were generated from:
                    </p>
                    <a className="high-score__btn__spotify"
                        href={`https://open.spotify.com/playlist/${this.state.playlist}`} target="_blank" rel="noopener noreferrer">
                        <img className="playlists__container__paragraph__thumbnail" src={this.state.imageURL} alt="a thumbnail for the playlist which the questions you played were generated" />
                        <p className="high-score__btn__spotify__paragraph paragraph">This Playlist!</p>
                    </a>
                    <Link className="btn high-score__btn__play-again" to="/">PLAY AGAIN</Link>
                </div>
            </div>
        )
    }
}

export default HighScore;
