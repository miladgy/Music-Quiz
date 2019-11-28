import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ScoreTimer from './ScoreTimer'

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
            this.setState({
                users: data
            })
        })

        setTimeout(() => {
            this.props.toggleIsPlaying();
        }, 10000);
    }

    render() {
        return (
            <div className="current-score">
                <h2 className="current-score__header__h2 header__tag">Current scores</h2>
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
                        <div className="current-score__user">
                            <p className="current-score__user__username paragraph">
                                {user.username}:
                        </p>
                            <p className="current-score__user__score paragraph">
                                {user.score}
                            </p>
                        </div>
                    )
                })}
                <ScoreTimer />
            </div >
        )
    }
}

export default withRouter(CurrentScore);
