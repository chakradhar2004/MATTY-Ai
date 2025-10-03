const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Design = require('../models/Design');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(auth);
router.use(admin);

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);

    res.json({
      users: users.map(user => user.getPublicProfile()),
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/users/:id/role', [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { role } = req.body;
    const userId = req.params.id;

    // Don't allow admin to change their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow admin to delete themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's designs first
    await Design.deleteMany({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and their designs deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get system statistics (admin only)
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalDesigns = await Design.countDocuments();
    const totalTemplates = await Design.countDocuments({ isTemplate: true });
    const publicDesigns = await Design.countDocuments({ isPublic: true });

    // Get user registrations by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get most active users (by number of designs)
    const mostActiveUsers = await Design.aggregate([
      {
        $group: {
          _id: '$userId',
          designCount: { $sum: 1 }
        }
      },
      { $sort: { designCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          email: '$user.email',
          designCount: 1
        }
      }
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalDesigns,
      totalTemplates,
      publicDesigns,
      userRegistrations,
      mostActiveUsers
    });
  } catch (error) {
    console.error('Admin get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/designs
// @desc    Get all designs for admin management
// @access  Private/Admin
router.get('/designs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const isTemplate = req.query.isTemplate;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (isTemplate !== undefined) {
      query.isTemplate = isTemplate === 'true';
    }

    const designs = await Design.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalDesigns = await Design.countDocuments(query);

    res.json({
      designs,
      totalPages: Math.ceil(totalDesigns / limit),
      currentPage: page,
      totalDesigns
    });
  } catch (error) {
    console.error('Admin get designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/designs/:id/template
// @desc    Toggle design template status (admin only)
// @access  Private/Admin
router.put('/designs/:id/template', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    design.isTemplate = !design.isTemplate;
    if (design.isTemplate) {
      design.isPublic = true; // Templates should be public
    }
    
    await design.save();

    res.json({
      message: `Design ${design.isTemplate ? 'added to' : 'removed from'} templates`,
      design
    });
  } catch (error) {
    console.error('Admin toggle template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/designs/:id
// @desc    Delete design (admin only)
// @access  Private/Admin
router.delete('/designs/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Admin delete design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;