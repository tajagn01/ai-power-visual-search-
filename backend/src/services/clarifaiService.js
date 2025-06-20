const axios = require('axios')

const CLARIFAI_API_KEY = 'c4a29fac51ff41cdba9922ec4baa6b5a'
const USER_ID = 'cthrref1eju7'
const APP_ID = 'ai1234'
const MODEL_ID = 'general-image-detection'
const MODEL_VERSION_ID = '1580bb1932594c93b7e2e04456af7c6f'
const CLARIFAI_API_URL = `https://api.clarifai.com/v2/users/${USER_ID}/apps/${APP_ID}/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`

/**
 * Calls Clarifai API to detect objects in an image.
 * @param {Buffer} imageBuffer - The image buffer.
 * @returns {Promise<{name: string, value: number, bbox: {x: number, y: number, width: number, height: number}}[]>} - Array of detected objects with their names, confidences, and bounding boxes.
 */
async function detectObjects(imageBuffer) {
  const base64Image = imageBuffer.toString('base64')
  const requestBody = {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID
    },
    inputs: [
      {
        data: {
          image: { base64: base64Image }
        }
      }
    ]
  }

  try {
    const response = await axios.post(
      CLARIFAI_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Clarifai raw response:', JSON.stringify(response.data, null, 2))
    const regions = response.data.outputs[0].data.regions || []
    const objects = regions.map(region => ({
      name: region.data.concepts[0].name,
      value: region.data.concepts[0].value,
      bbox: region.region_info.bounding_box
    }))
    return objects
  } catch (error) {
    console.error('Clarifai API error:', error.response?.data || error.message)
    throw new Error('Clarifai API error: ' + (error.response?.data?.status?.description || error.message))
  }
}

module.exports = { detectObjects } 