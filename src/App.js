import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(false);

  const API_URL = 'https://ai-web3.onrender.com';

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`, {
          withCredentials: true
        });
        setIsServerAvailable(response.data.status === 'healthy');
      } catch (error) {
        console.error('Server health check failed:', error);
        setIsServerAvailable(false);
      }
    };

    checkServerHealth();
  }, []);

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
      if (error.response) {
        // Server responded with an error
        setError(error.response.data.error || 'Server error occurred');
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Please try again later.');
      } else {
        // Error setting up the request
        setError('Failed to send request. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Smart Contract Generator</h1>
        
        {!isServerAvailable && (
          <div className="server-status" style={{ color: 'red', margin: '1rem 0' }}>
            <p>Server is currently unavailable. Please try again later.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Enter your requirements:
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
              placeholder="e.g., Create a token called MyToken with 1 million supply"
              disabled={isLoading || !isServerAvailable}
            />
          </label>
          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim() || !isServerAvailable}
          >
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