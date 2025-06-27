# Product Search App (Frontend)

A modern, responsive React app for searching products by text, image, or voice. Built with Vite, React, and Tailwind CSS.

## ✨ Features
- Text, image, and **voice search** (microphone button)
- Animated hero heading with typewriter and gradient effect
- **Category section:** 16 clickable categories with glassmorphism and hover effects
- Responsive grid with improved card design
- Product cards with images, INR prices (converted from USD for Amazon), ratings, and platform badge
- Source-aware buy buttons (Amazon, Flipkart, etc.)
- Enhanced feature cards with glassmorphism and purple glow
- Loading states, error handling, and mobile-first design
- **Recommended search:** Quick search suggestions from product data

## 🛠️ Tech Stack
- React 18 + Vite
- Tailwind CSS (with line-clamp plugin)
- Axios (HTTP client)
- Vitest + React Testing Library (tests)

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/   # UI components
│   ├── services/     # API service
│   ├── test/         # Test setup
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🧪 Testing
```bash
npm test
```

## 🐞 Troubleshooting
- **CORS errors:** Make sure your backend allows requests from your frontend URL.
- **No results:** Check browser console for errors and verify backend/API is running.
- **Image upload issues:** Check file size/type and browser support.
- **Voice search not working:** Use Chrome or Edge, and allow microphone access.
- **INR price not showing:** Make sure backend and frontend are up to date.

## 📄 License
MIT License

---
For questions or issues, open an issue in the repository. 