import React, { useState } from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import * as Tone from "tone";

const VirtualMIDIComponent = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [recordedBuffer, setRecordedBuffer] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pitchShift, setPitchShift] = useState(null);

  const firstNote = MidiNumbers.fromNote("c4");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const handlePlayNote = (midiNumber) => {
    if (recordedBuffer) {
      // Create a player for the recorded buffer and play it at different pitches
      const player = new Tone.Player(recordedBuffer).toDestination();
      const pitchShift = new Tone.PitchShift().toDestination();
      
      const note = MidiNumbers.getAttributes(midiNumber).note;
      const midiFrequency = Tone.Frequency(note).toFrequency();

      // Apply pitch shift effect based on the frequency of the piano note
      pitchShift.pitch = Tone.Frequency(midiFrequency).toMidi() - 60; // Shift pitch relative to middle C
      player.connect(pitchShift);
      player.start();
    }
  };

  const handleStopNote = () => {
    if (pitchShift) {
      pitchShift.disconnect();
    }
  };

  const startRecording = async () => {
    if (!isRecording) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(audioCtx);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        setRecordedBuffer(audioBuffer);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop(); // Stop recording after a short interval (e.g., 5 seconds)
      }, 5000); // Record for 5 seconds
    }
  };

  return (
    <div>
      <h1>Virtual MIDI Component</h1>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={handlePlayNote}
        stopNote={handleStopNote}
        width={600}
        keyboardShortcuts={keyboardShortcuts}
      />
      <button onClick={startRecording}>
        {isRecording ? "Recording..." : "Start Recording Voice"}
      </button>
      {recordedBuffer && <p>Voice Note Recorded! Use Piano to Play Different Pitches</p>}
    </div>
  );
};

export default VirtualMIDIComponent;
