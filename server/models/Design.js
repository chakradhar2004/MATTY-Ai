const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Design title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  jsonData: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Design data is required']
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  canvasWidth: {
    type: Number,
    default: 800
  },
  canvasHeight: {
    type: Number,
    default: 600
  },
  version: {
    type: Number,
    default: 1
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isDraft: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ isPublic: 1, isTemplate: 1 });
designSchema.index({ tags: 1 });
designSchema.index({ title: 'text', description: 'text' });

// Update lastModified on save
designSchema.pre('save', function(next) {
  if (this.isModified('jsonData') || this.isModified('title') || this.isModified('description')) {
    this.lastModified = new Date();
    this.version += 1;
  }
  next();
});

// Method to get public design info
designSchema.methods.getPublicInfo = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    thumbnailUrl: this.thumbnailUrl,
    tags: this.tags,
    isPublic: this.isPublic,
    isTemplate: this.isTemplate,
    canvasWidth: this.canvasWidth,
    canvasHeight: this.canvasHeight,
    version: this.version,
    lastModified: this.lastModified,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Design', designSchema);
