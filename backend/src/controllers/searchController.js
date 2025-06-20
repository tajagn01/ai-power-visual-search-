const logger = require('../middleware/logger')
const rapidApiService = require('../services/rapidApiService')
const pythonFaissService = require('../services/pythonFaissService')
const fs = require('fs')
const path = require('path')
const clarifaiService = require('../services/clarifaiService')

// Text search controller
const searchByText = async (req, res) => {
  const { q: query, page = 1, limit = 20 } = req.query

  logger.info('text_search: ' + JSON.stringify({ query, page: parseInt(page), limit: parseInt(limit), ip: req.ip }))

  try {
    // Validate query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    // Search products using RapidAPI
    const products = await rapidApiService.searchProducts(query.trim(), parseInt(page), parseInt(limit))

    logger.info('text_search_success: ' + JSON.stringify({ query, resultsCount: products.length }))

    res.json({
      success: true,
      data: {
        products,
        query: query.trim(),
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length
      }
    })

  } catch (error) {
    logger.error('text_search_error: ' + JSON.stringify({ query, error: error.message, stack: error.stack }))

    throw error
  }
}

// Image search controller
const searchByImage = async (req, res) => {
  logger.info('image_search_start: ' + JSON.stringify({ ip: req.ip, file: req.file ? req.file.originalname : 'no file' }))

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
      logger.info('clarifai_objects_detected: ' + JSON.stringify({ objects: detectedObjects }))
    } catch (err) {
      visionError = err.message
      logger.warn('clarifai_api_error: ' + visionError)
    }

    // Use the highest-confidence object as the keyword, or fallback
    let keywords = ['headphones']
    if (detectedObjects.length > 0) {
      const bestObject = detectedObjects.reduce((a, b) => (a.value > b.value ? a : b))
      if (bestObject.value > 0.7) {
        keywords = [bestObject.name]
      }
    }

    // Use the keywords as the query for product search
    const products = await rapidApiService.searchByKeywords(keywords)

    logger.info('image_search_success: ' + JSON.stringify({ resultsCount: products.length, keywords }))

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
        products,
        keywords,
        visionError,
        originalImage: originalName,
        total: products.length
      }
    })

  } catch (error) {
    logger.error('image_search_error: ' + JSON.stringify({ error: error.message, stack: error.stack, file: req.file ? req.file.filename : 'no file' }))

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