import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  // Canvas settings
  canvasWidth: 800,
  canvasHeight: 600,
  canvasScale: 1,
  
  // Canvas state
  objects: [],
  selectedObjectId: null,
  history: [],
  historyIndex: -1,
  
  // Tool settings
  activeTool: 'select',
  drawingMode: false,
  
  // Text settings
  textSettings: {
    fontSize: 24,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    fill: '#000000',
    textDecoration: '',
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  
  // Shape settings
  shapeSettings: {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1,
    cornerRadius: 0,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  },
  
  // Image settings
  imageSettings: {
    opacity: 1,
    brightness: 1,
    contrast: 1,
    saturation: 1,
  },
  
  // Grid and guides
  showGrid: false,
  snapToGrid: false,
  gridSize: 20,
  
  // Zoom and pan
  zoom: 1,
  panX: 0,
  panY: 0,
  
  // Selection
  selectionBox: null,
  multiSelect: false,
  
  // Layer management
  layers: [],
  activeLayerId: null,
  
  // Undo/Redo
  canUndo: false,
  canRedo: false,

  // Export requests (png | pdf | null)
  exportRequest: null,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    // Canvas settings
    setCanvasSize: (state, action) => {
      const { width, height } = action.payload;
      state.canvasWidth = width;
      state.canvasHeight = height;
    },
    
    setCanvasScale: (state, action) => {
      state.canvasScale = action.payload;
    },
    
    // Objects management
    addObject: (state, action) => {
      const newObject = {
        id: uuidv4(),
        ...action.payload,
        x: action.payload.x || 0,
        y: action.payload.y || 0,
        rotation: action.payload.rotation || 0,
        scaleX: action.payload.scaleX || 1,
        scaleY: action.payload.scaleY || 1,
        opacity: action.payload.opacity || 1,
        visible: action.payload.visible !== false,
        locked: action.payload.locked || false,
        createdAt: new Date().toISOString(),
      };
      
      state.objects.push(newObject);
      state.selectedObjectId = newObject.id;
      
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        type: 'add',
        object: newObject,
        timestamp: Date.now(),
      });
      state.historyIndex++;
      state.canUndo = true;
      state.canRedo = false;
    },
    
    updateObject: (state, action) => {
      const { id, updates } = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === id);
      
      if (objectIndex !== -1) {
        const oldObject = { ...state.objects[objectIndex] };
        state.objects[objectIndex] = { ...state.objects[objectIndex], ...updates };
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'update',
          objectId: id,
          oldObject,
          newObject: state.objects[objectIndex],
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    removeObject: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex !== -1) {
        const removedObject = state.objects[objectIndex];
        state.objects.splice(objectIndex, 1);
        
        if (state.selectedObjectId === objectId) {
          state.selectedObjectId = null;
        }
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'remove',
          object: removedObject,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    duplicateObject: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex !== -1) {
        const originalObject = state.objects[objectIndex];
        const duplicatedObject = {
          ...originalObject,
          id: Date.now().toString(),
          x: originalObject.x + 20,
          y: originalObject.y + 20,
          createdAt: new Date().toISOString(),
        };
        
        state.objects.push(duplicatedObject);
        state.selectedObjectId = duplicatedObject.id;
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'duplicate',
          originalObject,
          duplicatedObject,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    // Selection
    selectObject: (state, action) => {
      state.selectedObjectId = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedObjectId = null;
    },
    
    // Tool management
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
      state.drawingMode = action.payload !== 'select';
    },
    
    setDrawingMode: (state, action) => {
      state.drawingMode = action.payload;
    },
    
    // Text settings
    updateTextSettings: (state, action) => {
      state.textSettings = { ...state.textSettings, ...action.payload };
    },
    
    // Shape settings
    updateShapeSettings: (state, action) => {
      state.shapeSettings = { ...state.shapeSettings, ...action.payload };
    },
    
    // Image settings
    updateImageSettings: (state, action) => {
      state.imageSettings = { ...state.imageSettings, ...action.payload };
    },
    
    // Grid and guides
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },
    
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    
    // Zoom and pan
    setZoom: (state, action) => {
      state.zoom = Math.max(0.1, Math.min(5, action.payload));
    },
    
    zoomIn: (state) => {
      state.zoom = Math.min(5, state.zoom * 1.2);
    },
    
    zoomOut: (state) => {
      state.zoom = Math.max(0.1, state.zoom / 1.2);
    },
    
    resetZoom: (state) => {
      state.zoom = 1;
    },
    
    setPan: (state, action) => {
      const { x, y } = action.payload;
      state.panX = x;
      state.panY = y;
    },
    
    // History management
    undo: (state) => {
      if (state.historyIndex >= 0) {
        const historyItem = state.history[state.historyIndex];
        
        switch (historyItem.type) {
          case 'add':
            state.objects = state.objects.filter(obj => obj.id !== historyItem.object.id);
            break;
          case 'update':
            const updateIndex = state.objects.findIndex(obj => obj.id === historyItem.objectId);
            if (updateIndex !== -1) {
              state.objects[updateIndex] = historyItem.oldObject;
            }
            break;
          case 'remove':
            state.objects.push(historyItem.object);
            break;
          case 'duplicate':
            state.objects = state.objects.filter(obj => obj.id !== historyItem.duplicatedObject.id);
            break;
          case 'delete':
            // Restore deleted object (would need to store the object data)
            break;
          case 'bringForward':
            // Move object back to original position
            const bfObject = state.objects.splice(historyItem.toIndex, 1)[0];
            state.objects.splice(historyItem.fromIndex, 0, bfObject);
            break;
          case 'sendBackward':
            // Move object back to original position
            const sbObject = state.objects.splice(historyItem.toIndex, 1)[0];
            state.objects.splice(historyItem.fromIndex, 0, sbObject);
            break;
          case 'bringToFront':
            // Move object back to original position
            const btfObject = state.objects.splice(historyItem.toIndex, 1)[0];
            state.objects.splice(historyItem.fromIndex, 0, btfObject);
            break;
          case 'sendToBack':
            // Move object back to original position
            const stbObject = state.objects.splice(historyItem.toIndex, 1)[0];
            state.objects.splice(historyItem.fromIndex, 0, stbObject);
            break;
        }
        
        state.historyIndex--;
        state.canUndo = state.historyIndex >= 0;
        state.canRedo = true;
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const historyItem = state.history[state.historyIndex];
        
        switch (historyItem.type) {
          case 'add':
            state.objects.push(historyItem.object);
            break;
          case 'update':
            const updateIndex = state.objects.findIndex(obj => obj.id === historyItem.objectId);
            if (updateIndex !== -1) {
              state.objects[updateIndex] = historyItem.newObject;
            }
            break;
          case 'remove':
            state.objects = state.objects.filter(obj => obj.id !== historyItem.object.id);
            break;
          case 'duplicate':
            state.objects.push(historyItem.duplicatedObject);
            break;
          case 'delete':
            // Remove object again
            state.objects = state.objects.filter(obj => obj.id !== historyItem.objectId);
            break;
          case 'bringForward':
            // Redo the bring forward operation
            const bfObject = state.objects.splice(historyItem.fromIndex, 1)[0];
            state.objects.splice(historyItem.toIndex, 0, bfObject);
            break;
          case 'sendBackward':
            // Redo the send backward operation
            const sbObject = state.objects.splice(historyItem.fromIndex, 1)[0];
            state.objects.splice(historyItem.toIndex, 0, sbObject);
            break;
          case 'bringToFront':
            // Redo the bring to front operation
            const btfObject = state.objects.splice(historyItem.fromIndex, 1)[0];
            state.objects.splice(historyItem.toIndex, 0, btfObject);
            break;
          case 'sendToBack':
            // Redo the send to back operation
            const stbObject = state.objects.splice(historyItem.fromIndex, 1)[0];
            state.objects.splice(historyItem.toIndex, 0, stbObject);
            break;
        }
        
        state.canUndo = true;
        state.canRedo = state.historyIndex < state.history.length - 1;
      }
    },
    
    clearHistory: (state) => {
      state.history = [];
      state.historyIndex = -1;
      state.canUndo = false;
      state.canRedo = false;
    },
    
    // Clear canvas
    clearCanvas: (state) => {
      state.objects = [];
      state.selectedObjectId = null;
      state.history = [];
      state.historyIndex = -1;
      state.canUndo = false;
      state.canRedo = false;
    },
    
    // Load design
    loadDesign: (state, action) => {
      const { objects, canvasWidth, canvasHeight } = action.payload;
      state.objects = objects || [];
      state.canvasWidth = canvasWidth || 800;
      state.canvasHeight = canvasHeight || 600;
      state.selectedObjectId = null;
      state.history = [];
      state.historyIndex = -1;
      state.canUndo = false;
      state.canRedo = false;
    },
    setShowGrid: (state, action) => {
      state.showGrid = action.payload;
    },
    exportToPNG: () => {
      // Deprecated: use setExportRequest('png') from UI
    },
    exportToPDF: () => {
      // Deprecated: use setExportRequest('pdf') from UI
    },

    setExportRequest: (state, action) => {
      state.exportRequest = action.payload; // 'png' | 'pdf' | null
    },
    
    // Layer management
    addLayer: (state, action) => {
      const newLayer = {
        id: Date.now().toString(),
        name: action.payload.name || `Layer ${state.layers.length + 1}`,
        visible: true,
        locked: false,
        opacity: 1,
        objects: [],
        createdAt: new Date().toISOString(),
      };
      state.layers.push(newLayer);
      state.activeLayerId = newLayer.id;
    },
    
    updateLayer: (state, action) => {
      const { id, updates } = action.payload;
      const layerIndex = state.layers.findIndex(layer => layer.id === id);
      if (layerIndex !== -1) {
        state.layers[layerIndex] = { ...state.layers[layerIndex], ...updates };
      }
    },
    
    removeLayer: (state, action) => {
      const layerId = action.payload;
      state.layers = state.layers.filter(layer => layer.id !== layerId);
      if (state.activeLayerId === layerId) {
        state.activeLayerId = state.layers.length > 0 ? state.layers[0].id : null;
      }
    },
    
    setActiveLayer: (state, action) => {
      state.activeLayerId = action.payload;
    },
    
    // Object arrangement functions
    bringForward: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex !== -1 && objectIndex < state.objects.length - 1) {
        const object = state.objects.splice(objectIndex, 1)[0];
        state.objects.splice(objectIndex + 1, 0, object);
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'bringForward',
          objectId,
          fromIndex: objectIndex,
          toIndex: objectIndex + 1,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    sendBackward: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex > 0) {
        const object = state.objects.splice(objectIndex, 1)[0];
        state.objects.splice(objectIndex - 1, 0, object);
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'sendBackward',
          objectId,
          fromIndex: objectIndex,
          toIndex: objectIndex - 1,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    bringToFront: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex !== -1 && objectIndex < state.objects.length - 1) {
        const object = state.objects.splice(objectIndex, 1)[0];
        state.objects.push(object);
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'bringToFront',
          objectId,
          fromIndex: objectIndex,
          toIndex: state.objects.length - 1,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    sendToBack: (state, action) => {
      const objectId = action.payload;
      const objectIndex = state.objects.findIndex(obj => obj.id === objectId);
      
      if (objectIndex > 0) {
        const object = state.objects.splice(objectIndex, 1)[0];
        state.objects.unshift(object);
        
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          type: 'sendToBack',
          objectId,
          fromIndex: objectIndex,
          toIndex: 0,
          timestamp: Date.now(),
        });
        state.historyIndex++;
        state.canUndo = true;
        state.canRedo = false;
      }
    },
    
    deleteObject: (state, action) => {
      const objectId = action.payload;
      state.objects = state.objects.filter(obj => obj.id !== objectId);
      
      if (state.selectedObjectId === objectId) {
        state.selectedObjectId = null;
      }
      
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        type: 'delete',
        objectId,
        timestamp: Date.now(),
      });
      state.historyIndex++;
      state.canUndo = true;
      state.canRedo = false;
    },
  },
});

export const {
  setCanvasSize,
  setCanvasScale,
  addObject,
  updateObject,
  removeObject,
  duplicateObject,
  selectObject,
  clearSelection,
  setActiveTool,
  setDrawingMode,
  updateTextSettings,
  updateShapeSettings,
  updateImageSettings,
  toggleGrid,
  setGridSize,
  toggleSnapToGrid,
  setZoom,
  zoomIn,
  zoomOut,
  resetZoom,
  setPan,
  undo,
  redo,
  clearHistory,
  clearCanvas,
  loadDesign,
  addLayer,
  updateLayer,
  removeLayer,
  setActiveLayer,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  deleteObject,
  setExportRequest,
} = canvasSlice.actions;

export default canvasSlice.reducer;
