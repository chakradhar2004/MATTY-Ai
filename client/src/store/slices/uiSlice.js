import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Layout
  sidebarOpen: true,
  toolbarOpen: true,
  rightPanelOpen: true,
  
  // Modals
  modals: {
    login: false,
    register: false,
    saveDesign: false,
    loadDesign: false,
    exportDesign: false,
    settings: false,
    help: false,
  },
  
  // Notifications
  notifications: [],
  
  // Loading states
  loading: {
    auth: false,
    designs: false,
    save: false,
    export: false,
    upload: false,
  },
  
  // Theme
  theme: 'light',
  
  // UI preferences
  preferences: {
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    showGrid: false,
    snapToGrid: false,
    gridSize: 20,
    defaultCanvasWidth: 800,
    defaultCanvasHeight: 600,
  },
  
  // Active panels
  activePanel: 'layers', // layers, properties, templates, assets
  
  // Search and filters
  searchQuery: '',
  filters: {
    designType: 'all',
    dateRange: 'all',
    tags: [],
  },
  
  // Keyboard shortcuts
  shortcuts: {
    save: 'Ctrl+S',
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Y',
    copy: 'Ctrl+C',
    paste: 'Ctrl+V',
    delete: 'Delete',
    selectAll: 'Ctrl+A',
    zoomIn: 'Ctrl+=',
    zoomOut: 'Ctrl+-',
    resetZoom: 'Ctrl+0',
  },
  
  // Tutorial and onboarding
  tutorial: {
    completed: false,
    currentStep: 0,
    steps: [
      'Welcome to Matty AI Design Tool!',
      'Create your first design',
      'Add text and shapes',
      'Upload and use images',
      'Save your design',
      'Export your creation',
    ],
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleToolbar: (state) => {
      state.toolbarOpen = !state.toolbarOpen;
    },
    
    setToolbarOpen: (state, action) => {
      state.toolbarOpen = action.payload;
    },
    
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    
    setRightPanelOpen: (state, action) => {
      state.rightPanelOpen = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading states
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('preferences', JSON.stringify(state.preferences));
    },
    
    // Active panel
    setActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
    
    // Search and filters
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        designType: 'all',
        dateRange: 'all',
        tags: [],
      };
    },
    
    // Keyboard shortcuts
    updateShortcuts: (state, action) => {
      state.shortcuts = { ...state.shortcuts, ...action.payload };
    },
    
    // Tutorial
    startTutorial: (state) => {
      state.tutorial.completed = false;
      state.tutorial.currentStep = 0;
    },
    
    nextTutorialStep: (state) => {
      if (state.tutorial.currentStep < state.tutorial.steps.length - 1) {
        state.tutorial.currentStep++;
      } else {
        state.tutorial.completed = true;
      }
    },
    
    previousTutorialStep: (state) => {
      if (state.tutorial.currentStep > 0) {
        state.tutorial.currentStep--;
      }
    },
    
    completeTutorial: (state) => {
      state.tutorial.completed = true;
      state.tutorial.currentStep = 0;
    },
    
    skipTutorial: (state) => {
      state.tutorial.completed = true;
      state.tutorial.currentStep = 0;
    },
    
    // Reset UI
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme,
        preferences: state.preferences,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleToolbar,
  setToolbarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setTheme,
  toggleTheme,
  updatePreferences,
  setActivePanel,
  setSearchQuery,
  updateFilters,
  clearFilters,
  updateShortcuts,
  startTutorial,
  nextTutorialStep,
  previousTutorialStep,
  completeTutorial,
  skipTutorial,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
