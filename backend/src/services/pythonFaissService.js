const { execFile } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const logger = require('../middleware/logger')

const execFileAsync = promisify(execFile)

class PythonFaissService {
  constructor() {
    this.pythonScriptPath = path.join(__dirname, '..', '..', 'python-service', 'faiss_service.py')
    this.pythonExecutable = process.env.PYTHON_EXECUTABLE || 'python'
  }

  // Search for similar products using FAISS
  async searchImage(imagePath) {
    try {
      logger.info('python_faiss_search_start: ' + JSON.stringify({ imagePath, pythonScript: this.pythonScriptPath }))

      // Check if image file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`)
      }

      // Check if Python script exists
      if (!fs.existsSync(this.pythonScriptPath)) {
        logger.warn('python_script_not_found: ' + JSON.stringify({ scriptPath: this.pythonScriptPath }))
        return this.getMockSearchTags()
      }

      // Execute Python script with image path
      const { stdout, stderr } = await execFileAsync(
        this.pythonExecutable,
        [this.pythonScriptPath, imagePath],
        {
          timeout: 30000, // 30 seconds timeout
          maxBuffer: 1024 * 1024 // 1MB buffer
        }
      )

      if (stderr) {
        logger.warn('python_script_stderr: ' + JSON.stringify({ stderr: stderr.trim() }))
      }

      // Parse JSON output from Python script
      let searchTags
      try {
        searchTags = JSON.parse(stdout.trim())
      } catch (parseError) {
        logger.error('python_output_parse_error: ' + JSON.stringify({ stdout: stdout.trim(), error: parseError.message }))
        return this.getMockSearchTags()
      }

      logger.info('python_faiss_search_success: ' + JSON.stringify({ searchTags, tagCount: searchTags.length }))
      return searchTags

    } catch (error) {
      logger.error('python_faiss_search_error: ' + JSON.stringify({ imagePath, error: error.message, stack: error.stack }))

      // Return mock tags if Python service fails
      if (error.code === 'ENOENT' || error.code === 'ETIMEDOUT') {
        logger.warn('python_service_fallback_to_mock: ' + JSON.stringify({ imagePath }))
        return this.getMockSearchTags()
      }

      throw new Error(`Python FAISS search failed: ${error.message}`)
    }
  }

  // Get mock search tags for fallback
  getMockSearchTags() {
    const mockTags = [
      'electronics',
      'wireless',
      'bluetooth',
      'headphones',
      'smartphone',
      'accessories',
      'gadgets',
      'tech',
      'portable',
      'modern'
    ]

    // Return 3-5 random tags
    const numTags = Math.floor(Math.random() * 3) + 3
    const shuffled = mockTags.sort(() => 0.5 - Math.random())
    
    logger.info('mock_search_tags_generated: ' + JSON.stringify({ tags: shuffled.slice(0, numTags) }))

    return shuffled.slice(0, numTags)
  }

  // Check if Python service is available
  async checkServiceHealth() {
    try {
      const { stdout } = await execFileAsync(
        this.pythonExecutable,
        ['--version'],
        { timeout: 5000 }
      )

      const pythonVersion = stdout.trim()
      logger.info('python_service_health_check: ' + JSON.stringify({ pythonVersion, scriptPath: this.pythonScriptPath, scriptExists: fs.existsSync(this.pythonScriptPath) }))

      return {
        available: true,
        pythonVersion,
        scriptExists: fs.existsSync(this.pythonScriptPath)
      }

    } catch (error) {
      logger.error('python_service_health_check_failed: ' + JSON.stringify({ error: error.message }))

      return {
        available: false,
        error: error.message
      }
    }
  }
}

module.exports = new PythonFaissService() 