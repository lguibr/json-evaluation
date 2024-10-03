// src/components/Home.js

import React, { useEffect, useState } from 'react';
import { getConfigurations, deleteConfiguration } from '../utils/storage';
import ProjectForm from './ProjectForm';
import ApiKeyConfig from './ApiKeyConfig'; // Import the new component
import './Home.css'; // Style as needed

function Home({ onLoadConfig }) {
  const [configs, setConfigs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false); // New state

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const savedConfigs = getConfigurations();
    setConfigs(savedConfigs);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteConfiguration(id);
      loadConfigs();
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
  };

  const handleFormClose = () => {
    setIsCreating(false);
    setEditingConfig(null);
    loadConfigs();
  };

  const toggleApiKeyConfig = () => {
    setShowApiKeyConfig(!showApiKeyConfig);
  };

  return (
    <div className="home-container">
      <h2>Your Projects</h2>
      <div className="home-actions">
        <button onClick={() => setIsCreating(true)} className="create-button">
          + Create New Project
        </button>
        <button onClick={toggleApiKeyConfig} className="settings-button">
          {showApiKeyConfig ? 'Close Settings' : 'Settings'}
        </button>
      </div>
      {configs.length === 0 ? (
        <p>No projects found. Click "Create New Project" to get started.</p>
      ) : (
        <div className="config-grid">
          {configs.map((config) => (
            <div key={config.id} className="config-card">
              <h3>{config.name}</h3>
              <div className="config-actions">
                <button onClick={() => onLoadConfig(config)} className="load-button">
                  Load
                </button>
                <button onClick={() => handleEdit(config)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(config.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingConfig) && (
        <ProjectForm
          config={editingConfig}
          onClose={handleFormClose}
        />
      )}

      {showApiKeyConfig && <ApiKeyConfig />} {/* Render the API Key Config component */}
    </div>
  );
}

export default Home;
