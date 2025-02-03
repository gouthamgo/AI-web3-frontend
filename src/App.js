import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ai-web3.onrender.com/generate', { prompt });
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error('Error generating contract:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Smart Contract Generator</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter your requirements:
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
              placeholder="e.g., Create a token called MyToken with 1 million supply"
            />
          </label>
          <button type="submit">Generate</button>
        </form>

        {generatedCode && (
          <div className="result">
            <h2>Generated Smart Contract</h2>
            <pre>{generatedCode}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;