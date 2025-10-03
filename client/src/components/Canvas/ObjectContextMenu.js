import React from 'react';
import { useDispatch } from 'react-redux';
import {
  duplicateObject,
  deleteObject,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack
} from '../../store/slices/canvasSlice';
import {
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown
} from 'lucide-react';

const ObjectContextMenu = ({ objectId, x, y, onClose }) => {
  const dispatch = useDispatch();

  const handleAction = (action) => {
    switch (action) {
      case 'duplicate':
        dispatch(duplicateObject(objectId));
        break;
      case 'bringForward':
        dispatch(bringForward(objectId));
        break;
      case 'sendBackward':
        dispatch(sendBackward(objectId));
        break;
      case 'bringToFront':
        dispatch(bringToFront(objectId));
        break;
      case 'sendToBack':
        dispatch(sendToBack(objectId));
        break;
    }
    onClose();
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => handleAction('duplicate')}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Copy className="w-4 h-4 mr-2" />
        Duplicate
        <span className="ml-auto text-xs text-gray-400">Ctrl+D</span>
      </button>
      
      <div className="border-t border-gray-100 my-1" />
      
      <button
        onClick={() => handleAction('bringToFront')}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <ChevronsUp className="w-4 h-4 mr-2" />
        Bring to Front
        <span className="ml-auto text-xs text-gray-400">Ctrl+Shift+]</span>
      </button>
      
      <button
        onClick={() => handleAction('bringForward')}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <ChevronUp className="w-4 h-4 mr-2" />
        Bring Forward
        <span className="ml-auto text-xs text-gray-400">Ctrl+]</span>
      </button>
      
      <button
        onClick={() => handleAction('sendBackward')}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <ChevronDown className="w-4 h-4 mr-2" />
        Send Backward
        <span className="ml-auto text-xs text-gray-400">Ctrl+[</span>
      </button>
      
      <button
        onClick={() => handleAction('sendToBack')}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <ChevronsDown className="w-4 h-4 mr-2" />
        Send to Back
        <span className="ml-auto text-xs text-gray-400">Ctrl+Shift+[</span>
      </button>
    </div>
  );
};

export default ObjectContextMenu;