import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { templateAPI } from '../../services/api';

// Simple gallery to browse templates and open in editor
// - Fetches from /api/templates with optional ?category
// - Shows category tabs and a grid of previews
// - "Use this template" navigates to /editor with template passed in state
const categories = ['All', 'Poster', 'Resume', 'Flyer', 'Card', 'Invitation'];

const TemplatesGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const params = useMemo(() => {
    const p = {};
    if (activeCategory && activeCategory !== 'All') p.category = activeCategory;
    return p;
  }, [activeCategory]);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/templates', { params });
        setTemplates(res.data || []);
      } catch (err) {
        console.error('Failed to fetch templates', err);
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [params]);

  const handleUseTemplate = async (tpl) => {
    try {
      const res = await templateAPI.useTemplate(tpl._id);
      const newDesign = res.data;
      navigate(`/editor/${newDesign._id}`);
    } catch (err) {
      if (err?.response?.status === 401) {
        // Not authenticated: send user to login
        navigate('/login');
      } else {
        console.error('Failed to use template', err);
        alert('Failed to use template. Please try again.');
      }
    }
  };

  return (
    <div className="p-4">
      {/* Category tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm border ${
              activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading templates...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600">{error}</div>
      ) : templates.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No templates found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((tpl) => (
            <div key={tpl._id} className="border rounded-lg overflow-hidden bg-white">
              <div className="aspect-video bg-gray-100">
                {tpl.previewUrl ? (
                  <img src={tpl.previewUrl} alt={tpl.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-400">No preview</div>
                )}
              </div>
              <div className="p-3">
                <div className="font-medium text-gray-900 truncate">{tpl.title}</div>
                <div className="text-xs text-gray-500 mb-3">{tpl.category || 'General'}</div>
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded"
                >
                  Use this template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesGallery;
