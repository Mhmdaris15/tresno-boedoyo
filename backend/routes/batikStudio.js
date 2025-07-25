const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Mock Imagen API integration
// In production, replace with actual Google Cloud Imagen API calls

router.post('/generate/batik', authenticateToken, async (req, res) => {
  try {
    const { prompt, motif, style, colors, region, complexity } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!prompt || !motif || !style || !colors || !region || !complexity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Check generation limits (mock)
    const generationCount = await getUserGenerationCount(userId)
    if (generationCount >= 50) { // Mock monthly limit
      return res.status(429).json({
        success: false,
        message: 'Monthly generation limit reached',
        error: 'GENERATION_LIMIT_EXCEEDED'
      })
    }

    // Enhance the prompt for better image generation
    const enhancedPrompt = enhancePromptForImagen(prompt, {
      motif,
      style,
      colors,
      region,
      complexity
    })

    console.log('Generating batik with enhanced prompt:', enhancedPrompt.substring(0, 150) + '...')

    // Generate batik with AI (mock implementation)
    const generatedImage = await generateBatikWithMockAI(enhancedPrompt)

    // Save to database
    const savedBatik = await saveBatikToDatabase({
      userId,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      motif,
      style,
      colors: JSON.stringify(colors),
      region,
      complexity,
      imageBase64: generatedImage.base64,
      imageUrl: generatedImage.url
    })

    // Update generation count
    await updateUserGenerationCount(userId)

    res.json({
      success: true,
      message: 'Batik pattern generated successfully',
      data: savedBatik
    })

  } catch (error) {
    console.error('Batik generation error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate batik pattern'
    })
  }
})

router.get('/batik-studio/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10 } = req.query

    console.log(`Fetching batik history for user ${userId}, page ${page}, limit ${limit}`)

    // Get user's batik generation history
    const batiks = await getBatikHistory(userId, parseInt(page), parseInt(limit))

    res.json({
      success: true,
      batiks: batiks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: batiks.length,
        hasMore: batiks.length === parseInt(limit)
      }
    })

  } catch (error) {
    console.error('Error fetching batik history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batik history'
    })
  }
})

router.post('/batik-studio/:id/save', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Save batik to user's gallery
    await saveBatikToGallery(id, userId)

    res.json({
      success: true,
      message: 'Batik saved to gallery successfully'
    })

  } catch (error) {
    console.error('Error saving batik to gallery:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save batik to gallery'
    })
  }
})

router.get('/batik-studio/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Get batik details and generate download
    const batik = await getBatikById(id, userId)
    
    if (!batik) {
      return res.status(404).json({
        success: false,
        message: 'Batik not found'
      })
    }

    res.json({
      success: true,
      data: {
        downloadUrl: batik.imageUrl,
        base64: batik.imageBase64
      }
    })

  } catch (error) {
    console.error('Error downloading batik:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to download batik'
    })
  }
})

// Helper functions

function enhancePromptForImagen(basePrompt, options) {
  const { motif, style, colors, region, complexity } = options
  
  let enhancedPrompt = basePrompt
  
  // Add technical specifications
  enhancedPrompt += ` High resolution, seamless tileable pattern, perfect for textile printing.`
  enhancedPrompt += ` Professional textile design quality, museum-grade cultural accuracy.`
  enhancedPrompt += ` Sharp details, crisp lines, traditional Indonesian batik craftsmanship.`
  
  // Add complexity specifications
  if (complexity === 'simple') {
    enhancedPrompt += ` Clean, minimalist design with clear spacing between elements.`
  } else if (complexity === 'moderate') {
    enhancedPrompt += ` Balanced detail level with traditional proportions.`
  } else if (complexity === 'intricate') {
    enhancedPrompt += ` Highly detailed, intricate patterns with traditional complexity and fine details.`
  }
  
  // Add style specifications
  if (style === 'traditional') {
    enhancedPrompt += ` Authentic traditional hand-drawn batik style, cultural heritage accuracy.`
  } else if (style === 'contemporary') {
    enhancedPrompt += ` Modern interpretation while maintaining traditional elements and cultural respect.`
  } else if (style === 'geometric') {
    enhancedPrompt += ` Precise geometric patterns with mathematical symmetry and clean lines.`
  }
  
  // Add negative prompts
  enhancedPrompt += ` Avoid: modern logos, text, realistic photography, 3D effects, western patterns, non-Indonesian motifs.`
  
  return enhancedPrompt
}

async function generateBatikWithMockAI(prompt) {
  // Mock implementation - replace with actual Imagen API call
  console.log('Generating batik with Google GenAI Imagen...')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate a unique filename
  const fileName = `batik_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpeg`
  const imageUrl = `http://172.24.2.150:3001/uploads/batik/${fileName}`
  
  // For demo purposes, we'll use a sample batik image
  // In production, this would be the actual AI-generated image
  const fs = require('fs')
  const path = require('path')
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads/batik')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
  
  // Copy a sample image (you can replace this with actual image generation)
  const sampleImagePath = path.join(__dirname, '../uploads/batik/sample-batik.jpg')
  const newImagePath = path.join(uploadsDir, fileName)
  
  // If sample doesn't exist, create a simple placeholder
  if (!fs.existsSync(sampleImagePath)) {
    // Create a simple text-based placeholder file
    fs.writeFileSync(newImagePath, 'Mock Batik Image Data')
  } else {
    fs.copyFileSync(sampleImagePath, newImagePath)
  }
  
  // Mock base64 for a small image
  const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  
  return {
    base64: mockBase64,
    url: imageUrl,
    fileName: fileName
  }
  
  /* 
  // Real Imagen API implementation would look like this:
  const response = await fetch(IMAGEN_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GOOGLE_CLOUD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{
        prompt: prompt,
        sampleCount: 1,
        aspectRatio: '1:1',
        addWatermark: false,
        includeRaiFilter: true,
        safetySetting: 'block_some',
        personGeneration: 'dont_allow'
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        includeRaiFilter: true,
        addWatermark: false
      }
    })
  })

  const data = await response.json()
  const base64Image = data.predictions[0].bytesBase64Encoded
  const imageUrl = await saveImageToStorage(base64Image)
  
  return {
    base64: base64Image,
    url: imageUrl
  }
  */
}

async function saveBatikToDatabase(batikData) {
  // Mock implementation - replace with actual database save
  const batikId = `batik_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const savedBatik = {
    id: batikId,
    userId: batikData.userId,
    prompt: batikData.prompt,
    originalPrompt: batikData.originalPrompt,
    motif: batikData.motif,
    style: batikData.style,
    colors: JSON.parse(batikData.colors),
    region: batikData.region,
    complexity: batikData.complexity,
    imageUrl: batikData.imageUrl,
    imageBase64: batikData.imageBase64,
    createdAt: new Date().toISOString(),
    isPublic: false,
    likes: 0,
    metadata: {
      generationTime: 2.5,
      model: 'Google Imagen 2.0',
      resolution: '512x512'
    }
  }
  
  console.log('Mock: Saved batik to database:', batikId)
  return savedBatik
  
  /*
  // Real database implementation with Prisma:
  const savedBatik = await prisma.generatedBatik.create({
    data: {
      userId: batikData.userId,
      prompt: batikData.prompt,
      originalPrompt: batikData.originalPrompt,
      motif: batikData.motif,
      style: batikData.style,
      colors: batikData.colors,
      region: batikData.region,
      complexity: batikData.complexity,
      imageBase64: batikData.imageBase64,
      imageUrl: batikData.imageUrl,
      createdAt: new Date()
    }
  })
  
  return savedBatik
  */
}

async function getBatikHistory(userId, page, limit) {
  // Mock implementation - return some sample data for testing
  console.log(`Mock: Fetching batik history for user ${userId}`)
  
  const mockBatiks = [
    {
      id: `batik_${Date.now()}_1`,
      userId: userId,
      prompt: 'Traditional Parang motif with Sogan colors',
      originalPrompt: 'Create a traditional batik pattern',
      motif: 'parang',
      style: 'traditional',
      colors: ['#8B4513', '#DEB887', '#F4E4BC'],
      region: 'solo',
      complexity: 'moderate',
      imageUrl: `http://172.24.2.150:3001/uploads/batik/batik_${Math.random().toString(36).substr(2, 9)}.jpeg`,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isPublic: false,
      likes: 0
    },
    {
      id: `batik_${Date.now()}_2`,
      userId: userId,
      prompt: 'Contemporary Kawung with vibrant colors',
      originalPrompt: 'Modern interpretation of Kawung',
      motif: 'kawung',
      style: 'contemporary',
      colors: ['#FF6347', '#FFD700', '#32CD32'],
      region: 'yogyakarta',
      complexity: 'intricate',
      imageUrl: `http://172.24.2.150:3001/uploads/batik/batik_${Math.random().toString(36).substr(2, 9)}.jpeg`,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      isPublic: true,
      likes: 5
    }
  ]
  
  return mockBatiks.slice(0, limit)
  
  /*
  // Real database implementation:
  const batiks = await prisma.generatedBatik.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  })
  
  return batiks
  */
}

async function saveBatikToGallery(batikId, userId) {
  // Mock implementation - replace with actual database update
  console.log(`Saving batik ${batikId} to gallery for user ${userId}`)
  
  /*
  // Real database implementation:
  await prisma.generatedBatik.update({
    where: { id: batikId, userId },
    data: { inGallery: true }
  })
  */
}

async function getBatikById(batikId, userId) {
  // Mock implementation - replace with actual database query
  return {
    id: batikId,
    userId: userId,
    imageUrl: `http://172.24.2.150:3001/uploads/batik/batik_${batikId}.jpeg`,
    imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    prompt: 'Mock batik pattern',
    createdAt: new Date().toISOString()
  }
  
  /*
  // Real database implementation:
  const batik = await prisma.generatedBatik.findFirst({
    where: { id: batikId, userId }
  })
  
  return batik
  */
}

// Generation limit tracking functions
async function getUserGenerationCount(userId) {
  // Mock implementation - replace with actual database query
//   const mockCounts = {
//     daily: Math.floor(Math.random() * 10),
//     monthly: Math.floor(Math.random() * 30)
//   }
  
//   console.log(`Mock: User ${userId} generation count:`, mockCounts)
//   return mockCounts.monthly
  
  // Real implementation:
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const count = await prisma.generatedBatik.count({
    where: {
      userId: userId,
      createdAt: {
        gte: startOfMonth
      }
    }
  })
  
  return count
}

async function updateUserGenerationCount(userId) {
  // Mock implementation - in real app this would be handled by database constraints
  console.log(`Mock: Updated generation count for user ${userId}`)
  
  /*
  // Real implementation would be handled automatically by the database
  // when creating new records, or you could maintain a separate counter table
  */
}

// Add generation limit endpoint
router.get('/generation-limit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    
    const monthlyUsed = await getUserGenerationCount(userId)
    const monthlyLimit = 50 // Mock limit
    const dailyUsed = Math.floor(Math.random() * 5)
    const dailyLimit = 10 // Mock daily limit
    
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysRemaining = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24))
    
    res.json({
      success: true,
      data: {
        monthly: {
          used: monthlyUsed,
          limit: monthlyLimit,
          remaining: Math.max(0, monthlyLimit - monthlyUsed)
        },
        daily: {
          used: dailyUsed,
          limit: dailyLimit,
          remaining: Math.max(0, dailyLimit - dailyUsed)
        },
        canGenerate: monthlyUsed < monthlyLimit && dailyUsed < dailyLimit,
        resetDate: endOfMonth.toISOString(),
        daysUntilReset: daysRemaining
      }
    })
    
  } catch (error) {
    console.error('Error fetching generation limits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch generation limits'
    })
  }
})

module.exports = router
