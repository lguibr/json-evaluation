// src/components/ApiKeyConfig.js

import React, { useState, useEffect } from 'react';
import './ApiKeyConfig.css'; // Create and style this CSS file as needed

function ApiKeyConfig() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Retrieve the API key from local storage when the component mounts
    const storedKey = localStorage.getItem('openai_api_key') || '';
    setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('API Key cannot be empty.');
      return;
    }
    // Save the API key to local storage
    localStorage.setItem('openai_api_key', apiKey.trim());
    alert('API Key saved successfully!');
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    alert('API Key cleared.');
  };

  return (
    <div className="api-key-config">
      <h2>OpenAI API Key Configuration</h2>
      <label htmlFor="apiKeyInput">Enter your OpenAI API Key:</label>
      <input
        type="password"
        id="apiKeyInput"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-..."
      />
      <div className="button-group">
        <button onClick={handleSave} className="save-button">Save API Key</button>
        <button onClick={handleClear} className="clear-button">Clear API Key</button>
      </div>
    </div>
  );
}

export default ApiKeyConfig;
