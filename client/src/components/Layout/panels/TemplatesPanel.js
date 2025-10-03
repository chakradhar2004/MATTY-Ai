import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates } from '../../../store/slices/designSlice';
import { Search, Grid, Download } from 'lucide-react';

const TemplatesPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates, loading } = useSelector((state) => state.design);

  useEffect(() => {
    dispatch(fetchTemplates({ limit: 6 }));
  }, [dispatch]);

  const templateCategories = [
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'education', name: 'Education', icon: '🎓' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Templates</h3>
        <p className="text-xs text-gray-500 mt-1">Quick start with templates</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="input pl-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-3">Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {templateCategories.map((category) => (
            <button
              key={category.id}
              className="flex items-center p-2 text-xs rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-4 text-center">
            <Grid className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No templates available</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {templates.slice(0, 6).map((template) => (
              <div
                key={template._id}
                className="group flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {/* Template Preview */}
                <div className="w-12 h-8 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  {template.thumbnailUrl ? (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Grid className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Template Info */}
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {template.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {template.canvasWidth} × {template.canvasHeight}
                  </p>
                </div>

                {/* Use Button */}
                <button
                  onClick={() => navigate('/editor', { state: { template } })}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-100 text-primary-600 rounded transition-all"
                  title="Use template"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View All Templates */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full btn btn-outline btn-sm">
          View All Templates
        </button>
      </div>
    </div>
  );
};

export default TemplatesPanel;
