import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  Download,
  Eye,
  Heart,
  Star
} from 'lucide-react';
import { fetchTemplates } from '../store/slices/designSlice';
import { setSearchQuery, updateFilters } from '../store/slices/uiSlice';

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.design);
  const { searchQuery, filters } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchTemplates({
      page: 1,
      limit: 12,
      search: searchQuery,
      ...filters,
    }));
  }, [dispatch, searchQuery, filters]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value }));
  };

  const templateCategories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'social', name: 'Social Media', count: 24 },
    { id: 'business', name: 'Business', count: 18 },
    { id: 'marketing', name: 'Marketing', count: 32 },
    { id: 'education', name: 'Education', count: 15 },
    { id: 'events', name: 'Events', count: 21 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <p className="text-gray-600">Choose from thousands of professional design templates</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearch}
              className="input pl-10 w-full"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <button className="btn btn-outline btn-sm inline-flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {templateCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === category.id || (category.id === 'all' && !filters.category)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Template Preview */}
              <div className="aspect-video bg-gray-100 relative">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-sm">No preview</div>
                  </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex space-x-2">
                    <Link
                      to={`/editor?template=${template._id}`}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                      title="Use Template"
                    >
                      <Download className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                      title="Add to Favorites"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">{template.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                
                {template.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {template.userId?.username || 'Anonymous'}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {template.canvasWidth} × {template.canvasHeight}
                    </span>
                  </div>
                </div>
                
                {template.tags && template.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {templates.length > 0 && (
        <div className="mt-8 text-center">
          <button className="btn btn-outline btn-md">
            Load More Templates
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
