import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectObject, 
  removeObject, 
  duplicateObject,
  updateObject 
} from '../../../store/slices/canvasSlice';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2, 
  Move,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const LayersPanel = () => {
  const dispatch = useDispatch();
  const { objects, selectedObjectId } = useSelector((state) => state.canvas);

  const handleObjectSelect = (objectId) => {
    dispatch(selectObject(objectId));
  };

  const handleObjectDelete = (objectId) => {
    dispatch(removeObject(objectId));
  };

  const handleObjectDuplicate = (objectId) => {
    dispatch(duplicateObject(objectId));
  };

  const handleToggleVisibility = (objectId) => {
    const object = objects.find(obj => obj.id === objectId);
    if (object) {
      dispatch(updateObject({ 
        id: objectId, 
        updates: { visible: !object.visible } 
      }));
    }
  };

  const handleToggleLock = (objectId) => {
    const object = objects.find(obj => obj.id === objectId);
    if (object) {
      dispatch(updateObject({ 
        id: objectId, 
        updates: { locked: !object.locked } 
      }));
    }
  };

  const getObjectIcon = (type) => {
    switch (type) {
      case 'text':
        return 'T';
      case 'rect':
        return '□';
      case 'circle':
        return '○';
      case 'image':
        return '🖼';
      case 'line':
        return '—';
      default:
        return '?';
    }
  };

  const getObjectName = (object) => {
    if (object.type === 'text') {
      return object.text || 'Text';
    }
    return object.type.charAt(0).toUpperCase() + object.type.slice(1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Layers</h3>
        <p className="text-xs text-gray-500 mt-1">
          {objects.length} layer{objects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {objects.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No layers yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add text, shapes, or images to see them here
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {objects.map((object, index) => (
              <div
                key={object.id}
                className={`group flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  selectedObjectId === object.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleObjectSelect(object.id)}
              >
                {/* Object Icon */}
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {getObjectIcon(object.type)}
                </div>

                {/* Object Name */}
                <div className="flex-1 min-w-0 ml-2">
                  <p className="text-sm font-medium truncate">
                    {getObjectName(object)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {object.type} • {Math.round(object.x)}, {Math.round(object.y)}
                  </p>
                </div>

                {/* Object Controls */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(object.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={object.visible ? 'Hide' : 'Show'}
                  >
                    {object.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(object.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={object.locked ? 'Unlock' : 'Lock'}
                  >
                    {object.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleObjectDuplicate(object.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleObjectDelete(object.id);
                    }}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer Actions */}
      {objects.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button className="text-xs text-gray-500 hover:text-gray-700">
              <Move className="w-3 h-3 inline mr-1" />
              Reorder
            </button>
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded" title="Move up">
                <ChevronUp className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="Move down">
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
