import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Menu,
  X
} from 'lucide-react';
import { 
  undo, 
  redo, 
  zoomIn, 
  zoomOut, 
  toggleGrid,
  setZoom,
  setExportRequest
} from '../../store/slices/canvasSlice';
import { 
  toggleRightPanel, 
  toggleSidebar 
} from '../../store/slices/uiSlice';
import { saveDesign } from '../../store/slices/designSlice';

const Toolbar = () => {
  const dispatch = useDispatch();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportBtnRef = useRef(null);
  const { 
    canUndo, 
    canRedo, 
    zoom, 
    showGrid 
  } = useSelector((state) => state.canvas);
  const { 
    saving 
  } = useSelector((state) => state.design);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportBtnRef.current && !exportBtnRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSave = () => {
    // Emit an app-wide save event for the editor to handle
    const ev = new CustomEvent('editor:save', { detail: { type: 'complete' } });
    window.dispatchEvent(ev);
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  const handleZoomIn = () => {
    dispatch(zoomIn());
  };

  const handleZoomOut = () => {
    dispatch(zoomOut());
  };

  const handleResetZoom = () => {
    dispatch(setZoom(1));
  };

  const handleToggleGrid = () => {
    dispatch(toggleGrid());
  };

  const toolbarItems = [
    {
      name: 'Save',
      icon: Save,
      onClick: handleSave,
      disabled: saving,
      shortcut: 'Ctrl+S',
    },
    {
      name: 'Undo',
      icon: Undo,
      onClick: handleUndo,
      disabled: !canUndo,
      shortcut: 'Ctrl+Z',
    },
    {
      name: 'Redo',
      icon: Redo,
      onClick: handleRedo,
      disabled: !canRedo,
      shortcut: 'Ctrl+Y',
    },
    {
      name: 'Zoom In',
      icon: ZoomIn,
      onClick: handleZoomIn,
      shortcut: 'Ctrl+=',
    },
    {
      name: 'Zoom Out',
      icon: ZoomOut,
      onClick: handleZoomOut,
      shortcut: 'Ctrl+-',
    },
  ];

  return (
    <div className="flex items-center justify-between h-full px-4 text-foreground relative">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-md hover:bg-secondary-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          {toolbarItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`p-2 rounded-md transition-colors ${
                  item.active
                    ? 'bg-primary-100 text-primary-700'
                    : item.disabled
                    ? 'text-secondary-400 cursor-not-allowed'
                    : 'text-secondary-700 hover:bg-secondary-100 hover:text-foreground'
                }`}
                title={`${item.name}${item.shortcut ? ` (${item.shortcut})` : ''}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Export dropdown */}
        <div className="relative" ref={exportBtnRef}>
          <button
            onClick={() => setShowExportMenu((v) => !v)}
            className="p-2 rounded-md text-secondary-700 hover:bg-secondary-100 hover:text-foreground transition-colors"
            title="Export"
          >
            <Download className="w-5 h-5" />
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={() => { dispatch(setExportRequest('png')); setShowExportMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Export PNG
              </button>
              <button
                onClick={() => { dispatch(setExportRequest('pdf')); setShowExportMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>

        
        <button
          onClick={() => dispatch(toggleRightPanel())}
          className="p-2 rounded-md text-secondary-700 hover:bg-secondary-100 hover:text-foreground transition-colors"
          title="Toggle right panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
