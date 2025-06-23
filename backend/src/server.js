require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')

const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const searchRoutes = require('./routes/search')

const app = express()
const PORT = process.env.PORT || 5000

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://aisearch01.netlify.app"
  ],
  credentials: true
}))
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static(uploadsDir))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.use('/api/search', searchRoutes)

// Root URL handler
app.get('/', (req, res) => {
  res.send('AI Product Search API is running...')
})

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})

// Global error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server listening on port ${PORT}`)
  logger.info(`📁 Upload directory: ${uploadsDir}`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

module.exports = app 