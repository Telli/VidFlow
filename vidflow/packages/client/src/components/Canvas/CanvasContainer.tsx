import React from 'react';
import ReactFlowCanvas from './ReactFlowCanvas';

export default function CanvasContainer() {
  return (
    <div className="flex-1 bg-gray-50">
      <ReactFlowCanvas />
    </div>
  );
}
