import React from 'react';
import { Line } from 'react-konva';

const GridLayer = ({ width, height, gridSize }) => {
  const lines = [];
  
  // Vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, height]}
        stroke="#e5e7eb"
        strokeWidth={1}
        listening={false}
      />
    );
  }
  
  // Horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, width, i]}
        stroke="#e5e7eb"
        strokeWidth={1}
        listening={false}
      />
    );
  }
  
  return <>{lines}</>;
};

export default GridLayer;
