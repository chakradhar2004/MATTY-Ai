import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isTemplate: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Design || mongoose.model('Design', designSchema);
