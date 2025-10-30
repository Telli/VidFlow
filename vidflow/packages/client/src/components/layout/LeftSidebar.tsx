import React from 'react';

const items = [
  { label: 'Scene', type: 'scene' },
  { label: 'Audio', type: 'audio' },
  { label: 'Manim', type: 'manim' },
  { label: 'Transition', type: 'transition' },
];

export default function LeftSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r p-3 bg-white">
      <h2 className="text-sm font-semibold mb-2">Nodes</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((it) => (
          <li
            key={it.type}
            draggable
            onDragStart={(e) => onDragStart(e, it.type)}
            className="cursor-move rounded border px-2 py-1 hover:bg-gray-50"
          >
            {it.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
