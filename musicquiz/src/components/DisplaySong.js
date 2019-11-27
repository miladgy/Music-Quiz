import React, { Component } from 'react'
import Timer from './Timer'

class DisplaySong extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.highlightAnswer('')
        setTimeout(() => {
            this.props.isCorrectAnswer()
                ? this.props.addPoint()
                : this.props.incorrectAnswer()
            this.props.toggleIsPlaying();
        }, 2000);
    }

    render() {
        return (
            <div className="display-song">
                <h2 className="display-song__header__h2">What song is playing?</h2>
                <Timer />
                <h3 className="display-song__header__h3">Round {this.props.round + 1}</h3>
                <audio className="audio" src={this.props.questions[this.props.round].correct.preview} controls type="audio/mpeg" />
                <div className="display-song__options">
                    {this.props.questions[this.props.round].options.map(e =>
                        <p
                            onClick={() => this.props.highlightAnswer(e.preview)}
                            className={e.preview === this.props.selectedAnswer
                                ? 'display-song__paragraph-selected display-song__paragraph'
                                : 'display-song__paragraph'}
                            key={e.preview}>{e.title}</p>
                    )}
                </div>
            </div>
        )
    }
}

export default DisplaySong;
