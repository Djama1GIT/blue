import React, { useState, useEffect, useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';

import { PREVIEWS_URL } from '../Consts'

function Player({ streamData }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlay, setIsPlay] = useState(true);
  const [volume, setVolume] = useState(1);
  const [video, setVideo] = useState(null);
  const playerRef = useRef();

  function playVideo() {
    playerRef.current.play();
  }

  function pauseVideo() {
    playerRef.current.pause();
  }

  function togglePlay(video) {
    if (video.readyState === 4 || playerRef.current.readyState === 4) {
      if ((isPlay && video.paused === undefined) || video.paused === true) {
        playVideo();
        setIsPlay(false);
      } else {
        pauseVideo();
        setIsPlay(true);
      }
    }
  }

  function toggleMute() {
    if (isMuted) {
      playerRef.current.volume = volume;
    } else {
      setVolume(playerRef.current.volume);
      playerRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  }

  function toggleFullScreen(video) {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  }

  function handleVolumeChange(event) {
    const value = parseFloat(event.target.value);
    setVolume(value);
    playerRef.current.volume = value;
    setIsMuted(value === 0);
  }

  useEffect(() => {
    setVideo(document.getElementById('video-player-container'));
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT') {
        return;
      }

      if (event.keyCode === 32) {
        togglePlay(document.getElementById('video'));
      } else if (event.keyCode === 70) {
        toggleFullScreen(document.getElementById('video-player-container'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div id="video-player-container">
      <ReactHlsPlayer
        src={`http://127.0.0.1:8080/hls/${streamData.token}.m3u8`}
        poster={`${PREVIEWS_URL}${streamData.id}.png`}
        id="video"
        playerRef={playerRef}
        onClick={togglePlay}
        width="1300"
        preload="auto"
        muted={isMuted}
        autoPlay="true"
      />
      <div id="video-controls">
        <button id="play" onClick={togglePlay}>
          {isPlay ? "▶" : "II"}
        </button>
        <button id="mute" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔈"}
        </button>

        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleFullScreen} id="fullscreen">
          <div className="full">🢖🢔</div>
          <div className="full2">🢖🢔</div>
          <div className="screen">⛶</div>
        </button>
      </div>
    </div>
  );
}

export default Player;