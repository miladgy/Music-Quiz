import React, { Component, Fragment } from 'react'
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
        console.log(e.target.elements.name.value, ' is the HOST');
        this.props.history.push('/Playlists')
    }



    render() {
        return (
            <Fragment>
                <div>
                    <h1>Join as a host</h1>
                    <form onSubmit={this.submitName}>
                        <input type="text" placeholder="Enter your name" name="name" />
                        <button type="submit">Submit name!</button>
                    </form>
                </div>
            </Fragment>
        )
    }
}
export default withRouter(EnterName);