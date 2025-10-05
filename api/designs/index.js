// pages/api/designs/index.js
import connectDB from '../lib/mongodb';
import Design from '../models/Design';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    switch (req.method) {
      case 'GET':
        const designs = await Design.find({ userId: decoded.userId })
          .sort({ updatedAt: -1 })
          .limit(50);

        return res.status(200).json({ designs });

      case 'POST':
        const { name, data, thumbnail, isPublic = false } = req.body;

        if (!name || !data) {
          return res.status(400).json({ message: 'Name and data are required' });
        }

        const newDesign = new Design({
          userId: decoded.userId,
          name,
          data,
          thumbnail,
          isPublic,
        });

        await newDesign.save();

        return res.status(201).json({
          message: 'Design saved successfully',
          design: newDesign,
        });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Designs API error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
