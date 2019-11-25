import React, { Component } from 'react'
import { withRouter } from 'react-router'
import CurrentScore from './CurrentScore'
import DisplaySong from './DisplaySong'
import HighScore from './HighScore'

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

    toggleIsPlaying = () => {
        this.setState((prevState) => ({ isPlaying: !prevState.isPlaying }))
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

        //  const timer = setInterval(() => {
        //     if (this.state.isPlaying) {
        //         this.isCorrectAnswer()
        //             ? this.addPoint()
        //             : this.incorrectAnswer()
        //         this.setState({ isPlaying: false })
        //     } else {
        //         this.setState({ isPlaying: true })
        //     }
        //     if(this.state.isGameOver) {
        //         clearInterval(timer);
        //     }
        // }, 10000);

        // if (this.state.round < 5) {
        //     if (this.state.isPlaying) {
        //         setInterval(() => {
        //         this.isCorrectAnswer()
        //             ? this.addPoint()
        //             : this.incorrectAnswer()
        //         this.setState({ isPlaying: false })
        //         }, 5000)
        //     } else {
        //         setTimeout(() => {
        //         this.setState({ isPlaying: true })
        //         }, 2000)
        //     }
        // }

        // const timer = setInterval(() => {
        //     if (this.state.isPlaying) {
        //         this.isCorrectAnswer()
        //             ? this.addPoint()
        //             : this.incorrectAnswer()
        //         this.setState({ isPlaying: false })
        //     } else {
        //         this.setState({ isPlaying: true })
        //     }
        //     if(this.state.isGameOver) {
        //         clearInterval(timer);
        //     }
        // }, 10000);


        // setInterval(() => {
        //     if (this.state.isPlaying) {
        //         this.isCorrectAnswer()
        //             ? this.addPoint()
        //             : this.incorrectAnswer()
        //         this.setState({ isPlaying: false })
        //     } else {
        //         this.setState({ isPlaying: true })
        //     }
        // }, 3000);

        // this.props.socket.on('question', data)

        // this.props.socket.on('question', (data) => {
        //     console.log('Socket-listener on "questions" sending questions from the server in GuessSong.js', data)
        // })
    }

    render() {
        return (

            <div>
                {this.state.finishedLoading && !this.state.isGameOver

                    ? this.state.isPlaying
                        ? <DisplaySong 
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
                        : <CurrentScore 
                        toggleIsPlaying={this.toggleIsPlaying}
                        socket={this.props.socket} />

                    : this.state.isGameOver
                    ? <HighScore 
                    socket={this.props.socket}
                    />
                         // ? <div>Your score is: {this.state.counter}</div>
                        : this.state.spinner
                }
            </div>
        )
    }
}

export default withRouter(GuessSong)
