import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const audioRef = useRef(null);
  const countdownRef = useRef(null);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(async () => {
        clearInterval(countdownRef.current);
        setCountdown(0);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (e) => {
          const url = URL.createObjectURL(e.data);
          setAudioUrl(url);
          onRecordingComplete(url); // Pass the audio URL to the parent component
        };

        recorder.start();
        setIsRecording(true);
      }, 5000);
    } else {
      console.error('Media Devices API not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className='audio'>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {countdown > 0 && (
        <div>
          <p>Recording starts in: {countdown} seconds</p>
        </div>
      )}
      {audioUrl && (
        <div>
          {/* <audio ref={audioRef} controls src={audioUrl}></audio> */}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
