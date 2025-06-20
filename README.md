# AI-Powered E-commerce Search Platform

A full-stack application that combines React frontend with Node.js/Express backend and Python AI microservice for intelligent product search using both text and image inputs.

## 🚀 Features

### Frontend (React + Vite + Tailwind)
- **Text Search**: Real-time product search with pagination
- **Image Search**: Drag-and-drop image upload with preview
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Loading States**: Smooth animations and loading indicators
- **Error Handling**: Graceful error messages and fallbacks

### Backend (Node.js + Express)
- **RESTful API**: Clean endpoints for text and image search
- **File Upload**: Secure image handling with validation
- **CORS Support**: Configured for frontend integration
- **Logging**: Comprehensive Winston logging system
- **Error Handling**: Proper HTTP status codes and messages

### AI Microservice (Python + OpenCV + FAISS)
- **Image Processing**: OpenCV for image preprocessing
- **Feature Extraction**: OpenCLIP for visual feature vectors
- **Similarity Search**: FAISS for fast similarity matching
- **Product Tagging**: Intelligent product categorization

## 📁 Project Structure

```
ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── main.jsx         # App entry point
│   ├── package.json
│   ├── vite.config.js
│   └── env.example          # Frontend environment variables
│
└── backend/                  # Node.js + Python backend
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── services/        # Business logic
    │   ├── routes/          # API routes
    │   ├── middleware/      # Express middleware
    │   └── server.js        # Express server
    ├── python-service/      # Python AI microservice
    │   ├── faiss_service.py # FAISS similarity search
    │   └── requirements.txt # Python dependencies
    ├── uploads/             # Temporary file storage
    ├── logs/               # Application logs
    ├── package.json
    └── env.example         # Backend environment variables
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- RapidAPI account

### 1. Clone and Setup

```bash
# Navigate to project directory
cd ai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Python dependencies
cd python-service
pip install -r requirements.txt
cd ..
```

### 2. Environment Configuration

#### Frontend (.env)
```bash
cd frontend
cp env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Product Search
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=amazon-product-search1.p.rapidapi.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Python Service Configuration
PYTHON_SERVICE_PATH=./python-service
FAISS_INDEX_PATH=./python-service/index.faiss

# Logging Configuration
LOG_LEVEL=info
```

### 3. Get RapidAPI Key

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to "Amazon Product Search" API
3. Copy your API key to `backend/.env`

### 4. Start the Application

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000 (or 5173)
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔌 API Endpoints

### Text Search
```
GET /api/search/text?q=headphones&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "query": "headphones",
    "page": 1,
    "limit": 20,
    "total": 20
  }
}
```

### Image Search
```
POST /api/search/image
Content-Type: multipart/form-data
Body: { image: File }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "searchTags": ["electronics", "wireless", "bluetooth"],
    "originalImage": "headphones.jpg",
    "total": 20
  }
}
```

### Health Check
```
GET /health
```

## 🎯 Usage

### Text Search
1. Select "Text Search" mode
2. Enter your search query (e.g., "wireless headphones")
3. Press Enter or click Search
4. Browse results with pagination

### Image Search
1. Select "Image Search" mode
2. Drag and drop an image or click to browse
3. Wait for AI processing
4. View similar products based on image content

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
```

### Python Service Testing
```bash
cd backend/python-service
python faiss_service.py /path/to/test/image.jpg
```

## 🚀 Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Configure proper `RAPIDAPI_KEY`
- Set appropriate `LOG_LEVEL`
- Update `VITE_API_URL` for production

### Security Considerations
- Use HTTPS in production
- Implement rate limiting
- Add authentication/authorization
- Secure file uploads
- Monitor logs

### Performance Optimization
- Use PM2 for process management
- Implement caching (Redis)
- Optimize Python service
- Use CDN for static files

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL in backend CORS settings

2. **Python Service Not Found**
   - Ensure Python is installed and in PATH
   - Check `python-service/faiss_service.py` exists
   - Verify Python dependencies are installed

3. **RapidAPI Errors**
   - Check API key in `backend/.env`
   - Verify RapidAPI subscription is active
   - Check rate limits

4. **File Upload Issues**
   - Check file size (max 5MB)
   - Verify file type (JPG/PNG only)
   - Ensure uploads directory is writable

### Debug Mode

Enable debug logging:
```env
# Backend
LOG_LEVEL=debug

# Frontend
VITE_DEBUG=true
```

## 📊 Monitoring

### Logs
- **Backend**: `backend/logs/combined.log`
- **Errors**: `backend/logs/error.log`
- **Console**: Real-time logging in development

### Health Checks
- **Backend**: `GET /health`
- **Frontend**: Built-in error boundaries
- **Python Service**: Automatic fallback to mock data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs in `backend/logs/` directory
3. Open an issue with detailed error information

---

**Note**: This application includes mock data generation for demonstration purposes when external services are unavailable. In production, ensure all services are properly configured. 