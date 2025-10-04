import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { templateAPI } from '../../services/api';
import { 
  FaSpinner, 
  FaSearch, 
  FaStar, 
  FaPalette, 
  FaArrowRight,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'popular',
    orientation: 'all',
    color: 'all'
  });
  const navigate = useNavigate();
  
  // Sample featured templates for the hero section
  const featuredTemplates = templates.filter(t => t.featured).slice(0, 3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, templatesRes] = await Promise.all([
          templateAPI.getTemplateCategories(),
          templateAPI.getFeaturedTemplates()
        ]);
        
        setCategories(categoriesRes.data);
        setTemplates(templatesRes.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setLoading(true);
    setActiveCategory(categoryId);
    
    try {
      let response;
      if (categoryId === 'all') {
        response = await templateAPI.getFeaturedTemplates();
      } else {
        response = await templateAPI.getTemplatesByCategory(categoryId);
      }
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    try {
      const response = await templateAPI.useTemplate(templateId);
      navigate(`/editor/${response.data._id}`);
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const filteredTemplates = useCallback(() => {
    let result = [...templates];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(template => 
        template.title.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term) ||
        template.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(template => 
        template.categoryId === activeCategory || 
        template.category?._id === activeCategory
      );
    }
    
    // Apply additional filters
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    if (filters.orientation !== 'all') {
      result = result.filter(t => t.orientation === filters.orientation);
    }
    
    if (filters.color !== 'all') {
      result = result.filter(t => t.colors?.includes(filters.color));
    }
    
    return result;
  }, [templates, searchTerm, activeCategory, filters]);

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
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/images/logo-m.png" 
                alt="Matty Ai" 
                className="w-10 h-10 rounded-lg object-contain bg-white p-1" 
              />
              <span className="text-2xl font-bold text-white">MATTY Ai</span>
            </Link>
            
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-blue-200" />
              </div>
              <input
                type="text"
                placeholder="Search templates, categories, or tags..."
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-blue-500 bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1.5 rounded-md bg-blue-700 bg-opacity-30 hover:bg-opacity-50 transition-all"
                  aria-label="Filters"
                >
                  <FaFilter className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="ml-4">
              <Link 
                to="/editor" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New
              </Link>
            </div>
          </div>
          
          <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
              Stunning Templates for Every Need
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-blue-100">
              Jumpstart your design with our professionally crafted templates. Customize to your heart's content!
            </p>
          </div>
          
          {/* Featured Templates Carousel */}
          {featuredTemplates.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaStar className="mr-2 text-yellow-300" />
                Featured Templates
                <span className="ml-auto text-sm font-normal">
                  <Link to="/templates/featured" className="flex items-center text-blue-100 hover:text-white">
                    View all <FaArrowRight className="ml-1" size={12} />
                  </Link>
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <motion.div 
                    key={`featured-${template._id}`}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative pb-[56.25%]">
                      <img
                        src={template.thumbnail || 'https://via.placeholder.com/600x338?text=Template+Preview'}
                        alt={template.title}
                        className="absolute h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{template.title}</h3>
                          <p className="text-blue-100 text-sm line-clamp-1">{template.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <FaStar className="mr-1" /> Featured
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Templates
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.icon && (
                  <span className="mr-2">{category.icon}</span>
                )}
                {category.name}
                <span className="ml-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {templates.filter(t => t.categoryId === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-md p-4 mb-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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

      {/* Templates Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : filteredTemplates().length === 0 ? (
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
          {filteredTemplates().map((template) => (
            <motion.div
              key={template._id}
              variants={item}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative overflow-hidden">
                <div className="relative pb-[56.25%] bg-gray-50">
                  <img
                    src={template.thumbnail || 'https://via.placeholder.com/600x338?text=Template+Preview'}
                    alt={template.title}
                    className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button
                      onClick={() => handleUseTemplate(template._id)}
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
                    // Add to favorites logic here
                  }}
                  aria-label="Add to favorites"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {template.title}
                  </h3>
                  {template.isPremium && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2 flex-shrink-0">
                      Pro
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {template.description || 'No description available'}
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
                  <div className="flex items-center">
                    <div className="flex -space-x-1 overflow-hidden">
                      {[1, 2, 3].map((i) => (
                        <img
                          key={i}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                          src={`https://i.pravatar.cc/150?img=${i + 10}`}
                          alt=""
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {Math.floor(Math.random() * 100) + 1} users
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{template.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
    
    {/* Footer */}
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              About
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Blog
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Templates
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Pricing
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Privacy
            </a>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Matty AI. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
  );
};

export default TemplateGallery;