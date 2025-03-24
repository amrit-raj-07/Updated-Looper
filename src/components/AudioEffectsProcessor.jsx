import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

const AudioEffectsProcessor = ({ audioUrl, recordedAudioUrl }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEffects, setActiveEffects] = useState({
    reverb: false,
    distortion: false,
    chorus: false,
    delay: false,
  });

  // ✅ Create Effects Only Once
  const effects = useRef({
    reverb: new Tone.Reverb(3),
    distortion: new Tone.Distortion(0.5),
    chorus: new Tone.Chorus(4, 2.5, 0.5),
    delay: new Tone.FeedbackDelay("8n", 0.5),
  });

  // ✅ Determine which audio source to use
  const selectedAudioUrl = recordedAudioUrl || audioUrl;

  useEffect(() => {
    if (selectedAudioUrl) {
      const newPlayer = new Tone.Player({
        url: selectedAudioUrl,
        loop: true,
        autostart: false,
      });

      newPlayer.toDestination(); // ✅ Ensure player routes audio correctly
      setPlayer(newPlayer);
    }

    return () => {
      if (player) {
        player.stop();
        player.dispose();
      }
    };
  }, [selectedAudioUrl]); // ✅ Depend on selectedAudioUrl to ensure correct source

  const startPlayback = async () => {
    if (player) {
      await Tone.start();
      player.start();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (player) {
      player.stop();
      setIsPlaying(false);
    }
  };

  const toggleEffect = (effectName) => {
    if (player) {
      if (activeEffects[effectName]) {
        player.disconnect(effects.current[effectName]); // ✅ Correctly disconnect effect
      } else {
        player.connect(effects.current[effectName]); // ✅ Correctly connect effect
        effects.current[effectName].toDestination(); // ✅ Ensure effect routes to output
      }

      setActiveEffects((prev) => ({
        ...prev,
        [effectName]: !prev[effectName],
      }));
    }
  };

  return (
    <div className="audio-processor">
      <h3>Audio Effects Processor</h3>

      <button onClick={startPlayback} disabled={isPlaying || !selectedAudioUrl}>▶ Play</button>
      <button onClick={stopPlayback} disabled={!isPlaying}>⏹ Stop</button>

      <div>
        <button onClick={() => toggleEffect("reverb")} disabled={!selectedAudioUrl}>
          {activeEffects.reverb ? "🔊 Reverb On" : "🔇 Reverb Off"}
        </button>
        <button onClick={() => toggleEffect("distortion")} disabled={!selectedAudioUrl}>
          {activeEffects.distortion ? "🔥 Distortion On" : "🧊 Distortion Off"}
        </button>
        <button onClick={() => toggleEffect("chorus")} disabled={!selectedAudioUrl}>
          {activeEffects.chorus ? "🎶 Chorus On" : "🎵 Chorus Off"}
        </button>
        <button onClick={() => toggleEffect("delay")} disabled={!selectedAudioUrl}>
          {activeEffects.delay ? "🔁 Delay On" : "⏳ Delay Off"}
        </button>
      </div>
    </div>
  );
};

export default AudioEffectsProcessor;
