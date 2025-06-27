# Backend for AI-Powered Product Search

Node.js/Express backend with Python microservice for AI-powered product, image, and voice search.

## 🚀 Features
- RESTful API for text, image, and voice search
- Secure file upload (image search)
- CORS support for frontend integration (with allowed origins)
- Logging and error handling
- Integrates with RapidAPI (Amazon, Product Search API)
- **Amazon results limited to 10 per search**
- **Clarifai-powered image search:** Detects objects in images and uses the most likely keyword for product search
- **INR price conversion:** Amazon (USD) prices are converted to INR for display
- **Category section:** Supports category-based search from frontend
- **Combined search:** Returns results from both Amazon and Product Search APIs

## 🛠️ Tech Stack
- Node.js + Express
- Python 3 (microservice)
- Axios (API calls)
- Multer (file upload)
- Winston (logging)

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- Python 3.8+
- npm or yarn
- RapidAPI account/key

### Installation
```bash
cd backend
npm install
cd python-service
pip install -r requirements.txt
```

### Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Running the Backend
```bash
# Start backend server
npm run dev
# (or) npm start
```

## 🔌 API Endpoints
- `GET /api/search?q=keyword` — Text search (Amazon + Product Search API)
- `POST /api/search/image` — Image search (Clarifai + product search)
- `GET /health` — Health check

## 🐞 Troubleshooting
- **CORS errors:** Ensure allowed origins in CORS config.
- **RapidAPI errors:** Check API key and quota.
- **Python errors:** Ensure Python is installed and dependencies are met.
- **File upload issues:** Check file size/type and uploads directory permissions.
- **No products:** Check API quota, keys, and backend logs.

## 📄 License
MIT License

---
For backend issues, check logs in `backend/logs/` or open an issue in the repository. 