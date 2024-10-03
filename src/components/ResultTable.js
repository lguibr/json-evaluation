// File: components/ResultTable.js
import React, { useState, useEffect } from 'react';
import './ResultTable.css'; // Ensure this CSS file exists and is imported

function ResultTable({ data, weightConfig, getApplicableWeight, fileName, onUpdateData }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(
      data.map((item) =>
        item.score !== undefined ? item.score.toFixed(2) : item.similarity.toFixed(2)
      )
    );
  }, [data]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    // Validate and clamp the input value between 0 and 1
    let newValue = parseFloat(value);
    if (isNaN(newValue)) newValue = 0;
    newValue = Math.min(Math.max(newValue, 0), 1);
    newScores[index] = newValue.toFixed(2);
    setScores(newScores);

    const updatedData = data.map((item, idx) => ({
      ...item,
      score: parseFloat(newScores[idx]) || 0,
    }));
    onUpdateData(updatedData);
  };

  const downloadScores = () => {
    const scoreData = data.map((item, index) => {
      const weight = getApplicableWeight(item.key);
      const rawScore = parseFloat(scores[index]) || 0;
      return {
        key: item.key,
        weight: weight,
        rawScore: rawScore,
        weightedScore: parseFloat((rawScore * weight).toFixed(2)),
        similarity: item.similarity,
        reason: item.reason,
        value1: stringifyValue(item.value1),
        value2: stringifyValue(item.value2),
      };
    });

    const blob = new Blob([JSON.stringify(scoreData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scores_${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to stringify values
  const stringifyValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Calculate Averages
  const calculateAverages = () => {
    const total = data.reduce((acc, item, index) => {
      const rawScore = parseFloat(scores[index]) || 0;
      return acc + rawScore;
    }, 0);
    const average = data.length > 0 ? (total / data.length).toFixed(2) : 0;

    const weightedTotal = data.reduce((acc, item, index) => {
      const rawScore = parseFloat(scores[index]) || 0;
      const weight = getApplicableWeight(item.key);
      return acc + rawScore * weight;
    }, 0);

    const totalWeight = data.reduce((acc, item) => acc + getApplicableWeight(item.key), 0);
    const weightedAverage = totalWeight > 0 ? (weightedTotal / totalWeight).toFixed(2) : 0;

    return { average, weightedAverage };
  };

  const { average, weightedAverage } = calculateAverages();

  return (
    <div className="result-table">
      <h3>Results for {fileName}</h3>

      {/* Display Averages */}
      <div className="averages">
        <p><strong>Unweighted Average Score:</strong> {average}</p>
        <p><strong>Weighted Average Score:</strong> {weightedAverage}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>JSON 1 Value</th>
            <th>JSON 2 Value</th>
            <th>Weight</th>
            <th>Pre-Filled Reason</th>
            <th>Score (0-1)</th>
            <th>Weighted Score</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const weight = getApplicableWeight(item.key);
            const value1 = stringifyValue(item.value1);
            const value2 = stringifyValue(item.value2);
            const rawScore = parseFloat(scores[index]) || 0;
            const weightedScore = parseFloat((rawScore * weight).toFixed(2));
            return (
              <tr key={index}>
                <td>{item.key}</td>
                <td>{value1}</td>
                <td>{value2}</td>
                <td>{weight}</td>
                <td>{item.reason}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={scores[index]}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                  />
                </td>
                <td>{weightedScore}</td> {/* Display Weighted Score */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={downloadScores}>Download Scores for {fileName}</button>
    </div>
  );
}

export default ResultTable;
