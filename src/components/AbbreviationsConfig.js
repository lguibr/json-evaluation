// src/components/AbbreviationsConfig.js

import React, { useState } from 'react';

function AbbreviationsConfig({ abbreviations, setAbbreviations, onNext, onBack }) {
  const [input, setInput] = useState(
    JSON.stringify(abbreviations, null, 2) || `{
  "USA": ["United States", "US", "USA"],
  "UK": ["United Kingdom", "British Lang"]
}`
  );

  const handleSave = () => {
    try {
      const parsed = JSON.parse(input);
      setAbbreviations(parsed);
      onNext();
    } catch (error) {
      alert('Error parsing abbreviations JSON. Please check your input.');
    }
  };

  return (
    <div id="abbreviationsConfig">
      <h2>Abbreviations and Similar Words</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Enter abbreviations and similar words in JSON format, e.g., {"USA": ["United States", "US"], "UK": ["United Kingdom"]}'
      ></textarea>
      <div className="form-actions">
        <button onClick={onBack} className="secondary">Back</button>
        <button onClick={handleSave}>Save Abbreviations</button>
      </div>
    </div>
  );
}

export default AbbreviationsConfig;