import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';

function App() {
  const [products, setProducts] = useState({ amazon: [], newApi: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      setProducts({
        amazon: data.amazon || [],
        newApi: data.newApi || []
      });
    } catch (error) {
      console.error('Search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageSearch = useCallback(async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/search/image`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setProducts({
        amazon: data.amazon || [],
        newApi: data.newApi || []
      });
    } catch (error) {
      console.error('Image search error:', error);
      setProducts({ amazon: [], newApi: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App; 