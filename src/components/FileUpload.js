import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ onFilesMatched }) {
  const [leftFiles, setLeftFiles] = useState([]);
  const [rightFiles, setRightFiles] = useState([]);

  const onDropLeft = (acceptedFiles) => {
    setLeftFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const onDropRight = (acceptedFiles) => {
    setRightFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps: getRootLeftProps, getInputProps: getInputLeftProps } = useDropzone({
    onDrop: onDropLeft,
    accept: { 'application/json': ['.json'] },
  });

  const { getRootProps: getRootRightProps, getInputProps: getInputRightProps } = useDropzone({
    onDrop: onDropRight,
    accept: { 'application/json': ['.json'] },
  });

  const matchFiles = () => {
    const getBaseName = (fileName) => {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, ''); // removes extension
      const firstUnderscoreIndex = nameWithoutExt.indexOf('_');
      if (firstUnderscoreIndex === -1) {
        // No underscore, use the whole name
        return nameWithoutExt;
      }
      return nameWithoutExt.substring(0, firstUnderscoreIndex);
    };

    const leftMap = new Map();
    leftFiles.forEach((file) => {
      const baseName = getBaseName(file.name);
      leftMap.set(baseName, file);
    });

    const rightMap = new Map();
    rightFiles.forEach((file) => {
      const baseName = getBaseName(file.name);
      rightMap.set(baseName, file);
    });

    const matchedBaseNames = Array.from(leftMap.keys()).filter((baseName) =>
      rightMap.has(baseName)
    );

    const matched = matchedBaseNames.map((baseName) => ({
      name: baseName,
      file1: leftMap.get(baseName),
      file2: rightMap.get(baseName),
      flattenedData: [],
    }));

    if (matched.length === 0) {
      alert('No matching files found by base name.');
    } else {
      onFilesMatched(matched);
    }
  };

  return (
    <div id="fileUpload">
      <h2>Upload JSON Files</h2>
      <div className="dropzone-container">
        <div {...getRootLeftProps()} className="dropzone">
          <input {...getInputLeftProps()} />
          <p>Drag & drop JSON files here (Left)</p>
        </div>
        <div {...getRootRightProps()} className="dropzone">
          <input {...getInputRightProps()} />
          <p>Drag & drop JSON files here (Right)</p>
        </div>
      </div>
      <div className="file-lists">
        <div>
          <h3>Left Files</h3>
          <ul>
            {leftFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Right Files</h3>
          <ul>
            {rightFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={matchFiles} disabled={leftFiles.length === 0 || rightFiles.length === 0}>
        Match and Proceed
      </button>
    </div>
  );
}

export default FileUpload;
