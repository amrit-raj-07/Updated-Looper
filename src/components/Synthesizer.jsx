import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { WebMidi } from 'webmidi';
import AudioRecorder from './AudioRecorder';
import AudioCleaner from './AudioCleaner';
import AudioEffectsProcessor from './AudioEffectsProcessor';

const Synthesizer = () => {
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFileUrl(url);
      setRecordedAudioUrl(null);
      setProgress(0);
    }
  };

  const handleRecordingComplete = (url) => {
    setRecordedAudioUrl(url);
    setAudioFileUrl(null);
    setProgress(0);
  };

  const startLoop = async () => {
    const audioSourceUrl = recordedAudioUrl || audioFileUrl;
    if (audioSourceUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
    }
  };

  const stopLoop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div className='synthesizer'>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={startLoop} 
          className="btn" 
          disabled={!audioFileUrl && !recordedAudioUrl}
        >
          Play
        </button>
        <button onClick={stopLoop} className="btn">Stop</button>
      </div>

      {/* Audio Player with Progress Bar */}
      {(audioFileUrl || recordedAudioUrl) && (
        <div>
          {/* <audio 
            ref={audioRef} 
            src={recordedAudioUrl || audioFileUrl} 
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          /> */}
          <audio 
  ref={audioRef} 
  src={recordedAudioUrl || audioFileUrl} 
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  loop
/>

          <progress value={progress} max="100"></progress>
          {duration > 0 && (
            <p>{Math.floor((progress / 100) * duration)} / {Math.floor(duration)} sec</p>
          )}
        </div>
      )}

      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      <AudioCleaner audioFileUrl={audioFileUrl} recordedAudioUrl={recordedAudioUrl} />
      <AudioEffectsProcessor audioUrl={audioFileUrl} recordedAudioUrl= { recordedAudioUrl}/>
    </div>
  );
};

export default Synthesizer;
