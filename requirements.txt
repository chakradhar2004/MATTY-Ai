# Matty AI Design Tool - Requirements
# This file contains all the dependencies and system requirements

# ===========================================
# SYSTEM REQUIREMENTS
# ===========================================

# Node.js: v16.0.0 or higher
# MongoDB: v4.4 or higher (local or Atlas)
# npm: v8.0.0 or higher
# Git: Latest version

# ===========================================
# BACKEND DEPENDENCIES (Node.js/Express)
# ===========================================

# Core Framework
express==4.18.2
mongoose==8.0.3

# Authentication & Security
bcryptjs==2.4.3
jsonwebtoken==9.0.2
helmet==7.1.0
cors==2.8.5
express-rate-limit==7.1.5

# File Upload & Storage
multer==1.4.5-lts.1
cloudinary==1.41.0

# Validation & Utilities
express-validator==7.0.1
dotenv==16.3.1

# Development Tools
nodemon==3.0.2

# ===========================================
# FRONTEND DEPENDENCIES (React)
# ===========================================

# Core React
react==18.2.0
react-dom==18.2.0
react-scripts==5.0.1

# State Management
@reduxjs/toolkit==2.0.1
react-redux==9.0.4

# Routing
react-router-dom==6.20.1

# Canvas & Graphics
react-konva==18.2.10
konva==9.2.0

# HTTP Client
axios==1.6.2

# File Handling
react-dropzone==14.2.3

# UI & Notifications
react-toastify==9.1.3
lucide-react==0.294.0

# Export & PDF
jspdf==2.5.1
html2canvas==1.4.1

# Styling
tailwindcss==3.3.6
autoprefixer==10.4.16
postcss==8.4.32

# Utilities
clsx==2.0.0

# Development
@types/react==18.2.42
@types/react-dom==18.2.17

# ===========================================
# ROOT DEPENDENCIES
# ===========================================

# Development
concurrently==8.2.2

# ===========================================
# ENVIRONMENT VARIABLES REQUIRED
# ===========================================

# Server Configuration
# PORT=5000
# NODE_ENV=development

# Database
# MONGODB_URI=mongodb://localhost:27017/matty-design
# OR MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/matty-design

# Authentication
# JWT_SECRET=your-super-secret-jwt-key-here

# Client URL
# CLIENT_URL=http://localhost:3000

# Cloudinary (Image Storage)
# CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
# CLOUDINARY_API_KEY=your-cloudinary-api-key
# CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# ===========================================
# OPTIONAL DEPENDENCIES
# ===========================================

# Redis (for session management)
# redis==4.6.0

# Socket.io (for real-time collaboration)
# socket.io==4.7.4
# socket.io-client==4.7.4

# Email Service
# nodemailer==6.9.7

# Image Processing
# sharp==0.32.6

# ===========================================
# INSTALLATION COMMANDS
# ===========================================

# Install all dependencies:
# npm run install-all

# Or install separately:
# npm install                    # Root dependencies
# cd server && npm install      # Backend dependencies
# cd client && npm install       # Frontend dependencies

# ===========================================
# DEVELOPMENT COMMANDS
# ===========================================

# Start development servers:
# npm run dev

# Start frontend only:
# npm run client

# Start backend only:
# npm run server

# Build for production:
# npm run build

# ===========================================
# PRODUCTION REQUIREMENTS
# ===========================================

# Minimum Server Specs:
# RAM: 2GB
# CPU: 2 cores
# Storage: 10GB
# Network: 100Mbps

# Recommended Server Specs:
# RAM: 4GB
# CPU: 4 cores
# Storage: 50GB SSD
# Network: 1Gbps

# ===========================================
# BROWSER SUPPORT
# ===========================================

# Supported Browsers:
# Chrome: 90+
# Firefox: 88+
# Safari: 14+
# Edge: 90+

# ===========================================
# DATABASE REQUIREMENTS
# ===========================================

# MongoDB:
# Version: 4.4+
# Storage: 1GB minimum
# Indexes: Automatic on frequently queried fields

# ===========================================
# CLOUD STORAGE REQUIREMENTS
# ===========================================

# Cloudinary:
# Free tier: 25GB storage, 25GB bandwidth
# Paid plans: Up to 1TB storage, unlimited bandwidth

# ===========================================
# SECURITY REQUIREMENTS
# ===========================================

# SSL Certificate: Required for production
# HTTPS: Required for production
# CORS: Configured for specific domains
# Rate Limiting: 100 requests per 15 minutes
# Password Hashing: bcrypt with 12 salt rounds

# ===========================================
# MONITORING & LOGGING
# ===========================================

# Recommended Tools:
# PM2: Process management
# Winston: Logging
# New Relic: Application monitoring
# Sentry: Error tracking

# ===========================================
# DEPLOYMENT PLATFORMS
# ===========================================

# Frontend:
# Vercel: Recommended
# Netlify: Alternative
# GitHub Pages: Static hosting

# Backend:
# Render: Recommended
# Railway: Alternative
# Cyclic: Alternative
# Heroku: Alternative

# Database:
# MongoDB Atlas: Recommended
# Self-hosted MongoDB: Advanced users

# ===========================================
# BACKUP REQUIREMENTS
# ===========================================

# Database Backups:
# Frequency: Daily
# Retention: 30 days
# Location: Multiple regions

# File Backups:
# Frequency: Real-time
# Retention: 90 days
# Location: Cloudinary + local backup
