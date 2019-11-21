import React, { Component, Fragment } from 'react'
import openSocket from 'socket.io-client';
import { withRouter } from 'react-router';
const socket = openSocket('http://localhost:5000');

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
        socket.emit('addClient', e.target.elements.name.value);
        console.log(e.target.elements.name.value, 'this is the target');
        this.props.history.push('/Playlists')
    }
    render() {

        return (
            <Fragment>
                <div>
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