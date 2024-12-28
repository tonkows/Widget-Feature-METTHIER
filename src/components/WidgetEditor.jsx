import React, { useState } from 'react';
import ConfigForm from './ConfigForm';
import GraphDisplay from './GraphDisplay';

const WidgetEditor = () => {
  const [config, setConfig] = useState({ position: '', range: '', type: 'bar' });

  const handleConfigChange = (newConfig) => {
    setConfig({ ...config, ...newConfig });
  };

  return (
    <div className="widget-editor">
      <ConfigForm config={config} onConfigChange={handleConfigChange} />
      <GraphDisplay config={config} />
    </div>
  );
};

export default WidgetEditor;
