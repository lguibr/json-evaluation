import React, { useState } from 'react';
import ResultTable from './ResultTable';

function CollapsibleComparison({ filePair, weightConfig, abbreviations, onUpdateFlattenedData }) {
  const [isOpen, setIsOpen] = useState(false);

  const getApplicableWeight = (key) => {
    const parts = key.split('.');
    while (parts.length > 0) {
      const currentKey = parts.join('.');
      if (weightConfig.hasOwnProperty(currentKey)) {
        return weightConfig[currentKey];
      }
      parts.pop();
    }
    return 1;
  };

  return (
    <div className="comparison">
      <button className="collapsible" onClick={() => setIsOpen(!isOpen)}>
        {filePair.name} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && filePair.flattenedData && (
        <div className="content">
          <ResultTable
            data={filePair.flattenedData}
            weightConfig={weightConfig}
            getApplicableWeight={getApplicableWeight}
            fileName={filePair.name}
            onUpdateData={(newData) => {
              onUpdateFlattenedData(newData);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CollapsibleComparison;
