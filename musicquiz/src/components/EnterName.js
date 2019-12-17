import React, { Component } from 'react'
import { withRouter } from 'react-router';

class EnterName extends Component {
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
                <h2 className="enter-name__header enter-name__header__h2 header__tag">Join as a host</h2>

                <form
                    className="enter-name__form"
                    onSubmit={this.submitName}>
                    <input
                        className="input enter-name__form__input"
                        type="text" placeholder="Enter your name" name="name" required />
                    <button className="btn enter-name__form__btn" type="submit">SUBMIT</button>
                </form>
                    <button onClick={() => this.props.history.push('/')} className="btn enter-name__form__btn-back" type="button">← BACK</button>
            </div>
        )
    }
}

export default withRouter(EnterName);
