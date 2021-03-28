const express = require('express');
const SpotifyAPI = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const code = req.body.code,
    spotifyAPI = new SpotifyAPI({
        redirectUri: 'http://localhost:3000',
        clientId: '2d6969080fb54fd69dc4bbe87ff931a2',
        clientSecret: '1ed744530d864adb8f5a073615d9db35'
    });

    spotifyAPI
        .authorizationCodeGrant(code)
        .then( data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(() => {
            res.sendStatus(400);
        });
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    spotifyAPI = new SpotifyAPI({
        redirectUri: 'http://localhost:3000',
        clientId: '2d6969080fb54fd69dc4bbe87ff931a2',
        clientSecret: '1ed744530d864adb8f5a073615d9db35',
        refreshToken
    });

    spotifyAPI.refreshAccessToken()
        .then(
            (data) => {
                res.json({
                    accessToken: data.body.accessToken,
                    expiresIn: data.body.expiresIn
                })
            }
        )
        .catch(() => {
            res.sendStatus(400);
        });
})

app.listen(3001);