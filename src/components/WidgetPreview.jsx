import React, { useState } from 'react';

const WidgetPreview = () => {
  const [widgetData, setWidgetData] = useState([
    { id: 1, name: 'Building 1', image: '/path/to/building1.jpg' },
    { id: 2, name: 'Building 2', image: '/path/to/building2.jpg' },
    { id: 3, name: 'Building 3', image: '/path/to/building3.jpg' },
  ]);

  return (
    <div className="widget-grid">
      {widgetData.map((widget) => (
        <div key={widget.id} className="widget-item">
          <img
            src={widget.image}
            alt={widget.name}
            style={{ width: '100px', height: '100px', marginBottom: '10px' }}
          />
          <p>{widget.name}</p>
          <button onClick={() => alert(`Selected: ${widget.name}`)}>
            Select
          </button>
        </div>
      ))}
    </div>
  );
};

export default WidgetPreview;
