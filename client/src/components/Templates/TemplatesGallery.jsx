import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { templateAPI } from '../../services/api';
import { FaSearch, FaStar, FaPalette, FaArrowRight, FaFilter, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
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

// Enhanced template data with realistic previews
const sampleTemplates = [
  {
    _id: '1',
    title: 'Modern Resume',
    description: 'Clean and professional resume template with modern typography',
    category: 'resume',
    previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: true,
    tags: ['resume', 'professional', 'modern'],
    views: 1245,
    rating: 4.8,
    colors: ['#2563eb', '#f8fafc', '#1e293b']
  },
  {
    _id: '2',
    title: 'Creative Resume',
    description: 'Stand out with this creative and colorful resume design',
    category: 'resume',
    previewUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: false,
    tags: ['resume', 'creative', 'colorful'],
    views: 892,
    rating: 4.6,
    colors: ['#7c3aed', '#f59e0b', '#10b981']
  },
  {
    _id: '3',
    title: 'Business Card - Minimal',
    description: 'Elegant minimal business card design',
    category: 'card',
    previewUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: true,
    tags: ['business', 'card', 'minimal'],
    views: 765,
    rating: 4.7,
    colors: ['#000000', '#ffffff', '#6b7280']
  },
  {
    _id: '4',
    title: 'Event Flyer - Concert',
    description: 'Eye-catching concert event promotion flyer',
    category: 'flyer',
    previewUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: false,
    tags: ['event', 'flyer', 'concert'],
    views: 1102,
    rating: 4.9,
    colors: ['#dc2626', '#fbbf24', '#1f2937']
  },
  {
    _id: '5',
    title: 'Instagram Post - Food',
    description: 'Delicious food social media template',
    category: 'social',
    previewUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center',
    isPremium: false,
    isNew: false,
    tags: ['social', 'instagram', 'food'],
    views: 654,
    rating: 4.5,
    colors: ['#f59e0b', '#dc2626', '#065f46']
  },
  {
    _id: '6',
    title: 'Wedding Invitation',
    description: 'Elegant floral wedding invitation design',
    category: 'invitation',
    previewUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: true,
    tags: ['wedding', 'invitation', 'floral'],
    views: 987,
    rating: 4.8,
    colors: ['#ec4899', '#f3e8ff', '#065f46']
  },
  {
    _id: '7',
    title: 'Business Presentation',
    description: 'Professional corporate presentation template',
    category: 'business',
    previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: false,
    tags: ['business', 'presentation', 'corporate'],
    views: 1456,
    rating: 4.7,
    colors: ['#1e40af', '#f8fafc', '#374151']
  },
  {
    _id: '8',
    title: 'Brand Identity Kit',
    description: 'Complete brand identity and logo design kit',
    category: 'business',
    previewUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: true,
    tags: ['branding', 'logo', 'identity'],
    views: 2134,
    rating: 4.9,
    colors: ['#8b5cf6', '#06b6d4', '#f59e0b']
  },
  {
    _id: '9',
    title: 'Party Invitation',
    description: 'Fun and vibrant party invitation template',
    category: 'invitation',
    previewUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: true,
    tags: ['party', 'invitation', 'colorful'],
    views: 876,
    rating: 4.6,
    colors: ['#ec4899', '#8b5cf6', '#f59e0b']
  },
  {
    _id: '10',
    title: 'Product Catalog',
    description: 'Modern product showcase catalog design',
    category: 'business',
    previewUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: false,
    tags: ['catalog', 'product', 'showcase'],
    views: 1789,
    rating: 4.8,
    colors: ['#059669', '#f3f4f6', '#111827']
  },
  {
    _id: '11',
    title: 'LinkedIn Banner',
    description: 'Professional LinkedIn profile banner template',
    category: 'social',
    previewUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&crop=center',
    isPremium: false,
    isNew: false,
    tags: ['linkedin', 'banner', 'professional'],
    views: 1234,
    rating: 4.5,
    colors: ['#0077b5', '#ffffff', '#2d3748']
  },
  {
    _id: '12',
    title: 'Restaurant Menu',
    description: 'Elegant restaurant menu design template',
    category: 'business',
    previewUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: true,
    tags: ['menu', 'restaurant', 'food'],
    views: 1567,
    rating: 4.7,
    colors: ['#7c2d12', '#fef3c7', '#1f2937']
  },
  {
    _id: '13',
    title: 'Movie Night Poster',
    description: 'Cinematic movie night event poster design',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: true,
    tags: ['movie', 'cinema', 'entertainment'],
    views: 2341,
    rating: 4.8,
    colors: ['#1f2937', '#fbbf24', '#dc2626']
  },
  {
    _id: '14',
    title: 'Music Festival Poster',
    description: 'Vibrant music festival promotional poster',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: false,
    tags: ['music', 'festival', 'concert'],
    views: 3456,
    rating: 4.9,
    colors: ['#7c3aed', '#ec4899', '#f59e0b']
  },
  {
    _id: '15',
    title: 'Art Exhibition Poster',
    description: 'Minimalist art gallery exhibition poster',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: false,
    tags: ['art', 'gallery', 'exhibition'],
    views: 1876,
    rating: 4.6,
    colors: ['#000000', '#ffffff', '#6b7280']
  },
  {
    _id: '16',
    title: 'Sports Event Poster',
    description: 'Dynamic sports tournament poster design',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: true,
    tags: ['sports', 'tournament', 'competition'],
    views: 2789,
    rating: 4.7,
    colors: ['#059669', '#1e40af', '#ffffff']
  },
  {
    _id: '17',
    title: 'Food Festival Poster',
    description: 'Delicious food festival promotional poster',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: true,
    tags: ['food', 'festival', 'culinary'],
    views: 1654,
    rating: 4.5,
    colors: ['#dc2626', '#f59e0b', '#065f46']
  },
  {
    _id: '18',
    title: 'Tech Conference Poster',
    description: 'Modern technology conference poster design',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: false,
    tags: ['tech', 'conference', 'innovation'],
    views: 2234,
    rating: 4.8,
    colors: ['#1e40af', '#06b6d4', '#f3f4f6']
  },
  {
    _id: '19',
    title: 'Fashion Show Poster',
    description: 'Elegant fashion runway show poster',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&crop=center',
    isPremium: false,
    isNew: false,
    tags: ['fashion', 'runway', 'style'],
    views: 1987,
    rating: 4.6,
    colors: ['#000000', '#ec4899', '#f8fafc']
  },
  {
    _id: '20',
    title: 'Charity Event Poster',
    description: 'Inspiring charity fundraising event poster',
    category: 'poster',
    previewUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=600&fit=crop&crop=center',
    isPremium: true,
    isNew: true,
    tags: ['charity', 'fundraising', 'community'],
    views: 1432,
    rating: 4.7,
    colors: ['#10b981', '#3b82f6', '#ffffff']
  }
];

const TemplatesGallery = () => {
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

  // Use sample data for demonstration
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      try {
        // In a real app, you would use:
        // const res = await axios.get('/api/templates', { params });
        // setTemplates(res.data || []);
        
        // For demo, use sample data
        setTimeout(() => {
          setTemplates(sampleTemplates);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to fetch templates', err);
        setError('Failed to load templates');
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  // Filter templates based on active category and search term
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

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
        template.title.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term) ||
        template.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [templates, activeCategory, searchTerm, filters]);

  const handleUseTemplate = async (tpl) => {
    try {
      // In a real app, you would use:
      // const res = await templateAPI.useTemplate(tpl._id);
      // const newDesign = res.data;
      // navigate(`/editor/${newDesign._id}`);
      
      // For demo, just navigate to editor with template ID
      navigate(`/editor?template=${tpl._id}`);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Stunning Templates for Every Occasion
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-indigo-100">
            Choose from thousands of professionally designed templates and customize them to fit your needs in minutes.
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-md leading-5 bg-indigo-700 bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 focus:text-gray-900 transition duration-150 ease-in-out"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaFilter className="mr-1.5 h-3 w-3" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.orientation}
                    onChange={(e) => setFilters({ ...filters, orientation: e.target.value })}
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={filters.color}
                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                  >
                    <option value="all">All Colors</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
            {activeCategory !== 'all' ? ` in ${categories.find(c => c.id === activeCategory)?.name || ''}` : ''}
            {searchTerm ? ` for "${searchTerm}"` : ''}
          </h2>
          <div className="text-sm text-gray-500">
            Showing {Math.min(filteredTemplates.length, 12)} of {filteredTemplates.length}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">Error loading templates</div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <FaPalette className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'There are no templates available in this category at the moment.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 hover:border-primary-200 flex flex-col h-full cursor-pointer"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={template.previewUrl || 'https://via.placeholder.com/400x600?text=Template+Preview'}
                        alt={template.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x600/${template.colors?.[0]?.replace('#', '') || '4F46E5'}/FFFFFF?text=${encodeURIComponent(template.title)}`;
                        }}
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseTemplate(template);
                            }}
                            className="flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200"
                          >
                            Use Template
                            <FaArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                        PRO
                      </div>
                    )}
                    
                    {/* New Badge */}
                    {template.isNew && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold rounded-full shadow-md">
                        NEW
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(template._id);
                      }}
                      className="absolute bottom-3 right-3 p-2.5 bg-white bg-opacity-95 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
                      aria-label={favorites.has(template._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.has(template._id) ? (
                        <FaHeart className="h-4 w-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 text-gray-400 hover:text-red-400" />
                      )}
                    </button>
                    
                    {/* Color Palette Preview */}
                    {template.colors && (
                      <div className="absolute bottom-3 left-3 flex space-x-1">
                        {template.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{template.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                      </div>
                      <div className="flex items-center ml-2">
                        <FaStar className="h-3 w-3 text-yellow-400" />
                        <span className="ml-1 text-xs font-medium text-gray-700">{template.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-wrap gap-1">
                        {template.tags?.slice(0, 2).map((tag, i) => (
                          <span 
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags?.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{template.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 font-medium">
                        {template.views?.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Load More Button (if needed) */}
        {filteredTemplates.length > 0 && (
          <div className="mt-10 text-center">
            <button
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                // In a real app, this would load more templates
                console.log('Load more clicked');
              }}
            >
              Load More Templates
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MATTY Design Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TemplatesGallery;
