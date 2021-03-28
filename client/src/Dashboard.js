import { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from './useAuth';
import TrackSearchResults from './TrackSearchResults';
import Player from './Player';

const spotifyApi = new SpotifyWebApi({
    clientId: '2d6969080fb54fd69dc4bbe87ff931a2'
})

export default function Dashboard ({ code }){
    const accessToken = useAuth(code),
    [search, setSearch] = useState(""),
    [searchResults, setSearchResults] = useState([]),
    [playingTrack, setPlayingTrack] = useState();
    
    function chooseTrack(track){
        setPlayingTrack(track);
        setSearch("");
    };

    useEffect(() => {
        if(!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if(!search) return setSearchResults([]);
        if(!accessToken) return;

        let cancel = false;

        spotifyApi.searchTracks(search).then(res => {
            if(cancel) return;
            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce( (smallest, image) => {
                        if(image.height < smallest.height) return image;
                        return smallest;
                    }, track.album.images[0]);

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
                    }
                })
            );

        });
        return () => cancel = true;
    }, [search, accessToken]);
    return <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
        <Form.Control 
            type="search" 
            placeholder="Search Songs or Artists" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
        />

        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
            {searchResults
                .map(track => {
                    return <TrackSearchResults track={track} key={track.uri} chooseTrack={chooseTrack} />
                })
            }
        </div>

        <div>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
        </div>
    </Container>
}