# 📋 Matty AI Design Tool - Requirements

## 🖥️ **System Requirements**

### **Minimum Requirements**
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4 or higher (local or Atlas)
- **npm**: v8.0.0 or higher
- **RAM**: 2GB minimum
- **Storage**: 10GB free space
- **Internet**: Stable connection for Cloudinary

### **Recommended Requirements**
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **RAM**: 4GB or more
- **Storage**: 50GB SSD
- **CPU**: 4 cores or more

## 🔧 **Development Environment**

### **Required Software**
1. **Node.js** - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
3. **Git** - [Download here](https://git-scm.com/)
4. **Code Editor** - VS Code recommended

### **Optional but Recommended**
- **MongoDB Compass** - Database GUI
- **Postman** - API testing
- **Chrome DevTools** - Debugging

## 📦 **Dependencies Breakdown**

### **Backend Dependencies (Node.js)**
```json
{
  "express": "4.18.2",           // Web framework
  "mongoose": "8.0.3",           // MongoDB ODM
  "bcryptjs": "2.4.3",           // Password hashing
  "jsonwebtoken": "9.0.2",       // JWT authentication
  "helmet": "7.1.0",              // Security headers
  "cors": "2.8.5",               // Cross-origin requests
  "express-rate-limit": "7.1.5", // Rate limiting
  "multer": "1.4.5-lts.1",       // File uploads
  "cloudinary": "1.41.0",        // Image storage
  "express-validator": "7.0.1",   // Input validation
  "dotenv": "16.3.1",            // Environment variables
  "nodemon": "3.0.2"             // Development server
}
```

### **Frontend Dependencies (React)**
```json
{
  "react": "18.2.0",             // UI library
  "react-dom": "18.2.0",         // React DOM
  "react-scripts": "5.0.1",      // Build tools
  "@reduxjs/toolkit": "2.0.1",   // State management
  "react-redux": "9.0.4",        // Redux bindings
  "react-router-dom": "6.20.1",  // Routing
  "react-konva": "18.2.10",      // Canvas library
  "konva": "9.2.0",              // 2D canvas
  "axios": "1.6.2",              // HTTP client
  "react-dropzone": "14.2.3",   // File drops
  "react-toastify": "9.1.3",     // Notifications
  "lucide-react": "0.294.0",     // Icons
  "jspdf": "2.5.1",              // PDF export
  "html2canvas": "1.4.1",        // Canvas to image
  "tailwindcss": "3.3.6",        // CSS framework
  "autoprefixer": "10.4.16",     // CSS processing
  "postcss": "8.4.32"            // CSS transformation
}
```

## 🌐 **External Services Required**

### **1. MongoDB Database**
- **Local**: Install MongoDB Community Server
- **Cloud**: MongoDB Atlas (free tier available)
- **Connection**: Update `MONGODB_URI` in environment

### **2. Cloudinary (Image Storage)**
- **Account**: Free tier available
- **Storage**: 25GB free
- **Bandwidth**: 25GB free
- **Setup**: Get API credentials from dashboard

### **3. Optional Services**
- **Redis**: For session management (optional)
- **Email Service**: For notifications (optional)
- **CDN**: For static assets (optional)

## 🔐 **Security Requirements**

### **Environment Variables**
```bash
# Required
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/matty-design
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Optional
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### **Security Features**
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured for specific domains
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Server-side validation
- **Helmet**: Security headers

## 🚀 **Installation Commands**

### **Quick Setup**
```bash
# 1. Clone repository
git clone <repository-url>
cd matty

# 2. Install all dependencies
npm run install-all

# 3. Set up environment
cp server/env.example server/.env
# Edit server/.env with your credentials

# 4. Start development
npm run dev
```

### **Manual Installation**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## 🌍 **Browser Support**

### **Supported Browsers**
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

### **Features by Browser**
- **Canvas**: All modern browsers
- **File Upload**: All modern browsers
- **Drag & Drop**: All modern browsers
- **WebGL**: Required for advanced graphics

## 📱 **Mobile Support**

### **Responsive Design**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Touch Support**
- **Touch Events**: Canvas manipulation
- **Gesture Support**: Pinch to zoom
- **Mobile UI**: Optimized for touch

## 🔄 **Development Workflow**

### **Available Scripts**
```bash
# Development
npm run dev          # Start both client and server
npm run client       # Start React development server
npm run server       # Start Node.js server

# Production
npm run build        # Build React app
npm start           # Start production server

# Utilities
npm run install-all # Install all dependencies
```

### **Hot Reload**
- **Frontend**: Automatic reload on file changes
- **Backend**: Automatic restart on file changes
- **Database**: Real-time updates

## 📊 **Performance Requirements**

### **Minimum Performance**
- **Page Load**: < 3 seconds
- **Canvas Rendering**: 60 FPS
- **File Upload**: < 10MB per file
- **Memory Usage**: < 512MB

### **Recommended Performance**
- **Page Load**: < 1 second
- **Canvas Rendering**: 120 FPS
- **File Upload**: < 50MB per file
- **Memory Usage**: < 1GB

## 🛠️ **Development Tools**

### **Required Tools**
- **Node.js**: Runtime environment
- **npm**: Package manager
- **Git**: Version control
- **Code Editor**: VS Code recommended

### **Recommended Tools**
- **MongoDB Compass**: Database GUI
- **Postman**: API testing
- **Chrome DevTools**: Debugging
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🚀 **Deployment Requirements**

### **Frontend Hosting**
- **Vercel**: Recommended (free tier)
- **Netlify**: Alternative (free tier)
- **GitHub Pages**: Static hosting

### **Backend Hosting**
- **Render**: Recommended (free tier)
- **Railway**: Alternative (free tier)
- **Cyclic**: Alternative (free tier)
- **Heroku**: Alternative (paid)

### **Database Hosting**
- **MongoDB Atlas**: Recommended (free tier)
- **Self-hosted**: Advanced users

## 📈 **Scaling Requirements**

### **Small Scale (1-100 users)**
- **RAM**: 2GB
- **CPU**: 2 cores
- **Storage**: 10GB
- **Database**: MongoDB Atlas M0

### **Medium Scale (100-1000 users)**
- **RAM**: 4GB
- **CPU**: 4 cores
- **Storage**: 50GB
- **Database**: MongoDB Atlas M2

### **Large Scale (1000+ users)**
- **RAM**: 8GB+
- **CPU**: 8 cores+
- **Storage**: 100GB+
- **Database**: MongoDB Atlas M5+

## 🔍 **Monitoring & Logging**

### **Recommended Tools**
- **PM2**: Process management
- **Winston**: Logging
- **New Relic**: Application monitoring
- **Sentry**: Error tracking

### **Log Levels**
- **Error**: Critical issues
- **Warn**: Warnings
- **Info**: General information
- **Debug**: Development debugging

## 📋 **Checklist**

### **Before Development**
- [ ] Node.js installed (v16+)
- [ ] MongoDB running (local or Atlas)
- [ ] Cloudinary account created
- [ ] Environment variables set
- [ ] Dependencies installed

### **Before Deployment**
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Cloudinary credentials verified
- [ ] Security settings reviewed
- [ ] Performance tested

### **After Deployment**
- [ ] Application accessible
- [ ] User registration working
- [ ] Canvas editor functional
- [ ] File upload working
- [ ] Export features working

---

**Note**: This requirements file covers all aspects of the Matty AI Design Tool. Make sure to meet all the minimum requirements before starting development.
