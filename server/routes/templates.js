const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Design = require('../models/Design');

// @route   GET /api/templates/categories
// @desc    Get all template categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'social-media', name: 'Social Media', icon: 'instagram' },
      { id: 'presentations', name: 'Presentations', icon: 'file-powerpoint' },
      { id: 'marketing', name: 'Marketing', icon: 'bullhorn' },
      { id: 'print', name: 'Print', icon: 'print' },
      { id: 'documents', name: 'Documents', icon: 'file-alt' }
    ];
    
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/templates/featured
// @desc    Get featured templates
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const templates = await Design.find({ 
      isTemplate: true,
      isPublic: true
    })
    .populate('userId', 'username')
    .select('title description thumbnailUrl tags canvasWidth canvasHeight')
    .sort({ createdAt: -1 })
    .limit(8);
    
    res.json(templates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/templates/all
// @desc    Get all templates
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';

    const query = { 
      isTemplate: true,
      isPublic: true
    };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const templates = await Design.find(query)
      .populate('userId', 'username')
      .select('title description thumbnailUrl tags canvasWidth canvasHeight')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalTemplates = await Design.countDocuments(query);
    
    res.json({
      templates,
      totalPages: Math.ceil(totalTemplates / limit),
      currentPage: page,
      totalTemplates
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/templates/:id
// @desc    Get template by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const template = await Design.findOne({ 
      _id: req.params.id,
      isTemplate: true 
    });
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }
    
    res.json(template);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Template not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/templates/:id/use
// @desc    Create a new design from template
// @access  Private
router.post('/:id/use', auth, async (req, res) => {
  try {
    const template = await Design.findOne({ 
      _id: req.params.id,
      isTemplate: true 
    });
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }
    
    // Create new design based on template
    const newDesign = new Design({
      title: `${template.title} Copy`,
      description: template.description,
      jsonData: template.jsonData,
      canvasWidth: template.canvasWidth,
      canvasHeight: template.canvasHeight,
      tags: template.tags,
      userId: req.user._id,
      isTemplate: false,
      isPublic: false
    });
    
    const design = await newDesign.save();
    res.json(design);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;