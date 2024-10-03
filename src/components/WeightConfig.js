import React, { useState, useEffect } from 'react';
import './WeightConfig.css'; // Ensure this CSS file exists and is styled appropriately

function WeightConfig({ initialWeightConfig = {}, onWeightConfigChange }) {
  const [sampleJson, setSampleJson] = useState(
    JSON.stringify(initialWeightConfig, null, 2) || `{
  "key1": 1,
  "key2": 0.5
}`
  );
  const [weightConfig, setWeightConfig] = useState(initialWeightConfig);
  const [schema, setSchema] = useState([]);

  useEffect(() => {
    if (Object.keys(initialWeightConfig).length > 0) {
      setWeightConfig(initialWeightConfig);
      const generatedSchema = getSchemaFromObject(initialWeightConfig);
      setSchema(generatedSchema);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(sampleJson);
      const generatedSchema = getSchemaFromObject(parsed);
      const initialWeights = {};
      generatedSchema.forEach((key) => {
        initialWeights[key] = parsed[key] || 1;
      });
      setWeightConfig(initialWeights);
      setSchema(generatedSchema);
      onWeightConfigChange(initialWeights);
    } catch (error) {
      alert('Error parsing JSON. Please check your input.');
    }
  };

  const handleWeightChange = (key, value) => {
    const parsedValue = parseFloat(value);
    const updatedWeights = {
      ...weightConfig,
      [key]: Number.isNaN(parsedValue) ? 1 : parsedValue,
    };
    setWeightConfig(updatedWeights);
    onWeightConfigChange(updatedWeights);
  };

  const getSchemaFromObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            return [...acc, ...getSchemaFromObject(value[0], `${newKey}[]`)];
          } else {
            return [...acc, `${newKey}[]`];
          }
        } else {
          return [...acc, ...getSchemaFromObject(value, newKey)];
        }
      }
      return [...acc, newKey];
    }, []);
  };

  return (
    <div className="weight-config">
      <h3>Weight Configuration</h3>
      <textarea
        value={sampleJson}
        onChange={(e) => setSampleJson(e.target.value)}
        placeholder='Enter a sample JSON to configure weights, e.g., {"key1": 1, "key2": 0.5}'
      ></textarea>
      <button onClick={handleGenerate}>Generate Weight Config</button>
      {schema.length > 0 && (
        <div className="weight-fields">
          <h4>Set Weights:</h4>
          {schema.map((key) => (
            <div key={key} className="weight-field">
              <label>{key}:</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={weightConfig[key]}
                onChange={(e) => handleWeightChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeightConfig;