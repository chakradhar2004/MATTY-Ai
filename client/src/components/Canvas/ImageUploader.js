import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { uploadAPI } from '../../services/api';
import { addObject } from '../../store/slices/canvasSlice';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const ImageUploader = ({ onClose }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);
    
    try {
      // Get upload signature for direct upload
      const signatureResponse = await uploadAPI.getUploadSignature();
      const { signature, timestamp, cloudName, apiKey } = signatureResponse.data;
      
      // Upload directly to Cloudinary
      const uploadResponse = await uploadAPI.uploadDirectToCloudinary(
        file, 
        'matty_uploads', 
        { signature, timestamp, cloudName, apiKey }
      );
      
      const { secure_url: imageUrl, width, height } = uploadResponse.data;
      
      // Add image to canvas
      dispatch(addObject({
        type: 'image',
        src: imageUrl,
        x: 100,
        y: 100,
        width: Math.min(width, 300),
        height: Math.min(height, 300),
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      }));
      
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [dispatch, onClose]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-blue-500 text-3xl mb-2" />
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaCloudUploadAlt className="text-blue-500 text-5xl mb-2" />
            <p className="text-gray-700">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Supported formats: JPEG, PNG, GIF, WebP (max 10MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;