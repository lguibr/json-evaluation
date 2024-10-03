// src/components/ProjectForm.js

import React, { useState } from 'react';
import { addConfiguration, updateConfiguration } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import WeightConfig from './WeightConfig';
import './ProjectForm.css'; // Ensure this CSS file exists and is styled appropriately

function ProjectForm({ config, onClose }) {
  const [name, setName] = useState(config ? config.name : '');
  const [abbreviations, setAbbreviations] = useState(
    config
      ? JSON.stringify(config.abbreviations, null, 2)
      : `{
  "USA": ["United States", "US", "USA"],
  "UK": ["United Kingdom", "British Lang"]
}`
  );
  const [weightConfig, setWeightConfig] = useState(config ? config.weightConfig : {});

  const handleSubmit = () => {
    // Validate project name
    if (!name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    // Validate abbreviations JSON
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

    // Validate weightConfig
    if (typeof weightConfig !== 'object' || Array.isArray(weightConfig)) {
      alert('Weight Config must be a valid JSON object.');
      return;
    }

    const newConfig = {
      id: config ? config.id : uuidv4(),
      name,
      abbreviations: parsedAbbreviations,
      weightConfig: weightConfig,
    };

    if (config) {
      updateConfiguration(newConfig);
    } else {
      addConfiguration(newConfig);
    }

    onClose();
  };

  return (
    <div className="project-form-overlay">
      <div className="project-form">
        <h3>{config ? 'Edit Project' : 'Create New Project'}</h3>
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
        <WeightConfig
          initialWeightConfig={weightConfig}
          onWeightConfigChange={setWeightConfig}
        />
        <div className="form-actions">
          <button onClick={handleSubmit} className="save-button">
            {config ? 'Save Changes' : 'Create Project'}
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;