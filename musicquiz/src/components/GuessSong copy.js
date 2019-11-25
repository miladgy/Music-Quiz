import React, { Component } from 'react'
import {withRouter} from 'react-router'
import CurrentScore from './CurrentScore'

class GuessSong extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinner: 'Loading...',
            finishedLoading: false,
            playlist: [],
            selectedPlaylist: [],
            myPlaylist: [],
            questions: [],
            counter: 0,
            round: 0,
            isGameOver: false,
            access_token: '',
            users: [],
            selectedAnswer: '',
            differentAnswers: [],
            isPlaying: true
        }
    }

    getRandom = () => {
        const playlistId = '37i9dQZF1DWXfgo3OOonqa';
        fetch(`/random/${playlistId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({ questions: data, finishedLoading: true })
                this.props.socket.emit('questions', data)
            })
    }

    // getRandom = () => {
    //     const playlistId = '37i9dQZF1DWXfgo3OOonqa';
    //     const access_token = this.props.access_token;

    //     fetch(`http://localhost:5000/random/${playlistId}?token=${access_token}`
    //     )
    //         .then(response => response.json())
    //         .then(data => {
    //             // const correctTitle = data[0].correct.title;
    //             // const incorrectTitle1 = data[0].incorrect[0].title;
    //             // const incorrectTitle2 = data[0].incorrect[1].title;
    //             // const incorrectTitle3 = data[0].incorrect[2].title;

    //             this.setState({ questions: data, finishedLoading: true })

    //             this.props.socket.emit('questions', data)
    //         })
    // }

    // getSpecificId = (id) => {
    //     const access_token = window.location.hash.split('=')[1].split('&')[0];
    //     fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    //         headers: {
    //             "Accept": "application/json",
    //             "Content-Type": "application/json",
    //             "Authorization": 'Bearer ' + access_token
    //         }
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             this.setState({ selectedPlaylist: data.tracks.items }, () => {
    //                 this.refs.audio.load();
    //             })
    //         });
    // }

    addPoint = () => {
        if (this.state.round < 5) {
            this.props.socket.emit('update-score', this.state.counter + 1)
            this.setState((prevState) => ({ counter: prevState.counter + 1, round: prevState.round + 1 }))
            console.log('do we get in here in add point')
            // this.props.history.push('/CurrentScore');
            console.log('HISTORY PUSH FROM 76 in GUESSONG')
        } else {
            this.setState((prevState) => ({ counter: prevState.counter + 1, round: prevState.round + 1, isGameOver: true }))
            // this.props.history.push('/HighScore');

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

    componentDidMount() {
        // this.getRandom();
        this.props.socket.emit('getinfo')
        this.props.socket.on('roominfo', (data) => {
            // console.log('This is the data from socket-listener of "roominfo" inside waitingroom.JS', data)
            this.setState({
                users: data
            })
            this.state.users.find(user => this.props.socket.id === user.id && user.isHost && this.state.round === 0)
                ? this.getRandom()
                : this.props.socket.on('question', (data) => {
                    this.setState({ questions: data, finishedLoading: true })
                })
        })
        setInterval(() => {
            if(this.state.isPlaying) {
                this.isCorrectAnswer()
                ? this.addPoint() 
                : this.incorrectAnswer()
                this.setState({isPlaying: false})
            } else {
                this.setState({isPlaying: true})
            }
        }, 8000);

        // this.props.socket.on('question', data)

        // this.props.socket.on('question', (data) => {
        //     console.log('Socket-listener on "questions" sending questions from the server in GuessSong.js', data)
        // })
    }

    render() {
        return (
            <div>
                {/* <button onClick={this.getRandom}>Show random</button> */}

                {/* {this.state.playlist.map((playlist, index) => {
                    return <div key={index} onClick={() => this.getSpecificId(playlist.id)}>{playlist.name} {playlist.id}</div>
                })} */}

                {/* show tracks */}

                {/* show random */}
                {/* onClick={this.incorrectAnswer}*/}
                {/* onClick={this.addPoint}*/}
                <h2>Show the random tracks</h2>
                {this.state.finishedLoading && !this.state.isGameOver
                    ? <div>
                        <h3>Round {this.state.round + 1}</h3>
                        <audio className="audio" src={this.state.questions[this.state.round].correct.preview} controls type="audio/mpeg" />
                        {/* {this.shuffleAnswers([this.state.questions[this.state.round].correct.title, this.state.questions[this.state.round].incorrect[0].title, this.state.questions[this.state.round].incorrect[1].title, this.state.questions[this.state.round].incorrect[2].title])
                    .map(e => <p>{e}</p>)
                    } */}
                        {/* {this.shuffleAnswers(this.state.questions[this.state.round].correct.title, this.state.questions[this.state.round].incorrect[0].title, this.state.questions[this.state.round].incorrect[1].title, this.state.questions[this.state.round].incorrect[2].title)
                    .map(e => <p>{e}</p>)
                    } */}

                        {/* <p className={this.state.questions[this.state.round].correct.preview === this.state.selectedAnswer
                            ? 'selected_answer'
                            : ''}
                            onClick={() => this.highlightAnswer(this.state.questions[this.state.round].correct.preview)}>
                            {this.state.questions[this.state.round].correct.title}
                        </p>
                        
                        {this.state.questions[this.state.round].incorrect.map(e =>
                            <p
                                onClick={() => this.highlightAnswer(e.preview)}
                                className={e.preview === this.state.selectedAnswer
                                    ? 'selected_answer'
                                    : ''}
                                key={e.preview}>{e.title}</p>
                        )} */}

                        {this.state.questions[this.state.round].options.map(e =>
                            <p
                                onClick={() => this.highlightAnswer(e.preview)}
                                className={e.preview === this.state.selectedAnswer
                                    ? 'selected_answer'
                                    : ''}
                                key={e.preview}>{e.title}</p>
                        )}

                                {!this.state.isPlaying && <CurrentScore socket = {this.props.socket}/> }
                        </div>
                    : this.state.isGameOver
                         ? // <CurrentScore />
                        <div>Your score is: {this.state.counter}</div>
                        : this.state.spinner
                }

            </div>
        )
    }
}

export default withRouter(GuessSong)
