import React from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'


class Home extends React.Component {
    constructor(props){
        super(props)
        
    }
    render () {

        return (
            <div>
                <nav className="app__navigator">
            {/* <p><Link to="/EnterName">Join as host</Link></p>
            <p><Link to="/Waitingroom">waitingroom carter</Link></p>
            <p><Link to="/CurrentScore">Current score</Link></p>
            <p><Link to="/ChooseGameMode"> CHOOSE Game Mode!!</Link></p>
            <p><Link to="/GameMode">Game Mode</Link></p> */}
            <button className="app__link app__link__join__player btn"><Link
            className="app__link"
            to="/Join"><span>Join a game as player</span></Link></button>
            {/* <p><Link to={!this.state.access_token ? "/login" : `/Gamemodes/#access_token=${this.state.access_token}`}>Game Modes!</Link></p> */}
            <button className="app__link app__link__join__host btn"><Link
            className="app__link"
            to="/login"><span>Log in with Spotify(Host)!</span></Link></button>
          </nav>
            </div>
        )
    }
}
export default Home;