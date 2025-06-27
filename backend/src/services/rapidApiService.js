const axios = require('axios');
const logger = require('../middleware/logger');

// Amazon API Client
const amazonApiClient = axios.create({
  baseURL: 'https://real-time-amazon-data.p.rapidapi.com',
  timeout: 30000,
  headers: {
    'X-RapidAPI-Key': 'efd9eaafb5msh52a10f7af6ec05bp1adab2jsna9ba027f2b9d',
    'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

// Product Search API Client
const productSearchApiClient = axios.create({
  baseURL: 'https://real-time-product-search.p.rapidapi.com',
  timeout: 30000,
  headers: {
    'x-rapidapi-key': '2f6604f722msh285ef55b591c14ep13183ejsn3fb1adb25ae7',
    'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

// Utility to parse price
function parsePrice(priceInput) {
  if (!priceInput) return 'Price not available';
  const price = priceInput.toString().split('/')[0].replace(/[^0-9.]/g, '');
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 'Price not available' : parsed.toFixed(2);
}

// Transform products from API response
function transformProducts(apiProducts) {
  return apiProducts.map((product, index) => ({
    id: product.asin || product.product_id || `product-${Date.now()}-${index}`,
    title: product.title || product.product_title || 'No title available',
    price: parsePrice(product.product_price || product.price),
    thumbnail: product.image || product.product_photo || product.image_url || `https://picsum.photos/300/300?random=${index}`,
    amazonUrl: product.url || product.product_url || product.product_offer_page_url || '',
    rating: parseFloat(product.product_star_rating || product.rating) || (Math.random() * 2 + 3),
    reviews: product.reviews || product.product_num_reviews || Math.floor(Math.random() * 1000) + 50,
    description: product.description || (product.features && product.features.join(' ')) || '',
    brand: product.brand || product.store_name || 'Unknown Brand',
    availability: product.availability || 'In Stock',
  }));
}

// 1. Amazon API Search
async function searchAmazon(query, country = 'US', page = 1) {
  try {
    const response = await amazonApiClient.get('/search', {
      params: {
        query,
        country,
        page,
        category: 'aps',
      },
    });
    const products = transformProducts(response.data.products || []);
    logger.info(`Amazon search successful: ${products.length} products`);
    return products;
  } catch (error) {
    logger.error('Amazon API error: ' + JSON.stringify({
      query,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }));
    throw new Error(`Amazon search failed: ${error.message}`);
  }
}

// 2. Product Search API Search
async function searchProductSearchAPI(query, country = 'us', language = 'en', page = 1, limit = 10) {
  try {
    const response = await productSearchApiClient.get('/search-light-v2', {
      params: {
        q: query,
        country,
        language,
        page: page.toString(),
        limit: limit.toString(),
        sort_by: 'BEST_MATCH',
        product_condition: 'ANY',
        return_filters: 'false',
      },
    });

    const rawProducts =
      response.data?.data?.products ||
      response.data?.data?.results ||
      response.data?.products ||
      [];

    const products = transformProducts(rawProducts);
    logger.info(`ProductSearch API success: ${products.length} products`);
    return products;
  } catch (error) {
    logger.error('ProductSearch API error: ' + JSON.stringify({
      query,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }));
    throw new Error(`Product search failed: ${error.message}`);
  }
}

module.exports = {
  searchAmazon,
  searchProductSearchAPI,
};
