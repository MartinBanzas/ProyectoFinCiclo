import React, { useEffect, useRef } from "react";

type Props = {
    level: number;
    musicOver: boolean;
};

export const Music = (props: Props) => {
    const gameOver = require('../../../assets/music/gameOver.m4a')
    const tetrisOg = require('../../../assets/music/tetrisgameboy.mp3');
    const piano = require('../../../assets/music/Tetris Theme (Piano Version) - 400k Special.m4a');
    const tecno = require('../../../assets/music/Tetris (Techno Version).m4a');
    const orchestra = require('../../../assets/music/Tetris Theme - Contemporary Big BandClassical Fusion Version (The 8-Bit Big Band).m4a');
    const redArmy = require('../../../assets/music/Red Army Choir Korobeiniki.m4a');
    const audioRef = useRef<HTMLAudioElement>(null);
    let render =0;
    let music;
    useEffect(() => {
        switch (props.level) {
            case 0:
                music = [piano];
                break;
            case 1:
                music = [tecno];
                break;
            case 2:
                music = [orchestra];
                break;
            case 3:
                music = [tecno];
                break;
            case 4:
                music = [redArmy];
                break;
            default:
                music = [piano];
                break;
        }

        if (props.musicOver) music=[gameOver];

        if (audioRef.current) {
           
            const [selectedMusic] = music;
            audioRef.current.src = selectedMusic;
            audioRef.current.play();
        }
render++;

    }, [props.level, props.musicOver]);

    return (
            <audio id="audio_tag" ref={audioRef} /> 
    );

}