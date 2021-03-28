const express = require('express');
const SpotifyAPI = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const code = req.body.code,
    spotifyAPI = new SpotifyAPI({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
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
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
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
});

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found";

    res.json({ lyrics });
});

app.listen(3001);