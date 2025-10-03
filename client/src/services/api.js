import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  getUser: () => api.get('/auth/user')
};

// Design API
export const designAPI = {
  getDesigns: (params = {}) => api.get('/designs', { params }),
  getDesign: (designId) => api.get(`/designs/${designId}`),
  saveDesign: (designData) => api.post('/designs', designData),
  updateDesign: (designId, designData) => api.put(`/designs/${designId}`, designData),
  deleteDesign: (designId) => api.delete(`/designs/${designId}`),
  duplicateDesign: (designId) => api.post(`/designs/${designId}/duplicate`),
  getTemplates: (params = {}) => api.get('/designs/public/templates', { params }),
  saveDesignThumbnail: (id, thumbnailUrl) => api.put(`/designs/${id}/thumbnail`, { thumbnailUrl }),
  getFeaturedDesigns: () => api.get('/designs/featured'),
  getRecentDesigns: () => api.get('/designs/recent')
};

// Designs API (alias for compatibility)
export const designsAPI = {
  getDesigns: () => api.get('/designs'),
  getDesign: (id) => api.get(`/designs/${id}`),
  createDesign: (designData) => api.post('/designs', designData),
  updateDesign: (id, designData) => api.put(`/designs/${id}`, designData),
  deleteDesign: (id) => api.delete(`/designs/${id}`),
  saveDesignThumbnail: (id, thumbnailUrl) => api.put(`/designs/${id}/thumbnail`, { thumbnailUrl }),
  getFeaturedDesigns: () => api.get('/designs/featured'),
  getRecentDesigns: () => api.get('/designs/recent'),
  getTemplates: (category) => api.get('/designs/templates', { params: { category } })
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    // Server route expects /api/upload/single
    return api.post('/upload/single', formData, config);
  },
  uploadMultipleImages: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/upload/multiple', formData, config);
  },
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
  generateThumbnail: (imageUrl, width, height) => 
    api.post('/upload/thumbnail', { imageUrl, width, height }),
  uploadDesignThumbnail: (designId, imageData) => {
    const formData = new FormData();
    formData.append('thumbnail', imageData);
    return api.post(`/upload/thumbnail/${designId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUploadSignature: () => api.get('/upload/signature'),
  uploadDirectToCloudinary: (file, folder, { signature, timestamp, cloudName, apiKey }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);
    
    return axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
};

// Export API
export const exportAPI = {
  exportToPNG: (canvasData) => api.post('/export/png', canvasData),
  exportToPDF: (canvasData) => api.post('/export/pdf', canvasData),
  exportToSVG: (canvasData) => api.post('/export/svg', canvasData),
};

// Template API
export const templateAPI = {
  getTemplates: () => api.get('/templates'),
  getTemplate: (id) => api.get(`/templates/${id}`),
  getTemplateCategories: () => api.get('/templates/categories'),
  getTemplatesByCategory: (category) => api.get(`/templates/category/${category}`),
  getFeaturedTemplates: () => api.get('/templates/featured'),
  useTemplate: (templateId) => api.post(`/templates/${templateId}/use`)
};

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

export default api;
