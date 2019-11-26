import React, { Component } from 'react'
import { withRouter } from 'react-router';

class EnterName extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const access_token = window.location.hash.split('=')[1].split('&')[0];
        this.props.setToken(access_token)
    }

    submitName = (e) => {
        e.preventDefault();
        this.props.socket.emit('join-game-as-host', e.target.elements.name.value);
        // this.props.history.push('/Playlists')
        this.props.history.push('/ChooseGameMode')
    }

    render() {
        return (
            <div className="enter-name">
                <h2 className="enter-name__header enter-name__header__h2 ">Join as a host</h2>
                
                <form onSubmit={this.submitName}>
                    <input 
                    className="input enter-name__input"
                    type="text" placeholder="Enter your name" name="name" />
                    <button className="btn enter-name__btn" type="submit">Submit name!</button>
                </form>
            </div>
        )
    }
}

export default withRouter(EnterName);
