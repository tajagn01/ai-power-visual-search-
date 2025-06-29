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
  searchByImage
} 