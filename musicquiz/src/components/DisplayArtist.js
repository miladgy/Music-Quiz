import React, { Component } from 'react'
import Timer from './Timer'

class DisplayArtist extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.isCorrectAnswer()
                ? this.props.addPoint()
                : this.props.incorrectAnswer()
            this.props.toggleIsPlaying();
        }, 2000);
    }

    render() {
        return (
            <div>
                <h2>Show the random tracks</h2>
                {
                    <div>
                        <Timer />
                        <h3>Round {this.props.round + 1}</h3>
                        <audio className="audio" src={this.props.questions[this.props.round].correct.preview} controls type="audio/mpeg" />

                        {this.props.questions[this.props.round].options.map(e =>
                            <p
                                onClick={() => this.props.highlightAnswer(e.preview)}
                                className={e.preview === this.props.selectedAnswer
                                    ? 'selected_answer'
                                    : ''}
                                key={e.preview}>{e.artist}</p>
                        )}
                    </div>
                }
            </div>
        )
    }
}

export default DisplayArtist;
