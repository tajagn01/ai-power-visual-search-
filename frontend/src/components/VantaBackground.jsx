import React from 'react';

const VantaBackground = ({ children }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      {children}
    </div>
  );
};

export default VantaBackground; 