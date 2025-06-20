# Product Search App

A fully responsive React application that allows users to search for products by text or upload images. Built with Vite, React, and Tailwind CSS.

## Features

### 🔍 Text Search
- Search bar with real-time input
- Enter key support for quick searches
- Search button for easy submission
- Loading states and error handling

### 📸 Image Search
- Drag-and-drop file upload
- Classic file browser button
- Image preview functionality
- File validation (JPG/PNG, < 5MB)
- Multipart form data upload

### 📱 Responsive Design
- Mobile-first approach
- 4 columns on desktop, 2 on tablet, 1 on mobile
- Smooth animations and transitions
- Beautiful gradient backgrounds

### 🛍️ Product Display
- Grid layout with product cards
- Product images, titles, prices, and ratings
- Star rating system
- "View on Amazon" links
- Hover effects and animations

### ⚡ Performance
- Lazy loading for images
- Optimized animations
- Efficient state management
- Mock data for demonstration

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS (via CDN)
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The application will open automatically at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # Text search component
│   │   ├── ImageUploader.jsx      # Image upload component
│   │   ├── ProductGrid.jsx        # Product grid layout
│   │   ├── ProductCard.jsx        # Individual product card
│   │   ├── Loader.jsx             # Loading spinner
│   │   └── SearchBar.test.jsx     # Unit tests
│   ├── services/
│   │   └── api.js                 # API service functions
│   ├── test/
│   │   └── setup.js               # Test configuration
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── index.html                     # HTML template with Tailwind CDN
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## API Integration

The application is designed to work with the following API endpoints:

### Text Search
```
GET /api/search/text?q=<query>&page=<page>&limit=<limit>
```

### Image Search
```
POST /api/search/image
Content-Type: multipart/form-data
Body: { image: File }
```

### Mock Data
For demonstration purposes, the app includes mock data generation when the API is not available. This allows you to test all functionality without a backend.

## Customization

### Colors
The app uses a custom color palette defined in the Tailwind configuration:

- **Primary**: Blue shades (`primary-50` to `primary-900`)
- **Secondary**: Gray shades (`secondary-50` to `secondary-900`)

### Animations
Custom animations are defined for:
- `fade-in`: Smooth fade-in effect
- `slide-up`: Slide up with fade-in
- `pulse-slow`: Slow pulsing animation

## Testing

The application includes comprehensive unit tests for the SearchBar component:

```bash
npm test
```

Tests cover:
- Component rendering
- User interactions
- Form submissions
- Input validation
- Disabled states
- Error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized Animations**: CSS-based animations for smooth performance
- **Responsive Images**: Automatic image sizing based on viewport
- **Efficient State Management**: Minimal re-renders with React hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the repository.

---

**Note**: This application is designed for demonstration purposes and includes mock data generation. In a production environment, you would connect to real API endpoints for product data. 