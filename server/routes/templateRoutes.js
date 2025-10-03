const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const Design = require('../models/Design');
const TemplateModel = require('../models/Template');
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');

// Validation middleware
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
}

// Routes under /api/templates
router.get('/', getTemplates);
router.get('/:id', getTemplateById);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('title is required').isString().isLength({ max: 120 }),
    body('previewUrl').notEmpty().withMessage('previewUrl is required').isURL().withMessage('previewUrl must be a valid URL'),
    body('jsonData').notEmpty().withMessage('jsonData is required'),
    body('category').optional().isString(),
  ],
  validate,
  createTemplate
);

router.put(
  '/:id',
  [
    body('title').optional().isString().isLength({ max: 120 }),
    body('previewUrl').optional().isURL().withMessage('previewUrl must be a valid URL'),
    body('jsonData').optional(),
    body('category').optional().isString(),
  ],
  validate,
  updateTemplate
);

router.delete('/:id', deleteTemplate);

// Create a new design from a template and return the created design
router.post('/:id/use', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const tpl = await TemplateModel.findById(id);
    if (!tpl) return res.status(404).json({ message: 'Template not found' });

    const source = tpl.jsonData || {};
    const srcElements = source.elements || source.objects || [];
    // Ensure IDs so editor transformer selection works
    const elements = srcElements.map((el, idx) => ({ id: (el.id || `${Date.now()}_${idx}`), ...el }));
    const canvas = source.canvas || {};

    const design = await Design.create({
      userId: req.user._id,
      title: tpl.title,
      description: `Created from template: ${tpl.title}`,
      jsonData: { elements },
      tags: [tpl.category].filter(Boolean),
      canvasWidth: canvas.width || 800,
      canvasHeight: canvas.height || 600,
      isPublic: false,
      isTemplate: false,
      isDraft: false,
      thumbnailUrl: tpl.previewUrl || null,
    });

    return res.status(201).json(design);
  } catch (err) {
    console.error('use template error:', err);
    res.status(500).json({ message: 'Failed to use template' });
  }
});

module.exports = router;
