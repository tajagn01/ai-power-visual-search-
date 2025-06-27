const axios = require('axios');
const logger = require('../middleware/logger');

// Utility to parse price
function parsePrice(priceInput) {
  if (!priceInput) return 'Price not available';
  const price = priceInput.toString().split('/')[0].replace(/[^0-9.]/g, '');
  const parsed = parseFloat(price);
  return isNaN(parsed) ? 'Price not available' : parsed.toFixed(2);
}

// Normalize product structure
function transformProducts(apiProducts) {
  return apiProducts.map((product, index) => ({
    id: product.asin || product.product_id || `product-${Date.now()}-${index}`,
    title: product.title || product.product_title || 'No title available',
    price: parsePrice(product.product_price || product.price),
    thumbnail: product.image || product.product_photo || product.image_url || `https://picsum.photos/300/300?random=${index}`,
    url: product.url || product.product_url || product.product_offer_page_url || '',
    rating: parseFloat(product.product_star_rating || product.rating) || (Math.random() * 2 + 3),
    reviews: product.reviews || product.product_num_reviews || Math.floor(Math.random() * 1000) + 50,
    description: product.description || (product.features && product.features.join(' ')) || '',
    brand: product.brand || product.store_name || 'Unknown Brand',
    availability: product.availability || 'In Stock',
  }));
}

// Amazon API Search
async function searchAmazon(query, country = 'US', page = 1, limit = 20) {
  try {
    const response = await axios.get('https://real-time-amazon-data.p.rapidapi.com/search', {
      params: {
        query,
        country,
        page,
        category: 'aps',
      },
      headers: {
        'X-RapidAPI-Key': 'efd9eaafb5msh52a10f7af6ec05bp1adab2jsna9ba027f2b9d',
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
      },
      timeout: 30000,
    });
    logger.info('Amazon API raw response: ' + JSON.stringify(response.data));
    const products = transformProducts(response.data.data?.products || []);
    return products;
  } catch (error) {
    logger.error('Amazon API error: ' + JSON.stringify({
      query,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }));
    return [];
  }
}

// Product Search API
async function searchProductSearchAPI(query, country = 'us', language = 'en', page = 1, limit = 20) {
  try {
    const response = await axios.get('https://real-time-product-search.p.rapidapi.com/search-light-v2', {
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
      headers: {
        'x-rapidapi-key': 'f92dee0045msh9b5c8fac0f8d660p1a15cbjsne98756e48931',
        'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
      },
      timeout: 30000,
    });
    logger.info('ProductSearch API raw response: ' + JSON.stringify(response.data));
    const rawProducts =
      response.data?.data?.products ||
      response.data?.data?.results ||
      response.data?.products ||
      [];
    const products = transformProducts(rawProducts);
    return products;
  } catch (error) {
    logger.error('ProductSearch API error: ' + JSON.stringify({
      query,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }));
    return [];
  }
}

module.exports = {
  searchAmazon,
  searchProductSearchAPI,
};
