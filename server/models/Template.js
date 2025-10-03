const mongoose = require('mongoose');

// Template schema for pre-made designs users can customize
// Fields:
// - title: string, required
// - category: string (e.g., Poster, Resume, Flyer, Card, Invitation)
// - previewUrl: string, required (thumbnail for gallery)
// - jsonData: mixed object with design elements consumable by the editor
// - createdAt: date, default now
const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Template title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    previewUrl: {
      type: String,
      required: [true, 'Preview URL is required'],
      trim: true,
    },
    jsonData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'jsonData is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
templateSchema.index({ category: 1, createdAt: -1 });
templateSchema.index({ title: 'text' });

module.exports = mongoose.model('Template', templateSchema);
