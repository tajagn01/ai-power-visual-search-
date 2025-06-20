const axios = require('axios');
const logger = require('../middleware/logger');

// Configure a single axios instance for RapidAPI
const rapidApiClient = axios.create({
  baseURL: 'https://real-time-amazon-data.p.rapidapi.com',
  timeout: 30000,
  headers: {
    'X-RapidAPI-Key': '4bbc952f27mshe643a7836b35113p181449jsn04b7f9ed1e5f',
    'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
});

// Helper: Extract array of products from response
function extractProductsFromResponse(data) {
  logger.info('rapidapi_raw_response: ' + JSON.stringify({ data }));
  if (Array.isArray(data.products)) return data.products;
  if (data.data && Array.isArray(data.data.products)) return data.data.products;
  if (Array.isArray(data.results)) return data.results;
  if (data.data && Array.isArray(data.data.results)) return data.data.results;
  for (const key in data) {
    if (Array.isArray(data[key])) return data[key];
    if (data[key] && typeof data[key] === 'object') {
      for (const subkey in data[key]) {
        if (Array.isArray(data[key][subkey])) return data[key][subkey];
      }
    }
  }
  return [];
}

// Helper: Transform RapidAPI product objects to our format
function transformProducts(rapidApiProducts) {
  return rapidApiProducts.map((product, index) => {
    const price =
      product.price_str ||
      product.price?.current_price ||
      product.price?.value ||
      product.price?.raw ||
      product.price ||
      'Price not available';

    return {
      id: product.asin || `mock-${Date.now()}-${index}`,
      title: product.title || product.product_title || 'Product Title Not Available',
      price,
      image: product.image || product.thumbnail || product.product_photo || `https://picsum.photos/300/300?random=${index}`,
      amazonUrl: product.url || product.link || product.product_url || `https://amazon.com/dp/${product.asin || 'mock'}`,
      rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
      reviews: product.reviews || Math.floor(Math.random() * 1000) + 50,
      description: product.description || (product.features && product.features.join(' ')) || '',
      brand: product.brand || product.product_brand || 'Unknown Brand',
      availability: product.availability || 'In Stock'
    };
  });
}

// Helper: Generate mock products as a fallback
function generateMockProducts(query, page = 1, limit = 20) {
  const products = [];
  const baseId = (page - 1) * limit;
  const mockTitles = [
    'Wireless Bluetooth Headphones', 'Smart Fitness Watch', 'Portable Power Bank',
    'Wireless Charging Pad', 'Bluetooth Speaker', 'USB-C Cable', 'Phone Stand',
    'Car Phone Mount', 'Screen Protector', 'Phone Case', 'Wireless Earbuds',
    'Smart Home Hub', 'Security Camera', 'Robot Vacuum', 'Smart Bulb',
    'WiFi Extender', 'Gaming Mouse', 'Mechanical Keyboard', 'Monitor Stand', 'Webcam'
  ];

  for (let i = 0; i < limit; i++) {
    const id = baseId + i + 1;
    const title = mockTitles[i % mockTitles.length];
    const price = (Math.random() * 200 + 19.99).toFixed(2);

    products.push({
      id,
      title: `${title} - ${query} compatible`,
      price,
      image: `https://picsum.photos/300/300?random=${id}`,
      amazonUrl: `https://amazon.com/dp/${Math.random().toString(36).substr(2, 10)}`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 1000) + 50,
      description: `High-quality ${title.toLowerCase()} with advanced features and excellent performance.`,
      brand: 'Mock Brand',
      availability: 'In Stock'
    });
  }
  return products;
}

// Search products by text query
async function searchProducts(query, page = 1, limit = 20) {
  logger.info('rapidapi_search_products: ' + JSON.stringify({ query, page, limit }));
  try {
    const response = await rapidApiClient.get('/search', {
      params: { query, page, country: 'US', category: 'aps' }
    });

    const rawProducts = extractProductsFromResponse(response.data);
    const products = transformProducts(rawProducts);
    logger.info('rapidapi_search_success: ' + JSON.stringify({ query, resultsCount: products.length }));
    return products;

  } catch (error) {
    logger.error('rapidapi_search_error: ' + JSON.stringify({ query, error: error.message, status: error.response?.status, data: error.response?.data }));

    if (error.code === 'ENOTFOUND' || error.response?.status >= 500) {
      logger.warn('rapidapi_fallback_to_mock: ' + JSON.stringify({ query }));
      return generateMockProducts(query, page, limit);
    }

    throw new Error(`RapidAPI search failed: ${error.message}`);
  }
}

/**
 * Search products by keyword array, using the most accurate (highest confidence) keyword if available.
 * @param {string[]} keywords - Array of detected keywords.
 * @param {number[]} [confidences] - Optional array of confidences for each keyword.
 * @param {number} [limit=20] - Number of products to return.
 */
async function searchByKeywords(keywords, confidences, limit = 20) {
  logger.info('rapidapi_search_by_keywords: ' + JSON.stringify({ keywords, confidences, limit }));
  let searchQuery;
  if (Array.isArray(keywords) && keywords.length > 0) {
    if (Array.isArray(confidences) && confidences.length === keywords.length) {
      // Use the keyword with the highest confidence
      const maxIdx = confidences.indexOf(Math.max(...confidences));
      searchQuery = keywords[maxIdx];
    } else {
      // Fallback: use the first keyword
      searchQuery = keywords[0];
    }
  } else {
    searchQuery = keywords;
  }

  try {
    const response = await rapidApiClient.get('/search', {
      params: { query: searchQuery, page: 1, country: 'US', category: 'aps' }
    });

    const rawProducts = extractProductsFromResponse(response.data);
    const products = transformProducts(rawProducts);
    logger.info('rapidapi_keywords_search_success: ' + JSON.stringify({ keywords, searchQuery, resultsCount: products.length }));
    return products;

  } catch (error) {
    logger.error('rapidapi_keywords_search_error: ' + JSON.stringify({ keywords, error: error.message, status: error.response?.status }));
    if (error.code === 'ENOTFOUND' || error.response?.status >= 500) {
      logger.warn('rapidapi_keywords_fallback_to_mock: ' + JSON.stringify({ keywords }));
      return generateMockProducts(keywords, 1, limit);
    }
    throw new Error(`RapidAPI keywords search failed: ${error.message}`);
  }
}

// Simple alias for searchProducts
async function searchProductsByQuery(query, country = 'US') {
  return searchProducts(query, 1, 20);
}

module.exports = {
  searchProducts,
  searchByKeywords,
  searchProductsByQuery
};
