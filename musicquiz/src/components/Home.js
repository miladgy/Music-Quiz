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
                        to="/Join">JOIN AS PLAYER</Link></button>
                    <button className="app__link app__link__join__host btn"><Link
                        className="app__link"
                        to="/login">JOIN AS HOST (WITH SPOTIFY)</Link></button>
                </nav>
                <p>Read more</p>
            </div>
        )
    }
}

export default Home;
