import React, { useRef, useState, useEffect } from 'react';
import './AudioPlayer.scss';

const AudioPlayer = ({ currentTrack, onNext, onPrev }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentTrack]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setProgress(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentTrack) {
        return (
            <div className="audio-player-wrapper empty">
                <p>No track selected</p>
            </div>
        );
    }

    return (
        <div className="audio-player-wrapper horizontal-bar">
            <div className="player-info-mini">
                <div className="album-art-mini">
                    <img src={currentTrack.albumArt || "https://placehold.co/50x50/1a1a2e/ffffff?text=♫"} alt="Album Art" />
                </div>
                <div className="track-details-mini">
                    <h4 className="title">{currentTrack.title}</h4>
                    <p className="artist">{currentTrack.artist}</p>
                </div>
            </div>
            
            <div className="player-controls-row">
                <button className="control-btn" onClick={onPrev}>⏮</button>
                <button className="play-pause-btn-mini" onClick={togglePlayPause}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="control-btn" onClick={onNext}>⏭</button>
            </div>

            <div className="progress-mini">
                <span className="time">{formatTime(progress)}</span>
                <input 
                    type="range" 
                    className="progress-bar-mini" 
                    min={0} 
                    max={duration || 100} 
                    value={progress} 
                    onChange={handleSeek}
                />
                <span className="time">{formatTime(duration)}</span>
            </div>

            <div className="player-actions-mini">
                <button className="like-btn">♡</button>
            </div>

            <audio 
                ref={audioRef} 
                src={currentTrack.src} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onNext}
            />
        </div>
    );
};

export default AudioPlayer;
