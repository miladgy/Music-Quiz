import React from 'react'
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

class EnterName extends React.Component {
    constructor(props){
        super(props)
        
    }
    submitName = (e) => {
        e.preventDefault();
        socket.emit('addClient', e.target.elements.name.value);
        console.log(e.target.elements.name.value, 'this is the target');
      }
    render () {

        return (
            <div>
        <form onSubmit={this.submitName}>
          <input type="text" placeholder="Enter your name" name="name" />
          <button type="submit">Submit name!</button>
        </form>
      </div>
        )
    }
}
export default EnterName;