# AI-Powered E-commerce Search Platform

A full-stack app for intelligent product search using text, image, or voice. Modern React frontend, Node.js/Express backend, and Python AI microservice.

## 🚀 Features
- Text, image, and voice search
- Animated hero heading with typewriter and gradient
- **Category section:** 16 clickable categories with glassmorphism and hover effects
- Responsive grid and product cards
- INR price conversion (Amazon USD → INR)
- Platform badge (Amazon, Flipkart, etc.)
- Combined product search (Amazon + Product Search API)
- Clarifai-powered image search (detects best keyword)
- Recommended search suggestions
- Backend CORS for secure integration

## 📁 Project Structure
```
notes/
├── frontend/      # React app
├── backend/       # Node.js API + Python microservice
```

## ⚡ Project Flow
1. **User searches by text, image, or voice** in the frontend.
2. **Image search:** Backend uses Clarifai to detect the most likely object, then searches products using that keyword.
3. **Product search:** Backend queries both Amazon and Product Search APIs, combines results, and converts Amazon prices to INR.
4. **Frontend displays:**
   - Products with INR price, platform badge, and buy button
   - Category section and recommended searches

## 🛠️ Quick Start

### Prerequisites
- Node.js v16+
- Python 3.8+
- npm or yarn
- RapidAPI account

### 1. Install Dependencies
```bash
cd frontend && npm install
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
- `GET /api/search?q=keyword` — Text search (Amazon + Product Search API)
- `POST /api/search/image` — Image search (Clarifai + product search)
- `GET /health` — Health check

## 🎯 Usage
- Enter a keyword, upload an image, or use voice to search for products.
- Click a category card for quick search.
- Results are fetched from Amazon and Product Search API, with INR price conversion and platform badge.

## 🐞 Troubleshooting
- **CORS errors:** Check backend CORS config.
- **No results:** Check backend logs and API keys.
- **Voice/image search not working:** Use supported browsers and allow permissions.
- **INR price not showing:** Make sure backend and frontend are up to date.

## 🛠️ Development
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
For more, see the frontend/backend READMEs or open an issue. 