import axios from 'axios'

// Use the provided backend URL for all API requests
const apiBaseUrl = 'https://ai-power-visual-search.onrender.com/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000, // 30 seconds timeout for image uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// Text search function
export const searchByText = async (query, page = 1) => {
  try {
    const response = await api.get('/search', {
      params: {
        q: query,
        page: page,
        limit: 20,
      },
    })
    if (response.data.success) {
      return {
        amazon: response.data.data.amazon || [],
        newApi: response.data.data.newApi || []
      }
    }
    throw new Error(response.data.error || 'Search failed')
  } catch (error) {
    console.error('Text search error:', error)
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      console.warn('Backend not available, using mock data')
      return {
        amazon: generateMockProducts(query, page),
        newApi: generateMockProducts(query, page)
      }
    }
    throw new Error(error.response?.data?.error || error.message || 'Failed to search products')
  }
}

// Image search function
export const searchByImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const response = await api.post('/search/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.data.success) {
      return {
        amazon: response.data.data.amazon || [],
        newApi: response.data.data.newApi || []
      }
    }
    throw new Error(response.data.error || 'Image search failed')
  } catch (error) {
    console.error('Image search error:', error)
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      console.warn('Backend not available, using mock data')
      return {
        amazon: generateMockProducts('image search', 1),
        newApi: []
      }
    }
    throw new Error(error.response?.data?.error || error.message || 'Image upload failed - try again')
  }
}

// Mock data generator for demonstration
const generateMockProducts = (query, page) => {
  const products = []
  const baseId = (page - 1) * 20
  
  const mockTitles = [
    'Wireless Bluetooth Headphones',
    'Smart Fitness Watch',
    'Portable Power Bank',
    'Wireless Charging Pad',
    'Bluetooth Speaker',
    'USB-C Cable',
    'Phone Stand',
    'Car Phone Mount',
    'Screen Protector',
    'Phone Case',
    'Wireless Earbuds',
    'Smart Home Hub',
    'Security Camera',
    'Robot Vacuum',
    'Smart Bulb',
    'WiFi Extender',
    'Gaming Mouse',
    'Mechanical Keyboard',
    'Monitor Stand',
    'Webcam'
  ]
  
  for (let i = 0; i < 20; i++) {
    const id = baseId + i + 1
    const title = mockTitles[i % mockTitles.length]
    const price = Math.floor(Math.random() * 200) + 19.99
    
    products.push({
      id: id,
      title: `${title} - ${query} compatible`,
      price: price.toFixed(2),
      image: `https://picsum.photos/300/300?random=${id}`,
      amazonUrl: `https://amazon.com/dp/${Math.random().toString(36).substr(2, 10)}`,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3-5 stars
      reviews: Math.floor(Math.random() * 1000) + 50
    })
  }
  
  return products
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200?text=No+Image';

export const fetchCategoryImage = async (keyword) => {
  try {
    const { amazon, newApi } = await searchByText(keyword, 1);
    const product = (amazon && amazon[0]) || (newApi && newApi[0]) || null;
    if (product && (product.image || product.thumbnail)) {
      return {
        image: product.image || product.thumbnail,
        url: product.amazonUrl || product.url || product.product_url || '#',
        title: product.title || keyword
      };
    }
    // No product found, return placeholder
    return { image: PLACEHOLDER_IMAGE, url: '#', title: keyword };
  } catch (error) {
    console.error('Category image fetch error:', error);
    // On error, return placeholder
    return { image: PLACEHOLDER_IMAGE, url: '#', title: keyword };
  }
}; 