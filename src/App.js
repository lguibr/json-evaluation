// src/App.js

import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import AbbreviationsConfig from './components/AbbreviationsConfig';
import WeightConfig from './components/WeightConfig';
import FileUpload from './components/FileUpload';
import MatchedFileComparison from './components/MatchedFileComparison';
import DownloadButtons from './components/DownloadButtons';
import ResetButton from './components/ResetButton';
import './App.css';

function App() {
  const [step, setStep] = useState('home');
  const [abbreviations, setAbbreviations] = useState({});
  const [weightConfig, setWeightConfig] = useState({});
  const [matchedFiles, setMatchedFiles] = useState([]);

  const resetTool = () => {
    setStep('home');
    setAbbreviations({});
    setWeightConfig({});
    setMatchedFiles([]);
  };

  const handleLoadConfig = (config) => {
    setAbbreviations(config.abbreviations);
    setWeightConfig(config.weightConfig);
    setStep('fileUpload');
  };

  const handleCreateConfig = () => {
    setAbbreviations({});
    setWeightConfig({});
    setStep('abbreviations');
  };

  return (
    <div className="container">
      <h1>Advanced JSON Comparison and Evaluation Tool</h1>

      {step === 'home' && (
        <Home
          onLoadConfig={handleLoadConfig}
          onCreateConfig={handleCreateConfig}
        />
      )}

      {step === 'abbreviations' && (
        <AbbreviationsConfig
          abbreviations={abbreviations}
          setAbbreviations={setAbbreviations}
          onNext={() => setStep('weightConfig')}
          onBack={() => setStep('home')}
        />
      )}

      {step === 'weightConfig' && (
        <WeightConfig
          initialWeightConfig={weightConfig}
          onWeightConfigChange={setWeightConfig}
        />
      )}

      {step === 'fileUpload' && (
        <FileUpload
          onFilesMatched={(files) => {
            setMatchedFiles(files);
            setStep('comparisons');
          }}
          abbreviations={abbreviations}
          weightConfig={weightConfig}
        />
      )}

      {step === 'comparisons' && (
        <>
          <MatchedFileComparison
            matchedFiles={matchedFiles}
            setMatchedFiles={setMatchedFiles}
            weightConfig={weightConfig}
            abbreviations={abbreviations}
          />
          <DownloadButtons matchedFiles={matchedFiles} weightConfig={weightConfig} />
        </>
      )}

      <ResetButton resetTool={resetTool} />

      {/* Show Home link if not on Home */}
      {step !== 'home' && (
        <button onClick={() => setStep('home')} style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      )}
    </div>
  );
}

export default App;