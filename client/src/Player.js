import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackUri])
    
    if(!accessToken) return null;
    
    return <SpotifyPlayer 
        token={accessToken}
        showSaveIcon
        callback={state => {
            if(!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
        styles={{
            activeColor: '#1DB954',
            bgColor: '#000',
            color: '#1DB954',
            loaderColor: '#FFF',
            sliderColor: '#1DB954',
            trackArtistColor: '#CCC',
            trackNameColor: '#FFF',
          }}
    />
}