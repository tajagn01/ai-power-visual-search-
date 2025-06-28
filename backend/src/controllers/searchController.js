const logger = require('../middleware/logger')
const rapidApiService = require('../services/rapidApiService')
const pythonFaissService = require('../services/pythonFaissService')
const fs = require('fs')
const path = require('path')
const clarifaiService = require('../services/clarifaiService')

// Search products from both Amazon and Product Search APIs
const searchByText = async (req, res) => {
  const { q: query, page = 1, limit = 20 } = req.query

  logger.info('text_search: ' + JSON.stringify({ query, page: parseInt(page), limit: parseInt(limit), ip: req.ip }))

  try {
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    const country = 'US'
    let amazonProducts = []
    let productSearchProducts = []

    try {
      amazonProducts = await rapidApiService.searchAmazon(query.trim(), country, parseInt(page), parseInt(limit))
    } catch (error) {
      logger.error(`Error fetching Amazon products: ${error.message}`)
      amazonProducts = []
    }

    try {
      productSearchProducts = await rapidApiService.searchProductSearchAPI(query.trim(), country.toLowerCase(), 'en', parseInt(page), parseInt(limit))
    } catch (error) {
      logger.error(`Error fetching ProductSearch API products: ${error.message}`)
      productSearchProducts = []
    }

    logger.info(`[SEARCH] query="${query}" | Amazon=${amazonProducts.length} | ProductSearchAPI=${productSearchProducts.length}`)

    res.json({
      success: true,
      data: {
        amazon: amazonProducts,
        productSearch: productSearchProducts,
        query: query.trim(),
        page: parseInt(page),
        limit: parseInt(limit),
        total: amazonProducts.length + productSearchProducts.length
      }
    })
  } catch (error) {
    logger.error(`[ERROR] text_search: query="${query}" | ${error.message}`)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get trending products for the trending products section
const getTrendingProducts = async (req, res) => {
  logger.info('trending_products: ' + JSON.stringify({ ip: req.ip }))

  try {
    const trendingQueries = ['laptop', 'smartphone', 'headphones', 'shoes', 'watch', 'camera'];
    const country = 'US'
    let allProducts = []

    // Fetch products for trending queries
    for (const query of trendingQueries) {
      try {
        // Get Amazon products
        const amazonProducts = await rapidApiService.searchAmazon(query, country, 1, 2)
        if (amazonProducts.length > 0) {
          allProducts.push({
            ...amazonProducts[0],
            source: 'Amazon',
            trendingQuery: query
          })
        }

        // Get Product Search API products
        const productSearchProducts = await rapidApiService.searchProductSearchAPI(query, country.toLowerCase(), 'en', 1, 2)
        if (productSearchProducts.length > 0) {
          allProducts.push({
            ...productSearchProducts[0],
            source: 'ProductSearch',
            trendingQuery: query
          })
        }
      } catch (error) {
        logger.error(`Error fetching trending products for query "${query}": ${error.message}`)
      }
    }

    // Select one product from each source (Amazon, Flipkart, Myntra)
    const trendingProducts = {
      amazon: allProducts.find(p => p.source === 'Amazon') || getFallbackTrendingProduct('Amazon'),
      flipkart: allProducts.find(p => p.source === 'ProductSearch' && p.brand?.toLowerCase().includes('flipkart')) || getFallbackTrendingProduct('Flipkart'),
      myntra: allProducts.find(p => p.source === 'ProductSearch' && p.brand?.toLowerCase().includes('myntra')) || getFallbackTrendingProduct('Myntra')
    }

    logger.info(`[TRENDING] Amazon=${!!trendingProducts.amazon} | Flipkart=${!!trendingProducts.flipkart} | Myntra=${!!trendingProducts.myntra}`)

    res.json({
      success: true,
      data: trendingProducts
    })
  } catch (error) {
    logger.error(`[ERROR] trending_products: ${error.message}`)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Fallback trending product when APIs fail
const getFallbackTrendingProduct = (source) => {
  const fallbackProducts = {
    amazon: {
      id: `trending-amazon-${Date.now()}`,
      title: 'Amazon Echo Dot (4th Gen) - Smart Speaker',
      price: '2999.00',
      thumbnail: 'https://m.media-amazon.com/images/I/714Rq4k05UL._SL1000_.jpg',
      url: 'https://www.amazon.in',
      rating: '4.5',
      reviews: '1250',
      description: 'Smart speaker with Alexa | Charcoal',
      brand: 'Amazon',
      source: 'Amazon',
      trendingQuery: 'smart speaker'
    },
    flipkart: {
      id: `trending-flipkart-${Date.now()}`,
      title: 'Nike Air Max Running Shoes',
      price: '2499.00',
      thumbnail: 'https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/0/6/2/-original-imagzrf2gqgqgk7z.jpeg',
      url: 'https://www.flipkart.com',
      rating: '4.3',
      reviews: '890',
      description: 'Comfortable running shoes with air cushioning',
      brand: 'Nike',
      source: 'Flipkart',
      trendingQuery: 'running shoes'
    },
    myntra: {
      id: `trending-myntra-${Date.now()}`,
      title: 'Levi\'s Men\'s Slim Fit Jeans',
      price: '1899.00',
      thumbnail: 'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/24644538/2023/8/18/7e2e2c2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e1692342342342-1.jpg',
      url: 'https://www.myntra.com',
      rating: '4.2',
      reviews: '567',
      description: 'Classic blue denim jeans with perfect fit',
      brand: 'Levi\'s',
      source: 'Myntra',
      trendingQuery: 'jeans'
    }
  };

  return fallbackProducts[source.toLowerCase()] || fallbackProducts.amazon;
}

// Image search controller
const searchByImage = async (req, res) => {
  logger.info(`[IMAGE SEARCH] start | ip=${req.ip} | file=${req.file ? req.file.originalname : 'no file'}`);

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded'
      })
    }

    const imagePath = req.file.path
    const originalName = req.file.originalname

    logger.info('image_uploaded: ' + JSON.stringify({ filename: req.file.filename, originalName, size: req.file.size, path: imagePath }))

    // Read image buffer
    const imageBuffer = fs.readFileSync(imagePath)

    // Detect objects using Clarifai API
    let detectedObjects = []
    let visionError = null
    try {
      detectedObjects = await clarifaiService.detectObjects(imageBuffer)
      logger.info(`[IMAGE SEARCH] clarifai objects: ${detectedObjects.map(o => o.name).join(', ')}`);
    } catch (err) {
      visionError = err.message
      logger.warn('clarifai_api_error: ' + visionError)
    }

    // Use the highest-confidence object as the keyword, or fallback
    let keyword = 'headphones';
    if (detectedObjects.length > 0) {
      const bestObject = detectedObjects.reduce((a, b) => (a.value > b.value ? a : b));
      if (bestObject.value > 0.7) {
        keyword = bestObject.name;
      }
    }

    const country = 'IN';

    // Only fetch Amazon products by the best keyword
    const amazonProducts = await rapidApiService.searchByKeywords(keyword, null, 10, country)
      .catch(error => {
        logger.error(`Error fetching Amazon products by keyword: ${error.message}`);
        return []; // Return empty on error
      });
    logger.info(`[IMAGE SEARCH] amazonCount=${amazonProducts.length} | keyword=${keyword}`);

    // Fetch new API products by the best keyword
    let newApiProducts = [];
    if(keyword) {
      try {
        newApiProducts = await rapidApiService.searchNewApiProducts(keyword, 1, 10, country.toLowerCase());
      } catch (error) {
        logger.error(`Error fetching New API products by keyword: ${error.message}`);
        newApiProducts = []; // Return empty on error
      }
    }

    let combinedResults = [...amazonProducts, ...newApiProducts];

    // Clean up uploaded file
    try {
      fs.unlinkSync(imagePath)
      logger.info('file_cleanup: ' + JSON.stringify({ path: imagePath }))
    } catch (cleanupError) {
      logger.warn('file_cleanup_failed: ' + JSON.stringify({ path: imagePath, error: cleanupError.message }))
    }

    res.json({
      success: true,
      data: {
        amazon: amazonProducts,
        newApi: newApiProducts,
        keyword,
        visionError,
        originalImage: originalName,
        total: amazonProducts.length + newApiProducts.length
      }
    })

  } catch (error) {
    logger.error(`[ERROR] image_search: ${error.message}`);

    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
        logger.info('file_cleanup_on_error: ' + JSON.stringify({ path: req.file.path }))
      } catch (cleanupError) {
        logger.warn('file_cleanup_on_error_failed: ' + JSON.stringify({ path: req.file.path, error: cleanupError.message }))
      }
    }

    throw error
  }
}

module.exports = {
  searchByText,
  searchByImage,
  getTrendingProducts
} 