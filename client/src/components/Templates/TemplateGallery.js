import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { templateAPI } from '../../services/api';
import { FaSpinner, FaFilter, FaSearch } from 'react-icons/fa';

const TemplateGallery = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top logo header (click to go home) */}
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center space-x-2 group">
          <img src="/images/logo-m.png" alt="Matty Ai" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">MATTY Ai</span>
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <button
            className={`px-4 py-2 rounded-full ${
              activeCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All Templates
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full flex items-center ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative pb-[56.25%]">
                <img
                  src={template.thumbnail || 'https://via.placeholder.com/300x169?text=No+Preview'}
                  alt={template.title}
                  className="absolute h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{template.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{template.description}</p>
                <button
                  onClick={() => handleUseTemplate(template._id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;