const express = require('express');
const SpotifyAPI = require('spotify-web-api-node');

const app = express();

app.post('/login', (req, res) => {
    const code = req.body.code,
    spotifyAPI = new SpotifyAPI({
        redirectUri: 'http://localhost:3000',
        clientId: '',
        clientSecret: ''
    });
})