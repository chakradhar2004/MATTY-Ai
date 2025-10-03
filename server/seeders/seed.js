const mongoose = require('mongoose');
const User = require('../models/User');
const Design = require('../models/Design');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kakkuluruchakradhargoud_db_user:IK93aR8i37tw7Tih@cluster0.lhloglq.mongodb.net/mattydb?retryWrites=true&w=majority&appName=Cluster0');
    
    console.log('Connected to MongoDB');
    
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@matty.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      adminUser = new User({
        username: 'admin',
        email: adminEmail,
        passwordHash: 'Admin@123', // This will be hashed by the pre-save middleware
        role: 'admin',
        isEmailVerified: true
      });
      
      await adminUser.save();
      console.log('Admin user created:', adminEmail);
    } else {
      console.log('Admin user already exists');
    }

    // Check if templates already exist
    const existingTemplates = await Design.countDocuments({ isTemplate: true });
    
    if (existingTemplates === 0) {
      // Create default templates
      const templates = [
        {
          title: 'Instagram Post - Quote',
          description: 'Beautiful quote template for Instagram posts',
          jsonData: {
            elements: [
              {
                id: '1',
                type: 'rect',
                x: 0,
                y: 0,
                width: 400,
                height: 400,
                fill: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '2',
                type: 'text',
                x: 50,
                y: 150,
                text: 'Inspirational Quote',
                fontSize: 28,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '3',
                type: 'text',
                x: 50,
                y: 200,
                text: '"The future belongs to those who believe in the beauty of their dreams."',
                fontSize: 16,
                fontFamily: 'Arial',
                fontStyle: 'italic',
                fill: 'white',
                opacity: 0.9,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              }
            ]
          },
          thumbnailUrl: null,
          tags: ['instagram', 'quote', 'social-media', 'inspiration'],
          isPublic: true,
          isTemplate: true,
          canvasWidth: 400,
          canvasHeight: 400,
          userId: adminUser._id
        },
        {
          title: 'Business Card - Modern',
          description: 'Clean and modern business card template',
          jsonData: {
            elements: [
              {
                id: '1',
                type: 'rect',
                x: 0,
                y: 0,
                width: 350,
                height: 200,
                fill: '#2c3e50',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '2',
                type: 'text',
                x: 20,
                y: 30,
                text: 'John Doe',
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '3',
                type: 'text',
                x: 20,
                y: 60,
                text: 'Creative Designer',
                fontSize: 14,
                fontFamily: 'Arial',
                fill: '#ecf0f1',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '4',
                type: 'text',
                x: 20,
                y: 120,
                text: 'john@example.com',
                fontSize: 12,
                fontFamily: 'Arial',
                fill: '#bdc3c7',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '5',
                type: 'text',
                x: 20,
                y: 140,
                text: '+1 (555) 123-4567',
                fontSize: 12,
                fontFamily: 'Arial',
                fill: '#bdc3c7',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              }
            ]
          },
          thumbnailUrl: null,
          tags: ['business-card', 'professional', 'print', 'contact'],
          isPublic: true,
          isTemplate: true,
          canvasWidth: 350,
          canvasHeight: 200,
          userId: adminUser._id
        },
        {
          title: 'Flyer - Event',
          description: 'Eye-catching event flyer template',
          jsonData: {
            elements: [
              {
                id: '1',
                type: 'rect',
                x: 0,
                y: 0,
                width: 300,
                height: 450,
                fill: '#f39c12',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '2',
                type: 'text',
                x: 30,
                y: 50,
                text: 'SUMMER',
                fontSize: 36,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '3',
                type: 'text',
                x: 30,
                y: 90,
                text: 'FESTIVAL',
                fontSize: 36,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '4',
                type: 'text',
                x: 30,
                y: 200,
                text: 'Join us for an amazing weekend',
                fontSize: 16,
                fontFamily: 'Arial',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '5',
                type: 'text',
                x: 30,
                y: 250,
                text: 'July 15-17, 2024',
                fontSize: 20,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: '#2c3e50',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '6',
                type: 'text',
                x: 30,
                y: 280,
                text: 'Central Park, NYC',
                fontSize: 14,
                fontFamily: 'Arial',
                fill: '#2c3e50',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              }
            ]
          },
          thumbnailUrl: null,
          tags: ['flyer', 'event', 'festival', 'marketing', 'print'],
          isPublic: true,
          isTemplate: true,
          canvasWidth: 300,
          canvasHeight: 450,
          userId: adminUser._id
        },
        {
          title: 'Logo - Circular Badge',
          description: 'Clean circular badge logo template',
          jsonData: {
            elements: [
              {
                id: '1',
                type: 'circle',
                x: 150,
                y: 150,
                radius: 120,
                fill: '#3498db',
                strokeColor: '#2c3e50',
                strokeWidth: 8,
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '2',
                type: 'text',
                x: 80,
                y: 120,
                text: 'YOUR',
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '3',
                type: 'text',
                x: 75,
                y: 150,
                text: 'BRAND',
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: 'white',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '4',
                type: 'text',
                x: 95,
                y: 180,
                text: '2024',
                fontSize: 16,
                fontFamily: 'Arial',
                fill: 'white',
                opacity: 0.8,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              }
            ]
          },
          thumbnailUrl: null,
          tags: ['logo', 'badge', 'circular', 'brand', 'professional'],
          isPublic: true,
          isTemplate: true,
          canvasWidth: 300,
          canvasHeight: 300,
          userId: adminUser._id
        },
        {
          title: 'Presentation Slide - Title',
          description: 'Professional presentation title slide template',
          jsonData: {
            elements: [
              {
                id: '1',
                type: 'rect',
                x: 0,
                y: 0,
                width: 800,
                height: 600,
                fill: '#ecf0f1',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '2',
                type: 'rect',
                x: 0,
                y: 0,
                width: 800,
                height: 100,
                fill: '#2c3e50',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '3',
                type: 'text',
                x: 100,
                y: 200,
                text: 'Presentation Title',
                fontSize: 48,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fill: '#2c3e50',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '4',
                type: 'text',
                x: 100,
                y: 280,
                text: 'Subtitle or description goes here',
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#7f8c8d',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '5',
                type: 'text',
                x: 100,
                y: 450,
                text: 'Presented by: Your Name',
                fontSize: 18,
                fontFamily: 'Arial',
                fill: '#95a5a6',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              },
              {
                id: '6',
                type: 'text',
                x: 100,
                y: 480,
                text: 'Date: ' + new Date().toLocaleDateString(),
                fontSize: 14,
                fontFamily: 'Arial',
                fill: '#95a5a6',
                opacity: 1,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              }
            ]
          },
          thumbnailUrl: null,
          tags: ['presentation', 'slide', 'title', 'professional', 'business'],
          isPublic: true,
          isTemplate: true,
          canvasWidth: 800,
          canvasHeight: 600,
          userId: adminUser._id
        }
      ];

      for (const template of templates) {
        await Design.create(template);
      }

      console.log(`Created ${templates.length} default templates`);
    } else {
      console.log(`${existingTemplates} templates already exist`);
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();