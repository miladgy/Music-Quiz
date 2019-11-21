import React from 'react'

class Playlists extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            myPlaylists: [],
            access_token: '',
            selectedPlaylistId: ''
          }
    }
    getAllPlaylists = () => {
        const access_token = this.props.access_token
        // const refresh_token = window.location.hash.split('refresh_token=')[1];
        fetch(`http://localhost:5000/playlist?token=${access_token}`
          // , {
          // headers: {
          //   "Accept": "application/json",
          //   "Content-Type": "application/json",
          //   "Authorization": 'Bearer ' + access_token
          // }
          // }
        )
          .then(response => response.json())
          .then(data => {
            console.log('get all playlists', data)
            this.setState({ myPlaylists: data, access_token: access_token })
          });
      }
      getSpecificPlaylistId = (id) => {
        const access_token = this.props.access_token
        this.setState({ selectedPlaylistId: id })
        fetch(`http://localhost:5000/random/${id}?token=${access_token}`)
        .then(response => response.json())
          .then(data => { 
              console.log('from random endpoint', data)
          })
          .catch(error => console.log(error))

      }

      componentDidMount() {
        // const access_token = window.location.hash.split('=')[1].split('&')[0];
        // this.props.setToken(access_token)
        this.getAllPlaylists()
    }
    
    render() {
    return (
        <div>
             {/* <button on={this.getAllPlaylists}>Show all playlists</button> */}
             {this.state.myPlaylists.map((item, index) => {
                 
            return <div key={index}>
              <p className={ item.id === this.state.selectedPlaylistId ?
                     'selected_playlist'
                     : ''} onClick={() => this.getSpecificPlaylistId(item.id)}>{item.name}</p>
            </div>
          })}
        </div>
    )
    }
}
export default Playlists;
