import React from 'react'
import { Link } from 'react-router-dom'

class Home extends React.Component {

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
            </div>
        )
    }
}

export default Home;
