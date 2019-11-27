import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class Join extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //Something to be populated here?s
        }
    }

    submitName = (e) => {
        e.preventDefault();
        this.props.socket.emit('join-game-as-player', e.target.elements.name.value);
        console.log(e.target.elements.name.value, ' is the player');
        this.props.history.push('/Waitingroom')
    }

    render() {
        return (
            <div className="join">
                <h2 className="join__header join__header__h2">Join as a player</h2>
                
                <form 
                className="join__form"
                onSubmit={this.submitName}>
                    <input 
                    className="input join__form__input"
                    type="text" placeholder="Enter your name" name="name" />
                    <button className="btn join__form__btn" type="submit"> Submit name! </button>
                </form>
            </div>
        )
    }
}

export default withRouter(Join)
