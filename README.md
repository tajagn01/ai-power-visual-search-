# AI-Powered E-commerce Search Platform

A full-stack app for intelligent product search using text, image, or voice. Modern React frontend, Node.js/Express backend, and Python AI microservice.

## 🚀 Features
- Text, image, and voice search
- Animated hero heading with typewriter and gradient
- Responsive 3-column mobile grid
- Product cards with source-aware buy buttons
- Enhanced feature cards with glassmorphism
- Backend CORS for secure integration
- Amazon results limited to 10 per search

## 📁 Project Structure
```
ai/
├── frontend/      # React app
├── backend/       # Node.js API + Python microservice
```

## 🛠️ Quick Start

### Prerequisites
- Node.js v16+
- Python 3.8+
- npm or yarn
- RapidAPI account

### 1. Install Dependencies
```bash
cd ai/frontend && npm install
cd ../backend && npm install
cd python-service && pip install -r requirements.txt
```

### 2. Environment Setup
- Set API URLs and keys in `.env` files for frontend and backend.

### 3. Start the App
- **Backend:**
  ```bash
  cd backend && npm run dev
  ```
- **Frontend:**
  ```bash
  cd frontend && npm run dev
  ```

## 🔌 API Endpoints
- `GET /api/search?q=keyword` — Text search (Amazon limited to 10)
- `POST /api/search/image` — Image search
- `GET /health` — Health check

## 🎯 Usage
- Enter a keyword or upload an image to search for products.
- Results are fetched from Amazon and a secondary API via RapidAPI.

## 🐛 Troubleshooting
- **CORS errors:** Check backend CORS config.
- **No results:** Check backend logs and API keys.
- **Voice/image search not working:** Use supported browsers and allow permissions.

## 🔧 Development
- **Frontend:**
  - `npm run dev` — Start dev server
  - `npm run build` — Build for production
- **Backend:**
  - `npm run dev` — Start with nodemon
  - `npm start` — Start production server

## 🚀 Deployment
- Set `NODE_ENV=production` and update API URLs in environment variables.
- Deploy backend and frontend to your preferred platforms (e.g., Render, Netlify).

## 📄 License
MIT License

---
For help, see the frontend/backend READMEs or open an issue. 