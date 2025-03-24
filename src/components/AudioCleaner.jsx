import React, { useState, useRef, useEffect } from "react";

const AudioCleaner = ({ audioFileUrl, recordedAudioUrl }) => {
  const [processedAudio, setProcessedAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if ((audioFileUrl || recordedAudioUrl) && audioRef.current) {
      audioRef.current.src = audioFileUrl || recordedAudioUrl;
    }
  }, [audioFileUrl, recordedAudioUrl]);

  const processAudio = () => {
    if (audioRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const filter = audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1000;
      source.connect(filter);
      filter.connect(audioContext.destination);

      setProcessedAudio(audioRef.current.src);
    }
  };

  const saveAudio = () => {
    if (processedAudio) {
      const a = document.createElement("a");
      a.href = processedAudio;
      a.download = "processed_audio.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mx-auto text-center">
      {/* <h2 className="text-lg font-bold mb-2">Audio Cleaner</h2> */}
      <audio ref={audioRef} controls className="mt-4 w-full" />
      <button
        onClick={processAudio}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Clean Audio
      </button>
      <button
        onClick={saveAudio}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
        disabled={!processedAudio}
      >
        Save Processed Audio
      </button>
    </div>
  );
};

export default AudioCleaner;