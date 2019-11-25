import React, {Component} from 'react'

class DisplaySong extends Component {
    constructor(props){
        super(props)
        // questions, round, , , selectedAnswer, highlightAnswer
    }

    componentDidMount() {
        setTimeout(() => {
            
                this.props.isCorrectAnswer()
                    ? this.props.addPoint()
                    : this.props.incorrectAnswer()
                this.props.toggleIsPlaying();
            
        }, 5000);
    }

    render () {
        return (
            <div>
                <h2>Show the random tracks</h2>
                {
                     <div>
                        <h3>Round {this.props.round + 1}</h3>
                        <audio className="audio" src={this.props.questions[this.props.round].correct.preview} controls type="audio/mpeg" />

                        {this.props.questions[this.props.round].options.map(e =>
                            <p
                                onClick={() => this.props.highlightAnswer(e.preview)}
                                className={e.preview === this.props.selectedAnswer
                                    ? 'selected_answer'
                                    : ''}
                                key={e.preview}>{e.title}</p>
                        )}


                    </div>
                }

            </div>
        )
    }
}
export default DisplaySong;