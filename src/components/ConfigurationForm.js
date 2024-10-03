// src/components/ConfigurationForm.js

import React, { useState } from 'react';
import { addConfiguration, updateConfiguration } from '../utils/storage';
import './ConfigurationForm.css'; // You can style this as needed
import { v4 as uuidv4 } from 'uuid';

function ConfigurationForm({ config, onClose }) {
  const [name, setName] = useState(config ? config.name : '');
  const [abbreviations, setAbbreviations] = useState(config ? JSON.stringify(config.abbreviations, null, 2) : `{
  "USA": ["United States", "US", "USA"],
  "UK": ["United Kingdom", "British Lang"]
}`);
  const [weightConfig, setWeightConfig] = useState(config ? JSON.stringify(config.weightConfig, null, 2) : `{
  "key1": 1,
  "key2": 0.5
}`);

  const handleSubmit = () => {
    // Validate name
    if (!name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    // Validate and parse abbreviations
    let parsedAbbreviations;
    try {
      parsedAbbreviations = JSON.parse(abbreviations);
      if (typeof parsedAbbreviations !== 'object' || Array.isArray(parsedAbbreviations)) {
        throw new Error();
      }
    } catch {
      alert('Abbreviations Config must be a valid JSON object.');
      return;
    }

    // Validate and parse weightConfig
    let parsedWeightConfig;
    try {
      parsedWeightConfig = JSON.parse(weightConfig);
      if (typeof parsedWeightConfig !== 'object' || Array.isArray(parsedWeightConfig)) {
        throw new Error();
      }
    } catch {
      alert('Weight Config must be a valid JSON object.');
      return;
    }

    const newConfig = {
      id: config ? config.id : uuidv4(),
      name,
      abbreviations: parsedAbbreviations,
      weightConfig: parsedWeightConfig,
    };

    if (config) {
      updateConfiguration(newConfig);
    } else {
      addConfiguration(newConfig);
    }

    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{config ? 'Edit Project' : 'Create New Project'}</h2>
        <label>
          Project Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
          />
        </label>
        <label>
          Abbreviations Config (JSON):
          <textarea
            value={abbreviations}
            onChange={(e) => setAbbreviations(e.target.value)}
            placeholder='e.g., {"USA": ["United States", "US"], "UK": ["United Kingdom"]}'
          ></textarea>
        </label>
        <label>
          Weight Config (JSON):
          <textarea
            value={weightConfig}
            onChange={(e) => setWeightConfig(e.target.value)}
            placeholder='e.g., {"key1": 1, "key2": 0.5}'
          ></textarea>
        </label>
        <div className="form-actions">
          <button onClick={handleSubmit}>{config ? 'Save Changes' : 'Create Project'}</button>
          <button onClick={onClose} className="secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationForm;