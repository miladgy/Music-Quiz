const express = require('express');
const session = require('express-session');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const Musixmatch = require('musixmatch-node');
require('dotenv').config();

const app = express();

const mxm_Api = process.env.EXPRESS_MXM_API;
const client_id = process.env.EXPRESS_API_ID;
const client_secret = process.env.EXPRESS_API_SECRET;
const redirect_uri = process.env.EXPRESS_REDIRECT_URI;
const session_secret = process.env.EXPRESS_SESSION_SECRET;
const stateKey = 'spotify_auth_state';
const mxm = new Musixmatch(mxm_Api)

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(express.static(__dirname + '/public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .use(cookieParser());

app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000 * 10
  }
}))

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
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
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
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
        req.session.access_token = access_token
        req.session.refresh_token = refresh_token
        console.log('Getting spotify access_token and storing it in a session on "/callback"-endpoint ', req.session.access_token)

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
  const access_token = req.session.access_token
  fetch(`https://api.spotify.com/v1/me/playlists`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => {
      const { items } = data
      res.send(items)
    })
    .catch(err => console.log(err)) // make sure to have proper error messages here, but we log for now
})

app.get('/playlist/:id', (req, res) => {
  const access_token = req.session.access_token
  fetch(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => res.json(data.tracks.items))
    .catch(err => console.log(err)) // make sure to have proper error messages here, but we log for now
})

const hasPreviewURL = (track) => {
  return track.preview === null ? false : true;
}

const getRandomTrack = (tracks) => {
  let randomizer = tracks[Math.floor(Math.random() * tracks.length)];
  let track = {};
  track.title = randomizer.track.name;
  track.artist = randomizer.track.artists[0].name;
  track.preview = randomizer.track.preview_url;
  return track;
}

const getRandomTrackWithPreview = (tracks) => {
  let validTrack = getRandomTrack(tracks);
  while (!hasPreviewURL(validTrack)) {
    validTrack = getRandomTrack(tracks)
  }
  return validTrack;
}

const getIncorrectTracks = (correctTrack, tracks) => {
  let incorrect = [];
  while (incorrect.length !== 3) {
    const incorrectTrack = getRandomTrackWithPreview(tracks);
    if (!incorrect.find(el => el.artist === incorrectTrack.artist) && correctTrack.artist !== incorrectTrack.artist) {
      incorrect.push(incorrectTrack);
    }
  }
  return incorrect;
}

app.get('/random/:id', (req, res) => {
  const access_token = req.session.access_token
  fetch(`https://api.spotify.com/v1/playlists/${req.params.id}`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => data.tracks.items)
    .then(tracks => {
      let arr = [];
      const numberOfQuestions = 6

      while (arr.length < numberOfQuestions) {
        const correctTrack = getRandomTrackWithPreview(tracks);
        let questionObject = {
          correct: {},
          incorrect: [],
          options: []
        }
        questionObject.correct = correctTrack;
        const incorrect = getIncorrectTracks(correctTrack, tracks)
        questionObject.incorrect = incorrect;
        const options = [correctTrack, ...incorrect];
        const shuffledOptions = shuffleAnswers(options)
        questionObject.options = shuffledOptions;
        if (!arr.find(el => el.correct.artist === correctTrack.artist)) {
          arr.push(questionObject)
        }
      }
      res.send(arr);
    })
    .catch(err => console.log(err)) // make sure to have proper error messages here, but we log for now
})

const shuffleAnswers = arr => {
  let newArr = [...arr]
  for (let i = newArr.length - 1; i > 1; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

app.get('/song', (req, res) => {
  const access_token = req.session.access_token
  fetch('https://api.spotify.com/v1/playlists/6Ma3ZIHYF3y9f0qs1shYe1', {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => {
      const artist = data.tracks.items[0].track.artists[0].name.toString();
      const title = data.tracks.items[0].track.name.toString();
      console.log(title, artist);
      const lyrics = mxm.getLyricsMatcher({
        q_track: title,
        q_artist: artist
      })
        .then(lyrics => res.send(lyrics.message.body.lyrics.lyrics_body))
    })
    .catch(error => { console.log('something went wrong here', error) });
})

app.get('/refresh_token', (req, res) => {
  const refresh_token = req.session.refresh_token
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
      res.send({
        'access_token': access_token
      });
    })
    .catch(err => console.log(err)) // make sure to have proper error messages here, but we log for now 
});

console.log('Listening on 5000');
const server = app.listen(5000);
const io = socket(server);

io.on('connection', (socket) => {
  console.log('Web socket is being connected', socket.id)
  socket.on('join-game-as-host', (username) => {
    socket.user = {
      username,
      isHost: true,
      id: socket.id,
      score: 0,
      gamemode: '',
      playlist: '',
      imageURL: ''
    }
    socket.on('start-game', data => {
      socket.broadcast.emit('game-started', data)
    })
    socket.on('set-gamemode', data => {
      socket.user.gamemode = data
    })
    socket.on('set-playlist', data => {
      socket.user.playlist = data.selectedPlaylistId
      socket.user.imageURL = data.imageURL;
    })
  })

  socket.on('join-game-as-player', (username) => {
    socket.user = {
      username,
      isHost: false,
      id: socket.id,
      score: 0,
      gamemode: '',
      playlist: '',
      imageURL: ''
    }
  })

  socket.on('getinfo', () => {
    const socketClients = Object.values(io.sockets.connected);
    const users = socketClients.filter(socket => socket.user).map(socket => socket.user)
    io.emit('roominfo', users);
    socket.on('questions', (data) => {
      io.emit('question', data)
    })
    socket.on('update-score', (data = 0) => {
      socket.user.score = data
      io.emit('roominfo', users);
    })
  })
// socket.on("kickEmOut", () => {
//   const socketClients = Object.values(io.sockets.connected);
//   const users = socketClients.filter(socket => socket.user).forEach(socket => socket.user = {
//     username: '',
//     isHost: false,
//     id: socket.id,
//     score: 0,
//     gamemode: '',
//     playlist: '',
//     imageURL: ''
//   })
//   // users.splice(0, users.length)
// })
  socket.on("disconnect", () => {
    // socketClients.forEach(clients => delete clients);
    
    
    console.log("Client disconnected")});
  })
// })
