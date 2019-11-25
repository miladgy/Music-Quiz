import React, { Component } from 'react'

class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            percentage: 100

        }
        // this.nextStep = this.nextStep.bind(this)
    }

    componentDidMount() {
        setInterval(() => {
            if (this.state.percentage === 0) return
            this.setState(prevState => ({ percentage: prevState.percentage - 0.150 }))
        }, 35);
    }

    render() {
        return (
            <div>
                <h2> A React Progress Bar </h2>
                <ProgressBar percentage={this.state.percentage} />

            </div>
        )
    }
}

const ProgressBar = (props) => {
    return (
        <div className="progress-bar">
            <Filler percentage={props.percentage} />
        </div>
    )
}

const Filler = (props) => {
    return <div className="filler" style={{ width: `${props.percentage}%` }} />
}

export default Timer
