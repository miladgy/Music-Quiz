const express = require('express'); // Express web server framework
const socket = require('socket.io');

const request = require('request'); // "Request" library
const fetch = require('node-fetch');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const Musixmatch = require('musixmatch-node');
require('dotenv').config();

const mxm_Api = process.env.EXPRESS_MXM_API;
const client_id = process.env.EXPRESS_API_ID;
const client_secret = process.env.EXPRESS_API_SECRET;
const redirect_uri = process.env.EXPRESS_REDIRECT_URI;
const mxm = new Musixmatch(mxm_Api)


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', (req, res) => {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', (req, res) => {

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      }
    })
      .then(response => response.json())
      .then(data => {
        const { access_token, refresh_token } = data;

        fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DWXfgo3OOonqa', {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + access_token
          }
        })
          .then(response => response.json())
          .then(data => console.log('we fetch', data));
        res.redirect('http://localhost:3000/EnterName/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      })
      .catch(err => {
        console.log(err)
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      })
  }
});
app.get('/playlist', (req, res) => {
  const access_token = req.query.token
  fetch(`https://api.spotify.com/v1/me/playlists`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => res.send(data.items))
})
app.get('/playlist/:id', (req, res) => {
  const access_token = req.query.token
  fetch(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => res.send(data.tracks.items))
})

const getRandomTrack = (tracks) => {
  let randomizer = tracks[Math.floor(Math.random() *  tracks.length)];
  let track = {};

  track.title = randomizer.track.name;
  track.artist = randomizer.track.artists[0].name;
  track.preview = randomizer.track.preview_url;
  return track;
}

app.get('/random/:id', (req, res) => {
  const access_token = req.query.token
  fetch(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => (data.tracks.items))
    .then(tracks => {
      let arr = [];
      const numberOfQuestions = 6

      while (arr.length < numberOfQuestions) {
        const correctTrack = getRandomTrack(tracks);
        let questionObject = {
          correct: {},
          incorrect: []
        }
        questionObject.correct = correctTrack;
        const incorrect = [];
        while (incorrect.length !== 3) {
          const incorrectTrack = getRandomTrack(tracks);
          if (!incorrect.find(el => el.artist === incorrectTrack.artist) && correctTrack.artist !== incorrectTrack.artist) {
            incorrect.push(incorrectTrack);
          }
        }
        questionObject.incorrect = incorrect;
        arr.push(questionObject)
      }
      res.send(arr);
    })
})

app.get('/song', (req, res) => {
  console.log('inside song')

  const access_token = ''
  fetch('https://api.spotify.com/v1/playlists/6Ma3ZIHYF3y9f0qs1shYe1', {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('we fetch', data)
      const artist = data.tracks.items[0].track.artists[0].name.toString();
      const title = data.tracks.items[0].track.name.toString();
      console.log(title, artist);
      const lyrics = mxm.getLyricsMatcher({
        q_track: title,
        q_artist: artist
      })
        .then(lyrics => res.send(lyrics.message.body.lyrics.lyrics_body))
    }).catch(error => { console.log('something went wrong here', error) });
})
app.get('/refresh_token', (req, res) => {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  })
    .then(response => response.json())
    .then(data => {
      const { refresh_token, access_token } = data
      console.log('refresh_toooooken', refresh_token)
      res.send({
        'access_token': access_token
      });
    })
});


console.log('Listening on 5000');
const server = app.listen(5000);
const io = socket(server);

let usernames = [];
let pairCount = 0;
let pgmstart = 0;
let id = 0;

io.on('connection', (socket) => {
  

  console.log('Web socket is being connected', socket.id)
  socket.emit('message', 'sending a message using sockets from the server' )

  socket.on('addClient', (username) => {
    const thePlayerName = {}
    socket.user = username
    thePlayerName['user'] = username;
    thePlayerName['score'] = 0;
    usernames.push(thePlayerName);
    console.log('Adding a client with addClient', username);

    pairCount++;
    if (pairCount === 1 || pairCount >= 3) {
      id = Math.round((Math.random() * 1000000));
			socket.room = id;
			pairCount = 1;
			console.log(`Amout of players: ${pairCount} - Room Number: ${id}`);
			socket.join(id);
			pgmstart = 1;
    }
    if (pairCount === 2) {
      console.log(`Amout of players: ${pairCount} - Room Number: ${id}`);
        	socket.join(id);
          pgmstart = 2;
          console.log(`All the players are here: ${usernames.map(e => e.user)}`)
    }

  })
  
  socket.on('getinfo', () => {
    console.log('will send info')
    // console.log(io.sockets.sockets)
    // console.log(Object.values(io.sockets.connected))
    const socketClients = Object.values(io.sockets.connected);
    const users = socketClients.filter(socket => socket.user).map(socket => socket.user)
    console.log('number of players', Object.values(io.sockets.connected).length)
    console.log('These are the users', users);
    socket.emit('roominfo', users)
    // socket.broadcast.to(id).emit('roominfo', `${username} has joined to this game`);
   io.emit('roominfo', users);
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
})