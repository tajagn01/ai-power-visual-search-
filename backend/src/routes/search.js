const express = require('express')
const router = express.Router()

const searchController = require('../controllers/searchController')
const upload = require('../middleware/upload')

// Text search endpoint
router.get('/', searchController.searchByText)

// Trending products endpoint
router.get('/trending', searchController.getTrendingProducts)

// Image search endpoint
router.post('/image', upload.single('image'), searchController.searchByImage)

module.exports = router 