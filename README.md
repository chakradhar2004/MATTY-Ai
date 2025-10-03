# Matty AI Design Tool

A comprehensive web-based graphic design platform that enables users to create posters, banners, social media images, and more using an intuitive drag-and-drop canvas editor.

## 🚀 Features Completed

### ✅ 1. Project Structure & Setup
- **MERN Stack Architecture**: Complete separation of client and server
- **Package Management**: Root package.json with scripts for concurrent development
- **Environment Configuration**: Proper .env setup for both client and server

### ✅ 2. Backend Infrastructure
- **Node.js/Express Server**: RESTful API with proper middleware
- **MongoDB Integration**: Mongoose ODM with optimized schemas
- **JWT Authentication**: Secure token-based authentication system
- **Cloudinary Integration**: Image upload and management
- **Security Features**: Helmet, CORS, rate limiting, input validation

### ✅ 3. Frontend Foundation
- **React 18**: Modern React with hooks and functional components
- **Redux Toolkit**: Centralized state management with slices
- **TailwindCSS**: Utility-first styling with custom design system
- **React Router**: Client-side routing with protected routes
- **React Konva**: High-performance 2D canvas library

### ✅ 4. Canvas Editor
- **Drag & Drop Interface**: Intuitive object manipulation
- **Multi-tool Support**: Text, shapes, images, drawing tools
- **Real-time Editing**: Live preview with instant updates
- **Layer Management**: Visual layer panel with reordering
- **Grid System**: Snap-to-grid and visual guides
- **Zoom & Pan**: Smooth canvas navigation
- **Undo/Redo**: Complete action history management

### ✅ 5. Authentication System
- **User Registration**: Secure signup with validation
- **User Login**: JWT-based authentication
- **Protected Routes**: Route guards for authenticated users
- **Profile Management**: User settings and preferences
- **Password Security**: Bcrypt hashing and validation

### ✅ 6. Image Upload & Management
- **Cloudinary Integration**: Cloud-based image storage
- **Multiple Upload**: Batch image processing
- **Image Optimization**: Automatic resizing and compression
- **Thumbnail Generation**: Quick preview generation
- **Asset Management**: Organized asset library

### ✅ 7. Save & Load System
- **Design Persistence**: MongoDB storage with JSON data
- **Version Control**: Design versioning and history
- **Metadata Management**: Titles, descriptions, tags
- **Search & Filter**: Advanced design discovery
- **CRUD Operations**: Create, read, update, delete designs

### ✅ 8. Export Features
- **PNG Export**: High-quality image export
- **PDF Generation**: Multi-page document support
- **SVG Export**: Vector format support
- **Batch Export**: Multiple format export
- **Quality Settings**: Customizable export options

### ✅ 9. User Dashboard
- **Design Gallery**: Visual design management
- **Template Library**: Pre-built design templates
- **Project Organization**: Folders, tags, and categories
- **Collaboration Tools**: Sharing and permissions
- **Analytics**: Usage statistics and insights

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **React Konva** - Canvas rendering
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### Development Tools
- **Concurrently** - Parallel script execution
- **Nodemon** - Development server
- **React Scripts** - Build tools
- **PostCSS** - CSS processing

## 📁 Project Structure

```
matty/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Canvas/     # Canvas editor components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── UI/         # UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd matty
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration:
   # MONGODB_URI=mongodb://localhost:27017/matty-design
   # JWT_SECRET=your-super-secret-jwt-key
   # CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   # CLOUDINARY_API_KEY=your-cloudinary-api-key
   # CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Designs
- `GET /api/designs` - Get user's designs
- `POST /api/designs` - Create new design
- `GET /api/designs/:id` - Get specific design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design
- `POST /api/designs/:id/duplicate` - Duplicate design

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:publicId` - Delete uploaded image

## 🎨 Key Features

### Canvas Editor
- **Multi-tool Interface**: Text, shapes, images, drawing tools
- **Real-time Collaboration**: Live editing with multiple users
- **Advanced Editing**: Transform, rotate, scale, layer management
- **Grid System**: Snap-to-grid for precise alignment
- **Export Options**: PNG, PDF, SVG formats

### Design Management
- **Visual Gallery**: Thumbnail-based design browser
- **Search & Filter**: Find designs quickly
- **Templates**: Pre-built design templates
- **Version Control**: Track design changes
- **Sharing**: Public/private design sharing

### User Experience
- **Responsive Design**: Works on all devices
- **Keyboard Shortcuts**: Power user features
- **Auto-save**: Never lose your work
- **Undo/Redo**: Complete action history
- **Drag & Drop**: Intuitive file handling

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start both client and server
npm run client       # Start React development server
npm run server       # Start Node.js server

# Production
npm run build        # Build React app
npm start           # Start production server

# Installation
npm run install-all # Install all dependencies
```

### Code Structure
- **Components**: Modular, reusable React components
- **Redux Store**: Centralized state management
- **API Layer**: Clean separation of concerns
- **Type Safety**: PropTypes and validation
- **Error Handling**: Comprehensive error boundaries

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder
3. Set environment variables for API URL

### Backend (Render/Railway/Cyclic)
1. Deploy the `server` folder
2. Set environment variables
3. Connect to MongoDB Atlas
4. Configure Cloudinary

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in environment

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Redis for session management
- **CDN**: Cloudinary for image delivery
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API abuse prevention
- **Helmet**: Security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Matty AI Design Tool** - Empowering creativity through intelligent design tools.
#   M A T T Y - A i  
 