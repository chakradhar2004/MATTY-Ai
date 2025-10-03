const express = require('express');
const { body, validationResult } = require('express-validator');
const Design = require('../models/Design');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/designs
// @desc    Get user's designs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sortBy = 'lastModified', sortOrder = 'desc' } = req.query;
    
    const query = { userId: req.user._id };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const designs = await Design.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-jsonData'); // Exclude heavy jsonData for list view
    
    const total = await Design.countDocuments(query);
    
    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ message: 'Server error while fetching designs' });
  }
});

// @route   GET /api/designs/:id
// @desc    Get a specific design
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    
    res.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error while fetching design' });
  }
});

// @route   POST /api/designs
// @desc    Create a new design
// @access  Private
router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('jsonData')
    .notEmpty()
    .withMessage('Design data is required'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('canvasWidth')
    .optional()
    .isNumeric()
    .withMessage('Canvas width must be a number'),
  body('canvasHeight')
    .optional()
    .isNumeric()
    .withMessage('Canvas height must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, jsonData, tags, canvasWidth, canvasHeight, isPublic, isTemplate, isDraft, thumbnailUrl } = req.body;
    
    const design = new Design({
      userId: req.user._id,
      title,
      description: description || '',
      jsonData,
      tags: tags || [],
      canvasWidth: canvasWidth || 800,
      canvasHeight: canvasHeight || 600,
      isPublic: isPublic || false,
      isTemplate: isTemplate || false,
      isDraft: isDraft !== undefined ? isDraft : true,
      thumbnailUrl: thumbnailUrl || null
    });

    await design.save();
    
    res.status(201).json({
      message: 'Design saved successfully',
      design
    });
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error while creating design' });
  }
});

// @route   PUT /api/designs/:id
// @desc    Update a design
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, jsonData, tags, canvasWidth, canvasHeight, isPublic, isTemplate } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (jsonData !== undefined) updateData.jsonData = jsonData;
    if (tags !== undefined) updateData.tags = tags;
    if (canvasWidth !== undefined) updateData.canvasWidth = canvasWidth;
    if (canvasHeight !== undefined) updateData.canvasHeight = canvasHeight;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (isTemplate !== undefined) updateData.isTemplate = isTemplate;

    const design = await Design.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json({
      message: 'Design updated successfully',
      design
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error while updating design' });
  }
});

// @route   DELETE /api/designs/:id
// @desc    Delete a design
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error while deleting design' });
  }
});

// @route   GET /api/designs/public/templates
// @desc    Get public templates
// @access  Public
router.get('/public/templates', async (req, res) => {
  try {
    const { page = 1, limit = 10, tags } = req.query;
    
    const query = { isPublic: true, isTemplate: true };
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const templates = await Design.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-jsonData'); // Exclude heavy jsonData for list view
    
    const total = await Design.countDocuments(query);
    
    res.json({
      templates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error while fetching templates' });
  }
});

// @route   POST /api/designs/:id/duplicate
// @desc    Duplicate a design
// @access  Private
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalDesign = await Design.findOne({ 
      _id: req.params.id, 
      $or: [
        { userId: req.user._id },
        { isPublic: true }
      ]
    });

    if (!originalDesign) {
      return res.status(404).json({ message: 'Design not found or not accessible' });
    }

    const duplicatedDesign = new Design({
      userId: req.user._id,
      title: `${originalDesign.title} (Copy)`,
      description: originalDesign.description,
      jsonData: originalDesign.jsonData,
      tags: originalDesign.tags,
      canvasWidth: originalDesign.canvasWidth,
      canvasHeight: originalDesign.canvasHeight,
      isPublic: false,
      isTemplate: false
    });

    await duplicatedDesign.save();

    res.status(201).json({
      message: 'Design duplicated successfully',
      design: duplicatedDesign
    });
  } catch (error) {
    console.error('Duplicate design error:', error);
    res.status(500).json({ message: 'Server error while duplicating design' });
  }
});

module.exports = router;
