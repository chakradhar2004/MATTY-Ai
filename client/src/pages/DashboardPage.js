import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  Eye
} from 'lucide-react';
import { fetchDesigns, deleteDesign, duplicateDesign } from '../store/slices/designSlice';
import { setSearchQuery, updateFilters } from '../store/slices/uiSlice';
import { addNotification } from '../store/slices/uiSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { designs, loading, pagination } = useSelector((state) => state.design);
  const { searchQuery, filters } = useSelector((state) => state.ui);
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchDesigns({
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

  const handleDeleteDesign = async (designId) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await dispatch(deleteDesign(designId)).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Design deleted',
          message: 'Your design has been deleted successfully.',
        }));
      } catch (error) {
        dispatch(addNotification({
          type: 'error',
          title: 'Delete failed',
          message: 'Failed to delete the design. Please try again.',
        }));
      }
    }
  };

  const handleDuplicateDesign = async (designId) => {
    try {
      await dispatch(duplicateDesign(designId)).unwrap();
      dispatch(addNotification({
        type: 'success',
        title: 'Design duplicated',
        message: 'Your design has been duplicated successfully.',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Duplicate failed',
        message: 'Failed to duplicate the design. Please try again.',
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Designs</h1>
          <p className="text-gray-600">Create and manage your design projects</p>
        </div>
        <Link
          to="/editor"
          className="btn btn-primary btn-md inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Design
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={handleSearch}
              className="input pl-10 w-full"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-sm inline-flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Design Type
                </label>
                <select
                  value={filters.designType}
                  onChange={(e) => handleFilterChange('designType', e.target.value)}
                  className="input"
                >
                  <option value="all">All Types</option>
                  <option value="poster">Poster</option>
                  <option value="banner">Banner</option>
                  <option value="social">Social Media</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="input"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="Enter tags..."
                  className="input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Designs Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No designs yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first design</p>
          <Link
            to="/editor"
            className="btn btn-primary btn-md"
          >
            Create Your First Design
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {designs.map((design) => (
            <div
              key={design._id}
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'aspect-video'} bg-gray-100 relative`}>
                {design.thumbnailUrl ? (
                  <img
                    src={design.thumbnailUrl}
                    alt={design.title}
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
                      to={`/editor/${design._id}`}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicateDesign(design._id)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDesign(design._id)}
                      className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">{design.title}</h3>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {design.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{design.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(design.lastModified)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {design.canvasWidth} × {design.canvasHeight}
                    </span>
                  </div>
                </div>
                
                {design.tags && design.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {design.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {design.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{design.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              disabled={pagination.currentPage === 1}
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
