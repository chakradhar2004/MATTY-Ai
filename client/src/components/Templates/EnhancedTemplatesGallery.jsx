import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { templateAPI } from '../../services/api';
import { 
  FaSpinner, 
  FaSearch, 
  FaStar, 
  FaPalette, 
  FaArrowRight,
  FaFilter,
  FaTimes,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Categories with icons
const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'poster', name: 'Posters' },
  { id: 'resume', name: 'Resumes' },
  { id: 'flyer', name: 'Flyers' },
  { id: 'card', name: 'Cards' },
  { id: 'invitation', name: 'Invitations' },
  { id: 'social', name: 'Social Media' },
  { id: 'business', name: 'Business' },
];

const EnhancedTemplatesGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'popular',
    orientation: 'all',
    color: 'all'
  });
  const [favorites, setFavorites] = useState(new Set());
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Sample data for demonstration
  const sampleTemplates = [
    {
      _id: '1',
      name: 'Modern Resume',
      description: 'Clean and professional resume template',
      category: 'resume',
      thumbnail: 'https://via.placeholder.com/600x400?text=Modern+Resume',
      isPremium: false,
      isNew: true,
      tags: ['resume', 'professional', 'modern'],
      views: 1245,
      rating: 4.8
    },
    {
      _id: '2',
      name: 'Business Card',
      description: 'Elegant business card design',
      category: 'card',
      thumbnail: 'https://via.placeholder.com/600x400?text=Business+Card',
      isPremium: true,
      isNew: false,
      tags: ['business', 'card', 'elegant'],
      views: 892,
      rating: 4.6
    },
    {
      _id: '3',
      name: 'Event Flyer',
      description: 'Eye-catching event promotion flyer',
      category: 'flyer',
      thumbnail: 'https://via.placeholder.com/600x400?text=Event+Flyer',
      isPremium: false,
      isNew: true,
      tags: ['event', 'flyer', 'promotion'],
      views: 765,
      rating: 4.7
    },
    {
      _id: '4',
      name: 'Social Media Post',
      description: 'Engaging social media template',
      category: 'social',
      thumbnail: 'https://via.placeholder.com/600x400?text=Social+Post',
      isPremium: true,
      isNew: false,
      tags: ['social', 'post', 'marketing'],
      views: 1102,
      rating: 4.9
    },
    {
      _id: '5',
      name: 'Wedding Invitation',
      description: 'Elegant wedding invitation design',
      category: 'invitation',
      thumbnail: 'https://via.placeholder.com/600x400?text=Wedding+Invitation',
      isPremium: false,
      isNew: false,
      tags: ['wedding', 'invitation', 'elegant'],
      views: 654,
      rating: 4.5
    },
    {
      _id: '6',
      name: 'Business Presentation',
      description: 'Professional business slides',
      category: 'business',
      thumbnail: 'https://via.placeholder.com/600x400?text=Business+Presentation',
      isPremium: true,
      isNew: true,
      tags: ['business', 'presentation', 'professional'],
      views: 987,
      rating: 4.8
    },
    {
      _id: '7',
      name: 'Product Poster',
      description: 'Modern product advertisement poster',
      category: 'poster',
      thumbnail: 'https://via.placeholder.com/600x400?text=Product+Poster',
      isPremium: false,
      isNew: false,
      tags: ['product', 'poster', 'advertisement'],
      views: 843,
      rating: 4.4
    },
    {
      _id: '8',
      name: 'Professional Resume',
      description: 'Clean and modern CV template',
      category: 'resume',
      thumbnail: 'https://via.placeholder.com/600x400?text=Professional+Resume',
      isPremium: true,
      isNew: false,
      tags: ['resume', 'cv', 'professional'],
      views: 1201,
      rating: 4.9
    }
  ];

  // Filter templates based on active category and search term
  const filteredTemplates = useMemo(() => {
    let result = [...sampleTemplates];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(template => 
        template.category === activeCategory
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term) ||
        template.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    return result;
  }, [activeCategory, searchTerm, filters]);

  const handleUseTemplate = async (template) => {
    try {
      // In a real app, you would use the template API
      // const res = await templateAPI.useTemplate(template._id);
      // const newDesign = res.data;
      // navigate(`/editor/${newDesign._id}`);
      
      // For demo, just navigate to editor with template ID
      navigate(`/editor?template=${template._id}`);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to use template', err);
        setError('Failed to load template. Please try again.');
      }
    }
  };

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
              Stunning Templates for Every Need
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-blue-100">
              Jumpstart your design with our professionally crafted templates. Customize to your heart's content!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFilter className="mr-2 h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="a-z">A to Z</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.orientation}
                    onChange={(e) => setFilters({...filters, orientation: e.target.value})}
                  >
                    <option value="all">All Orientations</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.color}
                    onChange={(e) => setFilters({...filters, color: e.target.value})}
                  >
                    <option value="all">All Colors</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
                {activeCategory === category.id && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {filteredTemplates.filter(t => category.id === 'all' ? true : t.category === category.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FaPalette className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                  setShowFilters(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredTemplates.map((template) => (
              <motion.div
                key={template._id}
                variants={item}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <div className="relative pb-[56.25%] bg-gray-50">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full bg-white text-blue-600 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                      >
                        Use Template
                        <FaArrowRight className="ml-2" size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {template.isNew && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      New
                    </div>
                  )}
                  
                  {template.isPremium && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <FaStar className="mr-1" /> Premium
                    </div>
                  )}
                  
                  <button 
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template._id);
                    }}
                    aria-label={favorites.has(template._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.has(template._id) ? (
                      <FaHeart className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2 flex-shrink-0">
                        Pro
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {template.description}
                  </p>
                  
                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="mt-auto pt-2 flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-400 self-center">+{template.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {template.views?.toLocaleString()} views
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{template.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTemplatesGallery;
