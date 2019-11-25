const express = require('express'); // Express web server framework
const session = require('express-session');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const request = require('request'); // "Request" library
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

app.use(express.static(__dirname + '/public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .use(cookieParser());

// Express-Session MIDDLEWARES
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000 * 10, // 10 minutes
  }
}))

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
    // res.clearCookie(stateKey); // MIGHT HAVE TO BE COMMENTED/DELETED BECAUSE OF SESSION ISSUES ON FRIDAY WITH MORITZ, CARTER AND MODI

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

        // BELOW MIGHT HAVE TO BE UNCOMMENTED // MODI
        // fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DWXfgo3OOonqa', {
        //   headers: {
        //     "Accept": "application/json",
        //     "Content-Type": "application/json",
        //     "Authorization": 'Bearer ' + access_token
        //   }
        // })
        //   .then(response => response.json())
        //   .then(data => console.log('we fetch', data));
        // ABOVE MIGHT HAVE TO BE UNCOMMENTED, COMMENTED OUT BY MODI FRI 22/11

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

app.get('/test', (req, res) => {
  console.log('logging the whole session object', req.session);
  res.send(req.session.access_token);
})

app.get('/playlist', (req, res) => {
  // const access_token = req.query.token
  const access_token = req.session.access_token
  console.log('access_token in /playlist', access_token)

  fetch(`https://api.spotify.com/v1/me/playlists`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + access_token
    }
  })
    .then(response => response.json())
    .then(data => res.send(data.items))
    .catch(err => console.log(err)) // make sure to have proper error messages here, but we log for now
})

app.get('/playlist/:id', (req, res) => {
  // const access_token = req.query.token
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
  // const access_token = req.query.token
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
        // questionObject.options.push(correctTrack);
        const incorrect = getIncorrectTracks(correctTrack, tracks)
        
        // while (incorrect.length !== 3) {
          //   const incorrectTrack = getRandomTrack(tracks);
          //   if (!incorrect.find(el => el.artist === incorrectTrack.artist) && correctTrack.artist !== incorrectTrack.artist) {
            //     incorrect.push(incorrectTrack);
            //   }
            // }
            
            questionObject.incorrect = incorrect;
            const options = [correctTrack, ...incorrect];
            // console.log('we are trying another on', options)
            const shuffledOptions = shuffleAnswers(options)
            questionObject.options = shuffledOptions;
            // questionObject.options.flat().map(e => anotherArr.push(e));
            
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
      [newArr[i], newArr[rand]]=[newArr[rand], newArr[i]];
  }
  console.log('inside the shuffle in the server!!!!!', newArr[1])
  return newArr;
}

app.get('/song', (req, res) => {

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
    })
    .catch(error => { console.log('something went wrong here', error) });
})

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  // const refresh_token = req.query.refresh_token;
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

      console.log('getting a new refresh token from endpoint "/refresh_token" ', refresh_token)

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
      score: 0
    }
    console.log('SOCKET-SERVER: ' + socket.user.isHost + ' joining as host')

    socket.on('start-game', data => {
      socket.broadcast.emit('game-started', data)
    })
  })

  socket.on('join-game-as-player', (username) => {
    socket.user = {
      username,
      isHost: false,
      id: socket.id,
      score: 0
    }
    // console.log('SOCKET-SERVER: ' + socket.user.username + 'Joining as player')

  })

  socket.on('getinfo', () => {
    const socketClients = Object.values(io.sockets.connected);
    const users = socketClients.filter(socket => socket.user).map(socket => socket.user)

    // console.log('number of players', Object.values(io.sockets.connected).length)
    // console.log('These are the users', users);
    // socket.emit('roominfo', users)
    io.emit('roominfo', users);
   
    socket.on('questions', (data) => {
      // console.log('gettign socket questions', data)
      io.emit('question', data)
    })
    socket.on('update-score', (data) => {
      socket.user.score = data
      // io.emit('score-updated', data)
      io.emit('roominfo', users);
    })
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
})