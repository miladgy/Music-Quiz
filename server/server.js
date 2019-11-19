const express = require('express'); // Express web server framework
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
        res.redirect('http://localhost:3000/#' +
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

app.get('/song',  (req, res) => {
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
            const lyrics =  mxm.getLyricsMatcher({
              q_track: title,
              q_artist: artist          
            })
            .then(lyrics => res.send(lyrics.message.body.lyrics.lyrics_body))
          }).catch(error => { console.log('something went wrong here', error)}); 
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
app.listen(5000);
