import React, { useState } from 'react';
import './App.css';
import Synthesizer from './components/Synthesizer';

function App() {
  const [synthesizers, setSynthesizers] = useState([]);

  const addSynthesizer = () => {
    const id = Date.now(); // unique ID
    setSynthesizers([...synthesizers, { id }]);
  };

  const removeSynthesizer = (id) => {
    setSynthesizers(synthesizers.filter((synth) => synth.id !== id));
  };

  return (
    <div className="App">
      <button onClick={addSynthesizer} className="btn" style={{ marginBottom: '20px' }}>
        Add Synthesizer
      </button>

      {synthesizers.map((synth) => (
        <div key={synth.id} style={{ position: 'relative', border: '2px solid black', boxShadow:'#7b6767 5px 8px 22px', padding: '10px', marginBottom: '10px', margin :'1rem' }}>
          <button 
            onClick={() => removeSynthesizer(synth.id)} 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: 'red', 
              color: 'white',
              border: '2px solid black',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <Synthesizer />
        </div>
      ))}
    </div>
  );
}

export default App;
