import React from 'react';

function DownloadButtons({ matchedFiles, weightConfig }) {
  const downloadAllScores = () => {
    const allScoreData = matchedFiles.map((filePair) => {
      return {
        fileName: filePair.name,
        scores: filePair.flattenedData.map((item) => {
          const weight = getApplicableWeight(item.key, weightConfig);
          const rawScore = item.score !== undefined ? item.score : item.similarity || 0;
          return {
            key: item.key,
            weight: weight,
            rawScore: rawScore,
            weightedScore: rawScore * weight,
            similarity: item.similarity,
            value1:
              typeof item.value1 === 'number' ? item.value1 : JSON.stringify(item.value1),
            value2:
              typeof item.value2 === 'number' ? item.value2 : JSON.stringify(item.value2),
          };
        }),
      };
    });

    const blob = new Blob([JSON.stringify(allScoreData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_scores.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getApplicableWeight = (key, weightConfig) => {
    const parts = key.split('.');
    while (parts.length > 0) {
      const currentKey = parts.join('.');
      if (weightConfig.hasOwnProperty(currentKey)) {
        return weightConfig[currentKey];
      }
      parts.pop();
    }
    return 0;
  };

  return (
    <div className="download-buttons">
      <button onClick={downloadAllScores}>Download All Scores</button>
    </div>
  );
}

export default DownloadButtons;
