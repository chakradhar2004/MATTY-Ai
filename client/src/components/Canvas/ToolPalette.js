import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setActiveTool, 
  addObject, 
  updateTextSettings,
  updateShapeSettings 
} from '../../store/slices/canvasSlice';
import { 
  MousePointer, 
  Type, 
  Square, 
  Circle, 
  Image, 
  PenTool,
  Hand,
  Move,
  RotateCcw,
  Minus,
  Copy,
  Scissors,
  Clipboard
} from 'lucide-react';

const ToolPalette = () => {
  const dispatch = useDispatch();
  const { 
    activeTool, 
    textSettings, 
    shapeSettings 
  } = useSelector((state) => state.canvas);

  const tools = [
    {
      id: 'select',
      name: 'Select',
      icon: MousePointer,
      description: 'Select and move objects',
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      description: 'Add text to your design',
    },
    {
      id: 'rect',
      name: 'Rectangle',
      icon: Square,
      description: 'Draw rectangles and squares',
    },
    {
      id: 'circle',
      name: 'Circle',
      icon: Circle,
      description: 'Draw circles and ellipses',
    },
    {
      id: 'image',
      name: 'Image',
      icon: Image,
      description: 'Add images to your design',
    },
    {
      id: 'pen',
      name: 'Pen',
      icon: PenTool,
      description: 'Draw freeform shapes',
    },
    {
      id: 'pan',
      name: 'Pan',
      icon: Hand,
      description: 'Pan around the canvas',
    },
  ];

  const handleToolSelect = (toolId) => {
    dispatch(setActiveTool(toolId));
  };

  const handleAddText = () => {
    const textObject = {
      type: 'text',
      text: 'Double click to edit',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      fontStyle: textSettings.fontStyle,
      fill: textSettings.fill,
      align: textSettings.textAlign,
    };
    dispatch(addObject(textObject));
  };

  const handleAddRectangle = () => {
    const rectObject = {
      type: 'rect',
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      fill: shapeSettings.fill,
      stroke: shapeSettings.stroke,
      strokeWidth: shapeSettings.strokeWidth,
    };
    dispatch(addObject(rectObject));
  };

  const handleAddCircle = () => {
    const circleObject = {
      type: 'circle',
      x: 100,
      y: 100,
      radius: 50,
      fill: shapeSettings.fill,
      stroke: shapeSettings.stroke,
      strokeWidth: shapeSettings.strokeWidth,
    };
    dispatch(addObject(circleObject));
  };

  const handleToolAction = (toolId) => {
    switch (toolId) {
      case 'text':
        handleAddText();
        break;
      case 'rect':
        handleAddRectangle();
        break;
      case 'circle':
        handleAddCircle();
        break;
      default:
        handleToolSelect(toolId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Tools */}
        <div className="flex items-center space-x-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolAction(tool.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTool === tool.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={tool.description}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool.name}</span>
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch(setActiveTool('select'))}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Reset to select tool"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Tool settings */}
      {activeTool === 'text' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Text Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Font Size</label>
              <input
                type="number"
                value={textSettings.fontSize}
                onChange={(e) => dispatch(updateTextSettings({ fontSize: parseInt(e.target.value) }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                min="8"
                max="200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <input
                type="color"
                value={textSettings.fill}
                onChange={(e) => dispatch(updateTextSettings({ fill: e.target.value }))}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Font Family</label>
              <select
                value={textSettings.fontFamily}
                onChange={(e) => dispatch(updateTextSettings({ fontFamily: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Alignment</label>
              <select
                value={textSettings.textAlign}
                onChange={(e) => dispatch(updateTextSettings({ textAlign: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'rect' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shape Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fill Color</label>
              <input
                type="color"
                value={shapeSettings.fill}
                onChange={(e) => dispatch(updateShapeSettings({ fill: e.target.value }))}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
              <input
                type="color"
                value={shapeSettings.stroke}
                onChange={(e) => dispatch(updateShapeSettings({ stroke: e.target.value }))}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
              <input
                type="number"
                value={shapeSettings.strokeWidth}
                onChange={(e) => dispatch(updateShapeSettings({ strokeWidth: parseInt(e.target.value) }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                min="0"
                max="20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPalette;
