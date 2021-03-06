import React, { Component } from 'react'
import { withRouter } from 'react-router'
import CurrentScore from './CurrentScore'
import DisplaySong from './DisplaySong'
import DisplayArtist from './DisplayArtist'
import HighScore from './HighScore'

console.log('test')

class GameMode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinner: 'Loading...',
            finishedLoading: false,
            playlist: [],
            selectedPlaylist: [],
            questions: [],
            counter: 0,
            round: 0,
            isGameOver: false,
            users: [],
            selectedAnswer: '',
            isPlaying: true,
            gamemode: ''
        }
    }

    getRandom = () => {
        const selectedPlaylist = this.props.selectedPlaylistId;

        fetch(`/random/${selectedPlaylist}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ questions: data, finishedLoading: true })
                this.props.socket.emit('questions', data)
            })
            .catch(err => console.log(err))
    }

    addPoint = () => {
        if (this.state.round < 5) {
            this.props.socket.emit('update-score', this.state.counter + 1)
            this.setState((prevState) => ({ counter: prevState.counter + 1, round: prevState.round + 1 }))
        } else {
            this.props.socket.emit('update-score', this.state.counter + 1)
            this.setState((prevState) => ({ counter: prevState.counter + 1, round: prevState.round + 1, isGameOver: true }))
        }
    }

    incorrectAnswer = () => {
        if (this.state.round < 5) {
            this.props.socket.emit('update-score', this.state.counter)
            this.setState((prevState) => ({ round: prevState.round + 1 }))
            // this.props.history.push('/CurrentScore');
        } else {
            this.setState((prevState) => ({ round: prevState.round + 1, isGameOver: true }))
            // this.props.history.push('/HighScore');
        }
    }

    highlightAnswer = (preview) => {
        this.setState({ selectedAnswer: preview })
    }

    isCorrectAnswer = () => {
        return this.state.selectedAnswer === this.state.questions[this.state.round].correct.preview ? true : false
    }

    toggleIsPlaying = () => {
        this.setState((prevState) => ({ isPlaying: !prevState.isPlaying }))
    }

    renderGameMode(gamemode) {
        switch (gamemode) {
            case 'DisplayArtist':
                return <DisplayArtist
                    questions={this.state.questions}
                    round={this.state.round}
                    selectedAnswer={this.state.selectedAnswer}
                    highlightAnswer={this.highlightAnswer}
                    isCorrectAnswer={this.isCorrectAnswer}
                    addPoint={this.addPoint}
                    incorrectAnswer={this.incorrectAnswer}
                    isPlaying={this.state.isPlaying}
                    isGameOver={this.state.isGameOver}
                    toggleIsPlaying={this.toggleIsPlaying}
                />
            case 'DisplaySong':
                return <DisplaySong
                    questions={this.state.questions}
                    round={this.state.round}
                    selectedAnswer={this.state.selectedAnswer}
                    highlightAnswer={this.highlightAnswer}
                    isCorrectAnswer={this.isCorrectAnswer}
                    addPoint={this.addPoint}
                    incorrectAnswer={this.incorrectAnswer}
                    isPlaying={this.state.isPlaying}
                    isGameOver={this.state.isGameOver}
                    toggleIsPlaying={this.toggleIsPlaying}
                />
            default:
                return 'game mode not accessible';
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
                    gamemode: host.gamemode
                }
            })
            this.state.users.find(user => this.props.socket.id === user.id && user.isHost && this.state.round === 0)
                ? this.getRandom()
                : this.props.socket.on('question', (data) => {
                    this.setState({ questions: data, finishedLoading: true })
                })
        })
    }

    render() {
        return (
            <div className="gamemode">
                {this.state.finishedLoading && !this.state.isGameOver

                    ? this.state.isPlaying
                        ? this.renderGameMode(this.state.gamemode)
                        : <CurrentScore
                            toggleIsPlaying={this.toggleIsPlaying}
                            socket={this.props.socket} />

                    : this.state.isGameOver
                        ? <HighScore
                            selectedPlaylistId={this.props.selectedPlaylistId}
                            socket={this.props.socket}
                            questions={this.state.questions}
                        />
                        : this.state.spinner
                }
            </div>
        )
    }
}

export default withRouter(GameMode)
