const Template = require('../models/Template');

// GET /api/templates?category=Poster
async function getTemplates(req, res) {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category.toLowerCase() !== 'all') {
      query.category = category;
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    console.error('getTemplates error:', err);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
}

// GET /api/templates/:id
async function getTemplateById(req, res) {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.status(200).json(template);
  } catch (err) {
    console.error('getTemplateById error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid template id' });
    res.status(500).json({ message: 'Failed to fetch template' });
  }
}

// POST /api/templates
async function createTemplate(req, res) {
  try {
    const { title, category, previewUrl, jsonData } = req.body;
    if (!title || !previewUrl || !jsonData) {
      return res.status(400).json({ message: 'title, previewUrl and jsonData are required' });
    }

    const template = await Template.create({ title, category, previewUrl, jsonData });
    res.status(201).json({ message: 'Template created', template });
  } catch (err) {
    console.error('createTemplate error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    res.status(500).json({ message: 'Failed to create template' });
  }
}

// PUT /api/templates/:id
async function updateTemplate(req, res) {
  try {
    const { id } = req.params;
    const update = {};
    const fields = ['title', 'category', 'previewUrl', 'jsonData'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });

    const template = await Template.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.status(200).json({ message: 'Template updated', template });
  } catch (err) {
    console.error('updateTemplate error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid template id' });
    if (err.name === 'ValidationError') return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Failed to update template' });
  }
}

// DELETE /api/templates/:id
async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndDelete(id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.status(200).json({ message: 'Template deleted' });
  } catch (err) {
    console.error('deleteTemplate error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid template id' });
    res.status(500).json({ message: 'Failed to delete template' });
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
