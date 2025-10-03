import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Image, 
  File, 
  Folder, 
  Search,
  Grid,
  List,
  Plus,
  Trash2,
  Download
} from 'lucide-react';

const AssetsPanel = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Assets', count: 24 },
    { id: 'images', name: 'Images', count: 18 },
    { id: 'icons', name: 'Icons', count: 6 },
    { id: 'shapes', name: 'Shapes', count: 12 },
  ];

  const assets = [
    { id: 1, name: 'hero-image.jpg', type: 'image', size: '2.4 MB', category: 'images' },
    { id: 2, name: 'logo.svg', type: 'vector', size: '156 KB', category: 'icons' },
    { id: 3, name: 'background.png', type: 'image', size: '1.8 MB', category: 'images' },
    { id: 4, name: 'arrow-icon.svg', type: 'vector', size: '89 KB', category: 'icons' },
    { id: 5, name: 'pattern.svg', type: 'vector', size: '234 KB', category: 'shapes' },
  ];

  const onDrop = (acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles);
    // Handle file upload logic here
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/svg+xml': ['.svg'],
    },
    multiple: true,
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Assets</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}
            >
              <Grid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">{assets.length} assets</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-3">Categories</h4>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center justify-between p-2 text-xs rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-gray-500">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-4 border-b border-gray-200">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600">
            {isDragActive ? 'Drop files here' : 'Drag & drop files or click to upload'}
          </p>
        </div>
      </div>

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAssets.length === 0 ? (
          <div className="p-4 text-center">
            <Folder className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No assets found</p>
          </div>
        ) : (
          <div className={`p-2 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-1'}`}>
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`group flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'flex' : 'flex-col text-center'
                }`}
              >
                {/* Asset Icon */}
                <div className={`${viewMode === 'grid' ? 'w-full h-12' : 'w-8 h-8'} bg-gray-100 rounded flex items-center justify-center flex-shrink-0`}>
                  {asset.type === 'image' ? (
                    <Image className="w-4 h-4 text-gray-400" />
                  ) : (
                    <File className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Asset Info */}
                <div className={`${viewMode === 'grid' ? 'mt-2' : 'flex-1 min-w-0 ml-3'}`}>
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {asset.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {asset.size}
                  </p>
                </div>

                {/* Asset Actions */}
                <div className={`${viewMode === 'grid' ? 'mt-2 opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} flex items-center space-x-1 transition-opacity`}>
                  <button
                    className="p-1 hover:bg-primary-100 text-primary-600 rounded"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full btn btn-outline btn-sm inline-flex items-center justify-center">
          <Plus className="w-3 h-3 mr-1" />
          Add Asset
        </button>
      </div>
    </div>
  );
};

export default AssetsPanel;
