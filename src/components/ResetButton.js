import React from 'react';

function ResetButton({ resetTool }) {
  return (
    <button
      onClick={resetTool}
      style={{ backgroundColor: '#f44336', marginTop: '20px' }}
    >
      Reset Tool
    </button>
  );
}

export default ResetButton;
