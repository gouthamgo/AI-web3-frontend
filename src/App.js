import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use the correct render.com URL without double 'generate'
  const API_URL = 'https://ai-web3.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/generate`,
        data: { prompt },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating contract:', error);
      setError(
        error.response?.data?.error || 
        'Failed to connect to the server. Please try again later.'
      );
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
            />
          </label>
          <button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <div className="error" style={{ color: 'red', margin: '1rem 0' }}>
            <p>{error}</p>
          </div>
        )}

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