import React, { Component } from 'react'
import { withRouter } from 'react-router'

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
            // console.log('This is the data from socket-listener of "roominfo" inside waitingroom.JS', data)
            this.setState({
                users: data
            })

        })
        // this.props.socket.on('score-updated', (data) => {
        //     // console.log('score is updated here guessScore JS', data)
        // })

        // setTimeout(() => {
        //     // this.props.history.push('/GameMode');


        //     }, 9000);

        setTimeout(() => {
            this.props.toggleIsPlaying();
        }, 2000);
    }


    render() {
        return (
            <div className="current-score">
                <h2 className="current-score__header__h2">Current scores</h2>
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
            </div >
        )
    }
}

export default withRouter(CurrentScore);