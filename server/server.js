const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const fetch = require('node-fetch');
require('dotenv').config();

const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');


const client_id = process.env.EXPRESS_API_ID; // Your client id
const client_secret = process.env.EXPRESS_API_SECRET; // Your secret
const redirect_uri = process.env.EXPRESS_REDIRECT_URI; // Your redirect uri

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
    // const authOptions = {
    //   url: 'https://accounts.spotify.com/api/token',
    //   form: {
    //     code: code,
    //     redirect_uri: redirect_uri,
    //     grant_type: 'authorization_code'
    //   },
    //   headers: {
    //     'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    //   },
    //   json: true
    // };

    // request.post(authOptions, (error, response, body) => {
      if (true) {

        // const access_token = body.access_token,
        //     refresh_token = body.refresh_token;

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        params: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    })
      .then(response => {
        let access_token = response.data.access_token;
        let response_token = response.data.refresh_token;
        return {
          access_token,
          response_token
        }

      })
    // https://api.spotify.com/v1/playlists/4G9YkINPkGcFccBodAWLTM/tracks
        // const options = {
        //   url: 'https://api.spotify.com/v1/tracks/5t0lGFnRpz3zWoZj610dVM',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        // use the access token to access the Spotify Web API
        // request.get(options, (error, response, body) => {
        //   console.log(body);
        // });
        fetch('https://api.spotify.com/v1/tracks/5t0lGFnRpz3zWoZj610dVM', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + access_token
            }
        })
            .then(response => response.json())
            .then(data => console.log('we fetch', data));

      // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    // });
  }
});

app.get('/refresh_token', (req, res) => {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 5000');
app.listen(5000);