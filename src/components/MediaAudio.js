import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

export default function MediaAudio({ source }) {
    var play = false;
    const audio = new Audio(source);

    // function componentDidMount() {
    //     audio.addEventListener('ended', () => setPlay(false));
    // }

    // function componentWillUnmount() {
    //     audio.removeEventListener('ended', () => setPlay(false));
    // }

    function togglePlay() {
        play = !play;
        play ? audio.play() : audio.pause();
    }

    return (
        <Button onClick={togglePlay} variant="danger">
            <FontAwesomeIcon icon={faPlay} /> Ascultati acest mesaj inainte de orice altceva!
        </Button>
    );
};
