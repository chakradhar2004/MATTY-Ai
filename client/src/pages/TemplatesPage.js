import React from 'react';
import TemplatesGallery from '../components/Templates/TemplatesGallery';

const TemplatesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Templates</h1>
      <TemplatesGallery />
    </div>
  );
};

export default TemplatesPage;
