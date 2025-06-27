const axios = require('axios');
const logger = require('../middleware/logger');

// Configure a single axios instance for RapidAPI (Amazon)
const rapidApiClient = axios.create({
  baseURL: 'https://real-time-amazon-data.p.rapidapi.com',
  timeout: 30000,
  headers: {
    'X-RapidAPI-Key': 'efd9eaafb5msh52a10f7af6ec05bp1adab2jsna9ba027f2b9d',
    'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
});

// New API client for real-time-product-search
const newApiClient = axios.create({
  baseURL: 'https://real-time-product-search.p.rapidapi.com',
  timeout: 30000,
  headers: {
    'x-rapidapi-key': 'efd9eaafb5msh52a10f7af6ec05bp1adab2jsna9ba027f2b9d',
    'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
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

// Helper: Sanitize and parse price strings from various formats
function parsePrice(priceInput) {
  if (!priceInput) {
    return 'Price not available';
  }

  let priceString = priceInput.toString();

  // Remove anything after a slash (e.g., "/mo")
  priceString = priceString.split('/')[0];

  // Remove all non-numeric characters except the decimal point
  const sanitizedPrice = priceString.replace(/[^0-9.]/g, '');

  if (sanitizedPrice === '') {
    return 'Price not available';
  }

  const parsedPrice = parseFloat(sanitizedPrice);

  return !isNaN(parsedPrice) ? parsedPrice.toFixed(2) : 'Price not available';
}

// Helper: Transform RapidAPI product objects to our format
function transformProducts(rapidApiProducts) {
  return rapidApiProducts.map((product, index) => {
    // Use the new robust price parser on the correct field
    const price = parsePrice(product.product_price);

    return {
      id: product.asin || `mock-${Date.now()}-${index}`,
      title: product.title || product.product_title || 'Product Title Not Available',
      price,
      thumbnail: product.image || product.thumbnail || product.product_photo || `https://picsum.photos/300/300?random=${index}`,
      amazonUrl: product.url || product.link || product.product_url || `https://amazon.com/dp/${product.asin || 'mock'}`,
      rating: parseFloat(product.product_star_rating || product.rating) || (Math.random() * 2 + 3),
      reviews: product.reviews || product.product_num_ratings || Math.floor(Math.random() * 1000) + 50,
      description: product.description || (product.features && product.features.join(' ')) || '',
      brand: 'Amazon', // Explicitly set brand for this API
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

// Use the new API client and endpoint for all product searches
async function searchProducts(query, page = 1, limit = 10, country = 'us', language = 'en') {
  logger.info('rapidapi_search_products: ' + JSON.stringify({ query, page, limit, country, language }));
  const options = {
    method: 'GET',
    url: 'https://real-time-product-search.p.rapidapi.com/search-light-v2',
    params: {
      q: query,
      country,
      language,
      page: page.toString(),
      limit: limit.toString(),
      sort_by: 'BEST_MATCH',
      product_condition: 'ANY',
      return_filters: 'false'
    },
    headers: {
      'x-rapidapi-key': 'f92dee0045msh9b5c8fac0f8d660p1a15cbjsne98756e48931',
      'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    logger.info('rapidapi_search_success: ' + JSON.stringify({ query, status: response.status }));
    // Map and transform as before
    const productContainer = response.data.data || response.data;
    const rawProducts = productContainer?.products || productContainer?.results || productContainer?.items || [];
    return transformNewApiProducts(rawProducts);
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
 * @param {string} [country='US'] - The country to search in.
 */
async function searchByKeywords(keywords, confidences, limit = 20, country = 'US') {
  logger.info('rapidapi_search_by_keywords: ' + JSON.stringify({ keywords, confidences, limit, country }));
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
      params: { query: searchQuery, page: 1, country, category: 'aps' }
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
  return searchProducts(query, 1, 20, country);
}

// Helper: Transform new API product objects to our format
function transformNewApiProducts(apiProducts) {
  return apiProducts.map((product, index) => {
    // Use the new robust price parser
    const price = parsePrice(product.price);

    return {
      id: product.product_id || `newapi-${Date.now()}-${index}`,
      title: product.product_title || product.title || product.name || 'Product Title Not Available',
      price,
      thumbnail: product.product_photo || product.image || product.image_url || (product.images && product.images[0]) || `https://picsum.photos/300/300?random=newapi${index}`,
      amazonUrl: product.product_offer_page_url || product.url || product.product_url || '',
      rating: parseFloat(product.product_rating || product.rating) || (Math.random() * 2 + 3),
      reviews: product.product_num_reviews || product.reviews || Math.floor(Math.random() * 1000) + 50,
      description: product.description || '',
      brand: product.store_name || product.brand || 'Store',
      availability: product.availability || 'In Stock'
    };
  });
}

// Search products using the new API (search-light-v2, by query)
async function searchNewApiProducts(query, page = 1, limit = 10, country = 'us', language = 'en') {
  try {
    const options = {
      method: 'GET',
      url: 'https://real-time-product-search.p.rapidapi.com/search-light-v2',
      params: {
        q: query,
        country,
        language,
        page: page.toString(),
        limit: limit.toString(),
        sort_by: 'BEST_MATCH',
        product_condition: 'ANY',
        return_filters: 'false'
      },
      headers: {
        'x-rapidapi-key': 'efd9eaafb5msh52a10f7af6ec05bp1adab2jsna9ba027f2b9d',
        'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    // Map and transform as before
    const productContainer = response.data.data || response.data;
    const rawProducts = productContainer?.products || productContainer?.results || productContainer?.items || [];
    return transformNewApiProducts(rawProducts);
  } catch (error) {
    logger.error('newapi_search_error: ' + JSON.stringify({ query, error: error.message, status: error.response?.status, data: error.response?.data }));
    return [];
  }
}

module.exports = {
  searchProducts,
  searchByKeywords,
  searchProductsByQuery,
  searchNewApiProducts
};
