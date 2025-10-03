# Matty AI Design Tool

A comprehensive web-based graphic design platform built with React, Node.js, and MongoDB. Create stunning designs with an intuitive drag-and-drop canvas editor, complete with user management, templates, and admin features.

## ✨ Key Features

### 📦 Core Modules

- **User Authentication** → JWT-based login/register system + Google OAuth integration
- **Canvas Editor** → Advanced drag-drop shapes, text, images, and styling tools
- **Save/Load Designs** → Store and manage user-created designs in MongoDB
- **Export Functionality** → Download designs as PNG or PDF files
- **My Designs Dashboard** → Comprehensive design management interface
- **Templates System** → Pre-built templates for quick design creation
- **Admin Dashboard** → Complete user and template management system

### 🚀 Advanced Features

- **Drag-Drop Editor** with real-time preview
- **Image Upload** with Cloudinary integration
- **Text Styling** (fonts, size, colors, bold, italic)
- **Undo/Redo Functionality** with complete history management
- **Export Options** (PNG/PDF with high-quality rendering)
- **Template Gallery** with search and categorization
- **Google OAuth** for seamless social authentication
- **Role-Based Access Control** (Admin/User roles)
- **Responsive Design** that works on all devices

### 👥 User Roles

- **Admin** → Manage users, create/manage templates, view system statistics
- **Registered User** → Create, save, export designs, use templates
- **Guest User** → Browse templates and public designs

## 🛠️ Tech Stack

### Frontend
- **React** 18.2+ with Hooks and Context
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Konva.js** for canvas rendering
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Cloudinary** for image storage
- **bcryptjs** for password hashing

### DevOps & Security
- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** for API protection
- **Input validation** with express-validator
- **Environment-based configuration**

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Cloudinary Account** (for image uploads)
- **Google OAuth App** (for social login)

### Quick Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/matty-ai-design-tool.git
cd matty-ai-design-tool
```

2. **Install all dependencies:**
```bash
npm run install-all
```

3. **Configure environment variables:**
   - Copy `server/env.example` to `server/.env`
   - Fill in your configuration:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Seed the database with admin user and templates:**
```bash
cd server && npm run seed
```

5. **Start the development servers:**
```bash
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Login:** admin@matty.com / Admin@123

## 📁 Project Structure

```
matty-ai-design-tool/
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable components
│       │   ├── Auth/          # Authentication components
│       │   ├── Canvas/        # Canvas editor components
│       │   ├── Dashboard/     # Dashboard components
│       │   ├── Layout/        # Layout components
│       │   └── UI/           # Common UI components
│       ├── pages/             # Page components
│       ├── store/             # Redux store configuration
│       │   └── slices/       # Redux slices
│       └── services/          # API services
├── server/                    # Node.js Backend
│   ├── config/               # Configuration files
│   ├── middleware/           # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── designs.js       # Design management
│   │   ├── templates.js     # Template routes
│   │   ├── admin.js         # Admin routes
│   │   └── upload.js        # File upload routes
│   └── seeders/              # Database seeders
└── docs/                     # Documentation
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `GET /google` - Initiate Google OAuth
- `GET /google/callback` - Google OAuth callback

### Designs (`/api/designs`)
- `GET /` - Get user's designs
- `POST /` - Create new design
- `GET /:id` - Get specific design
- `PUT /:id` - Update design
- `DELETE /:id` - Delete design

### Templates (`/api/templates`)
- `GET /featured` - Get featured templates
- `GET /all` - Get all templates with pagination
- `GET /:id` - Get specific template
- `POST /:id/use` - Create design from template

### Admin (`/api/admin`) - Admin Only
- `GET /stats` - Get system statistics
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user
- `GET /designs` - Get all designs
- `PUT /designs/:id/template` - Toggle template status
- `DELETE /designs/:id` - Delete design

### File Upload (`/api/upload`)
- `POST /image` - Upload image files

## 🎨 Canvas Features

The canvas editor supports:

### Shapes
- **Rectangles** with customizable fill, stroke, and corner radius
- **Circles** with adjustable radius and styling
- **Triangles** and other polygons
- **Lines** and **Arrows** with various styles
- **Stars** and **Diamonds**

### Text Tools
- **Font Selection** (Arial, Helvetica, Times, etc.)
- **Font Sizing** (8px to 144px)
- **Text Styling** (Bold, Italic, Underline)
- **Text Colors** with color picker
- **Text Alignment** options

### Image Tools
- **Image Upload** via drag-drop or file browser
- **Image Positioning** and scaling
- **Image Effects** (opacity, filters)

### Advanced Features
- **Layer Management** with ordering controls
- **History System** with unlimited undo/redo
- **Grid System** with snap-to-grid
- **Zoom Controls** (10% to 500%)
- **Object Alignment** tools
- **Grouping** and ungrouping objects

## 👨‍💼 Admin Features

The admin dashboard provides:

### User Management
- View all registered users
- Change user roles (Admin/User)
- Delete user accounts
- Search and filter users
- User activity statistics

### Template Management
- Convert designs to templates
- Manage template visibility
- Delete templates
- Template usage analytics

### System Analytics
- Total users and admins count
- Design and template statistics
- User registration trends
- Most active users

## 🔒 Security Features

- **JWT Token Authentication** with secure secret
- **Password Hashing** using bcrypt with salt
- **Rate Limiting** to prevent API abuse
- **Input Validation** on all endpoints
- **CORS Protection** with allowed origins
- **Helmet.js** for security headers
- **MongoDB Injection Protection**
- **XSS Protection** through input sanitization

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
cd ../server && npm start
```

### Environment Setup
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
CLIENT_URL=https://your-domain.com
```

## 🧪 Testing

### Run Tests
```bash
# Client tests
cd client && npm test

# Server tests
cd server && npm test
```

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Canvas Editor Guide](docs/CANVAS.md)
- [Admin Guide](docs/ADMIN.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email:** support@mattyai.com
- **GitHub Issues:** [Create an issue](https://github.com/yourusername/matty-ai-design-tool/issues)
- **Documentation:** [Wiki](https://github.com/yourusername/matty-ai-design-tool/wiki)

## 🙏 Acknowledgments

- **Konva.js** for powerful 2D canvas library
- **MongoDB** for flexible data storage
- **Cloudinary** for image management
- **Tailwind CSS** for utility-first styling
- **React** community for excellent ecosystem

---

**Built with ❤️ by the Matty AI Team**