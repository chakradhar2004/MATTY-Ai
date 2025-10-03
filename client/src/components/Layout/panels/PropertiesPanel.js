import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateObject } from '../../../store/slices/canvasSlice';
import { Palette, Type, Move, RotateCw, Square, Circle } from 'lucide-react';

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const { objects, selectedObjectId, textSettings, shapeSettings } = useSelector((state) => state.canvas);

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const handlePropertyChange = (property, value) => {
    if (selectedObject) {
      dispatch(updateObject({ 
        id: selectedObjectId, 
        updates: { [property]: value } 
      }));
    }
  };

  const handlePositionChange = (axis, value) => {
    if (selectedObject) {
      const newPosition = { ...selectedObject };
      newPosition[axis] = parseFloat(value) || 0;
      dispatch(updateObject({ 
        id: selectedObjectId, 
        updates: newPosition 
      }));
    }
  };

  const handleSizeChange = (dimension, value) => {
    if (selectedObject) {
      const newSize = { ...selectedObject };
      newSize[dimension] = parseFloat(value) || 0;
      dispatch(updateObject({ 
        id: selectedObjectId, 
        updates: newSize 
      }));
    }
  };

  if (!selectedObject) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Square className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Select an object to edit properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Properties</h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedObject.type} • {selectedObject.id}
        </p>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Position & Size */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
            <Move className="w-3 h-3 mr-1" />
            Position & Size
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedObject.x)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedObject.y)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="input text-xs"
              />
            </div>
            {selectedObject.width !== undefined && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width</label>
                <input
                  type="number"
                  value={Math.round(selectedObject.width)}
                  onChange={(e) => handleSizeChange('width', e.target.value)}
                  className="input text-xs"
                />
              </div>
            )}
            {selectedObject.height !== undefined && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height</label>
                <input
                  type="number"
                  value={Math.round(selectedObject.height)}
                  onChange={(e) => handleSizeChange('height', e.target.value)}
                  className="input text-xs"
                />
              </div>
            )}
            {selectedObject.radius !== undefined && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Radius</label>
                <input
                  type="number"
                  value={Math.round(selectedObject.radius)}
                  onChange={(e) => handleSizeChange('radius', e.target.value)}
                  className="input text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Rotation */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
            <RotateCw className="w-3 h-3 mr-1" />
            Rotation
          </h4>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Angle</label>
            <input
              type="number"
              value={Math.round(selectedObject.rotation || 0)}
              onChange={(e) => handlePropertyChange('rotation', parseFloat(e.target.value) || 0)}
              className="input text-xs"
              min="0"
              max="360"
            />
          </div>
        </div>

        {/* Opacity */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-3">Opacity</h4>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {Math.round((selectedObject.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.opacity || 1}
              onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Text Properties */}
        {selectedObject.type === 'text' && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
              <Type className="w-3 h-3 mr-1" />
              Text
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Content</label>
                <textarea
                  value={selectedObject.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  className="input text-xs"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                  <input
                    type="number"
                    value={selectedObject.fontSize || textSettings.fontSize}
                    onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value) || 16)}
                    className="input text-xs"
                    min="8"
                    max="200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Weight</label>
                  <select
                    value={selectedObject.fontWeight || 'normal'}
                    onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                    className="input text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="bolder">Bolder</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                  <select
                    value={selectedObject.fontFamily || textSettings.fontFamily}
                    onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                    className="input text-xs"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Color</label>
                  <input
                    type="color"
                    value={selectedObject.fill || textSettings.fill}
                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.fontStyle === 'italic' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}>Italic</button>
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.fontWeight === 'bold' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}>Bold</button>
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.textDecoration === 'underline' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('textDecoration', selectedObject.textDecoration === 'underline' ? '' : 'underline')}>Underline</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.align === 'left' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('align', 'left')}>Left</button>
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.align === 'center' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('align', 'center')}>Center</button>
                <button className={`px-2 py-1 text-xs rounded ${selectedObject.align === 'right' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'}`} onClick={() => handlePropertyChange('align', 'right')}>Right</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Letter Spacing</label>
                  <input
                    type="number"
                    step="0.5"
                    value={selectedObject.letterSpacing || 0}
                    onChange={(e) => handlePropertyChange('letterSpacing', parseFloat(e.target.value) || 0)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Line Height</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedObject.lineHeight || 1.2}
                    onChange={(e) => handlePropertyChange('lineHeight', parseFloat(e.target.value) || 1.2)}
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shape Properties */}
        {(selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'ellipse' || selectedObject.type === 'triangle' || selectedObject.type === 'star') && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
              <Palette className="w-3 h-3 mr-1" />
              Fill & Stroke
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fill Color</label>
                  <input
                    type="color"
                    value={selectedObject.fill || shapeSettings.fill}
                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
                  <input
                    type="color"
                    value={selectedObject.stroke || shapeSettings.stroke}
                    onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
                  <input
                    type="number"
                    value={selectedObject.strokeWidth || shapeSettings.strokeWidth}
                    onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value) || 0)}
                    className="input text-xs"
                    min="0"
                    max="20"
                  />
                </div>
                {selectedObject.type === 'rect' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Corner Radius</label>
                    <input
                      type="number"
                      value={selectedObject.cornerRadius || 0}
                      onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value) || 0)}
                      className="input text-xs"
                      min="0"
                      max="200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Properties */}
        {selectedObject.type === 'image' && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-3">Image</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Source</label>
                <input
                  type="url"
                  value={selectedObject.src || ''}
                  onChange={(e) => handlePropertyChange('src', e.target.value)}
                  className="input text-xs"
                  placeholder="Image URL"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={selectedObject.alt || ''}
                  onChange={(e) => handlePropertyChange('alt', e.target.value)}
                  className="input text-xs"
                  placeholder="Alternative text"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
