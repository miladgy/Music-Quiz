import React from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'

class Home extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {

        return (
            <div>
                <nav className="app__navigator">
                    <button className="app__link app__link__join__player btn"><Link
                        className="app__link"
                        to="/Join"><span>Join a game as player</span></Link></button>
                    <button className="app__link app__link__join__host btn"><Link
                        className="app__link"
                        to="/login"><span>Log in with Spotify(Host)!</span></Link></button>
                </nav>
            </div>
        )
    }
}

export default Home;
