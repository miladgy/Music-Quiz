import React, { Component } from 'react'
import Timer from './Timer'

class DisplayArtist extends Component {
    componentDidMount() {
        this.props.highlightAnswer('')
        setTimeout(() => {
            this.props.isCorrectAnswer()
                ? this.props.addPoint()
                : this.props.incorrectAnswer()
            this.props.toggleIsPlaying();
        }, 20000);
    }

    render() {
        return (
            <div className="display-artist">
                <h2 className="display-artist__header__h2 header__tag">Who is the artist?</h2>
                <Timer />
                <h3 className="display-artist__header__h3 header__tag">Round {this.props.round + 1}</h3>
                <audio className="audio" src={this.props.questions[this.props.round].correct.preview} controls type="audio/mpeg" />
                <div className="display-artist__options">
                    {this.props.questions[this.props.round].options.map(e =>
                        <p
                            onClick={() => this.props.highlightAnswer(e.preview)}
                            className={e.preview === this.props.selectedAnswer
                                ? 'display-artist__paragraph-selected display-artist__paragraph'
                                : 'display-artist__paragraph'}
                            key={e.preview}>{e.artist}</p>
                    )}
                </div>
            </div>
        )
    }
}

export default DisplayArtist;
