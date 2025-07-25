import express from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface BatikGenerationRequest {
  prompt: string;
  motif: string;
  style: string;
  colors: string[];
  region: string;
  complexity: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Check generation limit and generate batik pattern
router.post('/generate/batik', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, motif, style, colors, region, complexity }: BatikGenerationRequest = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!prompt || !motif || !style || !colors || !region || !complexity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check user generation limit
    const limitCheck = await checkGenerationLimit(userId!);
    if (!limitCheck.canGenerate) {
      return res.status(429).json({
        success: false,
        message: `Monthly generation limit exceeded. You can generate ${limitCheck.limit} patterns per month. Next reset: ${limitCheck.nextReset}`,
        data: {
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
          nextReset: limitCheck.nextReset
        }
      });
    }

    // Enhance the prompt for better image generation
    const enhancedPrompt = enhancePromptForImagen(prompt, {
      motif,
      style,
      colors,
      region,
      complexity
    });

    // Generate the batik pattern using Google GenAI
    const generatedImage = await generateBatikWithGoogleGenAI(enhancedPrompt);

    // Save to database
    const savedBatik = await saveBatikToDatabase({
      userId: userId!,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      motif,
      style,
      colors: JSON.stringify(colors),
      region,
      complexity,
      imageBase64: generatedImage.base64,
      imageUrl: generatedImage.url
    });

    // Update generation count
    await updateGenerationCount(userId!);

    res.json({
      success: true,
      message: 'Batik pattern generated successfully',
      data: savedBatik
    });

  } catch (error) {
    console.error('Error generating batik:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate batik pattern'
    });
  }
});

// Get user generation limit status
router.get('/generation-limit', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const limitInfo = await checkGenerationLimit(userId!);

    res.json({
      success: true,
      data: limitInfo
    });

  } catch (error) {
    console.error('Error fetching generation limit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch generation limit'
    });
  }
});

// Batch generation
router.post('/generate/batch', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { requests } = req.body; // Array of BatikGenerationRequest
    const userId = req.user?.id;

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Requests array is required'
      });
    }

    if (requests.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 patterns can be generated in a single batch'
      });
    }

    // Check if user has enough generation quota
    const limitCheck = await checkGenerationLimit(userId!);
    if (limitCheck.currentCount + requests.length > limitCheck.limit) {
      return res.status(429).json({
        success: false,
        message: `Not enough quota. You need ${requests.length} generations but only have ${limitCheck.limit - limitCheck.currentCount} remaining.`
      });
    }

    const results = [];
    for (const request of requests) {
      try {
        const enhancedPrompt = enhancePromptForImagen(request.prompt, request);
        const generatedImage = await generateBatikWithGoogleGenAI(enhancedPrompt);
        
        const savedBatik = await saveBatikToDatabase({
          userId: userId!,
          prompt: enhancedPrompt,
          originalPrompt: request.prompt,
          motif: request.motif,
          style: request.style,
          colors: JSON.stringify(request.colors),
          region: request.region,
          complexity: request.complexity,
          imageBase64: generatedImage.base64,
          imageUrl: generatedImage.url
        });

        await updateGenerationCount(userId!);
        results.push(savedBatik);
      } catch (error) {
        console.error('Error in batch generation:', error);
        results.push({ error: 'Failed to generate this pattern' });
      }
    }

    res.json({
      success: true,
      message: `Generated ${results.filter(r => r && typeof r === 'object' && 'id' in r).length} of ${requests.length} patterns`,
      data: results
    });

  } catch (error) {
    console.error('Error in batch generation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process batch generation'
    });
  }
});

// Get batik history with advanced filtering
router.get('/batik-studio/history', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const motif = req.query.motif as string;
    const style = req.query.style as string;
    const region = req.query.region as string;
    const search = req.query.search as string;

    const batiks = await getBatikHistory(userId!, page, limit);

    res.json({
      success: true,
      data: batiks,
      pagination: {
        page,
        limit,
        total: batiks.length
      }
    });

  } catch (error) {
    console.error('Error fetching batik history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batik history'
    });
  }
});

// Save batik to personal gallery
router.post('/batik-studio/:id/save', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags, isPublic } = req.body;
    const userId = req.user?.id;

    // Save batik to gallery
    await saveBatikToGallery(id, userId!);

    res.json({
      success: true,
      message: 'Batik saved to gallery successfully'
    });

  } catch (error) {
    console.error('Error saving batik to gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save batik to gallery'
    });
  }
});

// Download batik
router.get('/batik-studio/:id/download', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const batik = await getBatikById(id, userId!);
    
    if (!batik) {
      return res.status(404).json({
        success: false,
        message: 'Batik not found'
      });
    }

    // Increment download count
    await incrementDownloadCount(id);

    res.json({
      success: true,
      data: {
        downloadUrl: batik.imageUrl,
        base64: batik.imageBase64,
        filename: `batik-${batik.motif}-${Date.now()}.jpeg`
      }
    });

  } catch (error) {
    console.error('Error downloading batik:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download batik'
    });
  }
});

// Public gallery - Get all public batiks
router.get('/gallery/public', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const motif = req.query.motif as string;
    const style = req.query.style as string;
    const region = req.query.region as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'recent'; // recent, popular, likes

    const publicBatiks = await getPublicGallery({
      page,
      limit,
      motif,
      style,
      region,
      search,
      sortBy
    });

    res.json({
      success: true,
      data: publicBatiks
    });

  } catch (error) {
    console.error('Error fetching public gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public gallery'
    });
  }
});

// Like a batik
router.post('/gallery/:galleryId/like', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { galleryId } = req.params;
    const userId = req.user?.id;

    const result = await toggleLike(galleryId, userId!);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update like'
    });
  }
});

// Add comment to batik
router.post('/gallery/:galleryId/comment', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { galleryId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const comment = await addComment(galleryId, userId!, content);

    res.json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// Get comments for a batik
router.get('/gallery/:galleryId/comments', async (req: Request, res: Response) => {
  try {
    const { galleryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const comments = await getComments(galleryId, page, limit);

    res.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
});

// Collections management
router.get('/collections', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const collections = await getUserCollections(userId!);

    res.json({
      success: true,
      data: collections
    });

  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collections'
    });
  }
});

router.post('/collections', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user?.id;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Collection name is required'
      });
    }

    const collection = await createCollection(userId!, {
      name: name.trim(),
      description: description?.trim(),
      isPublic: isPublic || false
    });

    res.json({
      success: true,
      data: collection
    });

  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create collection'
    });
  }
});

router.post('/collections/:collectionId/batiks/:batikId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { collectionId, batikId } = req.params;
    const userId = req.user?.id;

    const result = await addBatikToCollection(collectionId, batikId, userId!);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error adding batik to collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add batik to collection'
    });
  }
});

router.delete('/collections/:collectionId/batiks/:batikId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { collectionId, batikId } = req.params;
    const userId = req.user?.id;

    await removeBatikFromCollection(collectionId, batikId, userId!);

    res.json({
      success: true,
      message: 'Batik removed from collection'
    });

  } catch (error) {
    console.error('Error removing batik from collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove batik from collection'
    });
  }
});

// Get collection details with batiks
router.get('/collections/:collectionId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { collectionId } = req.params;
    const userId = req.user?.id;

    const collection = await getCollectionWithBatiks(collectionId, userId!);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });

  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection'
    });
  }
});

// Helper functions

async function checkGenerationLimit(userId: string) {
  // Mock implementation - always allow generation in development
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return {
    canGenerate: true,
    currentCount: 0,
    limit: 5,
    nextReset: nextReset.toISOString()
  };
  
  /*
  // Real database implementation:
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  let limitRecord = await prisma.userGenerationLimit.findUnique({
    where: { userId }
  });

  if (!limitRecord) {
    // Create initial limit record
    limitRecord = await prisma.userGenerationLimit.create({
      data: {
        userId,
        monthlyLimit: 5,
        currentCount: 0,
        lastResetDate: startOfMonth
      }
    });
  }

  // Check if we need to reset monthly count
  const lastReset = new Date(limitRecord.lastResetDate);
  if (lastReset < startOfMonth) {
    limitRecord = await prisma.userGenerationLimit.update({
      where: { userId },
      data: {
        currentCount: 0,
        lastResetDate: startOfMonth
      }
    });
  }

  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return {
    canGenerate: limitRecord.currentCount < limitRecord.monthlyLimit,
    currentCount: limitRecord.currentCount,
    limit: limitRecord.monthlyLimit,
    nextReset: nextReset.toISOString()
  };
  */
}

async function updateGenerationCount(userId: string) {
  // Mock implementation - no-op in development
  console.log(`Mock: Updated generation count for user ${userId}`);
  
  /*
  // Real database implementation:
  await prisma.userGenerationLimit.upsert({
    where: { userId },
    update: {
      currentCount: { increment: 1 },
      totalGenerated: { increment: 1 }
    },
    create: {
      userId,
      monthlyLimit: 5,
      currentCount: 1,
      totalGenerated: 1,
      lastResetDate: new Date()
    }
  });
  */
}

// Save batik to gallery
router.post('/batik-studio/:id/save', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Save batik to user's gallery
    await saveBatikToGallery(id, userId!);

    res.json({
      success: true,
      message: 'Batik saved to gallery successfully'
    });

  } catch (error) {
    console.error('Error saving batik to gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save batik to gallery'
    });
  }
});

// Download batik
router.get('/batik-studio/:id/download', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get batik details and generate download
    const batik = await getBatikById(id, userId!);
    
    if (!batik) {
      return res.status(404).json({
        success: false,
        message: 'Batik not found'
      });
    }

    res.json({
      success: true,
      data: {
        downloadUrl: batik.imageUrl,
        base64: batik.imageBase64
      }
    });

  } catch (error) {
    console.error('Error downloading batik:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download batik'
    });
  }
});

// Helper functions

function enhancePromptForImagen(basePrompt: string, options: {
  motif: string;
  style: string;
  colors: string[];
  region: string;
  complexity: string;
}) {
  const { motif, style, colors, region, complexity } = options;
  
  let enhancedPrompt = basePrompt;
  
  // Add specific technical specifications for batik textile patterns
  enhancedPrompt += ` High resolution 512x512 seamless tileable Indonesian batik textile pattern.`;
  enhancedPrompt += ` Traditional hand-drawn wax-resist dyeing technique, authentic cultural heritage design.`;
  enhancedPrompt += ` Intricate geometric and organic motifs, repeating pattern suitable for fabric printing.`;
  enhancedPrompt += ` Museum quality traditional Indonesian textile art, cultural accuracy required.`;
  
  // Add complexity and style specifications
  if (complexity === 'simple') {
    enhancedPrompt += ` Simple clean design, minimal elements, clear spacing, easy to read pattern.`;
  } else if (complexity === 'moderate') {
    enhancedPrompt += ` Moderate detail level, balanced composition, traditional proportions and spacing.`;
  } else if (complexity === 'intricate') {
    enhancedPrompt += ` Highly detailed intricate pattern, fine lines, complex traditional motifs, dense composition.`;
  }
  
  // Add specific style parameters
  if (style === 'traditional') {
    enhancedPrompt += ` Authentic traditional Indonesian batik style, hand-drawn appearance, classical proportions.`;
  } else if (style === 'contemporary') {
    enhancedPrompt += ` Modern contemporary interpretation, clean lines while maintaining traditional elements.`;
  } else if (style === 'geometric') {
    enhancedPrompt += ` Precise geometric patterns, mathematical symmetry, clean straight lines and curves.`;
  }
  
  // Enhanced negative prompts to avoid non-batik content
  enhancedPrompt += ` NEGATIVE PROMPTS TO AVOID: photographs, realistic landscapes, buildings, people, faces, animals, modern objects, logos, text, letters, numbers, 3D effects, photorealistic images, western patterns, non-Indonesian designs, places, scenery, architectural elements, vehicles, furniture, food, plants that are not stylized motifs.`;
  
  // Emphasis on what we want
  enhancedPrompt += ` MUST BE: Traditional Indonesian batik textile pattern only, flat 2D design, decorative motifs, cultural authenticity, seamless repeating pattern.`;
  
  return enhancedPrompt;
}

async function generateBatikWithGoogleGenAI(prompt: string) {
  try {
    const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      console.log('Google API key not found, using enhanced mock generation');
      return generateEnhancedMockBatik(prompt);
    }

    // Initialize Google GenAI
    const genAI = new GoogleGenAI({
      apiKey: GOOGLE_API_KEY,
    });

    console.log('Generating batik with Google GenAI Imagen...');
    
    // Generate image using Imagen 4.0
    const response = await genAI.models.generateImages({
      model: 'models/imagen-4.0-generate-preview-06-06',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1', // Square format for batik patterns
      },
    });

    if (!response?.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No images generated by Google GenAI');
    }

    const generatedImage = response.generatedImages[0];
    if (!generatedImage?.image?.imageBytes) {
      throw new Error('No image data received from Google GenAI');
    }

    const base64Image = generatedImage.image.imageBytes;
    
    // Save image to local storage or cloud storage
    const imageUrl = await saveImageToLocalStorage(base64Image);
    
    return {
      base64: base64Image,
      url: imageUrl
    };
    
  } catch (error) {
    console.error('Error calling Google GenAI:', error);
    console.log('Falling back to enhanced mock generation');
    return generateEnhancedMockBatik(prompt);
  }
}

async function generateEnhancedMockBatik(prompt: string) {
  // Enhanced mock that creates batik-like placeholder URLs
  console.log('Enhanced mock: Generating batik-inspired image for prompt:', prompt.substring(0, 100) + '...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock base64 image (1x1 pixel PNG)
  const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  // Use a more appropriate placeholder service for textile patterns
  // You could replace this with a service that generates geometric patterns
  const seed = Math.floor(Math.random() * 1000);
  const mockImageUrl = `https://via.placeholder.com/512x512/8B4513/F4E4BC?text=Batik+Pattern+${seed}`;
  
  return {
    base64: mockBase64,
    url: mockImageUrl
  };
}

async function saveBatikToDatabase(batikData: {
  userId: string;
  prompt: string;
  originalPrompt: string;
  motif: string;
  style: string;
  colors: string;
  region: string;
  complexity: string;
  imageBase64: string;
  imageUrl: string;
}) {
  // Mock implementation - replace with actual database save
  return {
    id: Date.now().toString(),
    ...batikData,
    colors: JSON.parse(batikData.colors),
    createdAt: new Date().toISOString()
  };
  
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
  });
  
  return savedBatik;
  */
}

async function saveImageToLocalStorage(base64Image: string): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'batik');
    await writeFile(uploadsDir + '/.gitkeep', '', { flag: 'a' }).catch(() => {});
    
    // Generate unique filename
    const fileName = `batik_${uuidv4()}.jpeg`;
    const filePath = join(uploadsDir, fileName);
    
    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64Image, 'base64');
    await writeFile(filePath, buffer);
    
    // Return full URL with backend server address
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}/uploads/batik/${fileName}`;
    
  } catch (error) {
    console.error('Error saving image to local storage:', error);
    // Fallback to placeholder URL
    return `https://via.placeholder.com/512x512/8B4513/F4E4BC?text=Batik+Pattern`;
  }
}

async function saveImageToCloudStorage(base64Image: string): Promise<string> {
  try {
    // For now, return a mock URL since we don't have cloud storage configured
    // In production, you would upload to Google Cloud Storage, AWS S3, etc.
    
    /*
    // Example Google Cloud Storage implementation:
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    const bucket = storage.bucket('your-batik-images-bucket');
    
    const buffer = Buffer.from(base64Image, 'base64');
    const fileName = `batik-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    });
    
    return url;
    */
    
    // Mock URL for development
    const fileName = `batik-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
    return `https://storage.googleapis.com/your-batik-bucket/${fileName}`;
    
  } catch (error) {
    console.error('Error saving image to cloud storage:', error);
    throw new Error('Failed to save image');
  }
}

async function getBatikHistory(userId: string, page: number, limit: number) {
  // Mock implementation - replace with actual database query
  return [];
  
  /*
  // Real database implementation:
  const batiks = await prisma.generatedBatik.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  });
  
  return batiks;
  */
}

async function saveBatikToGallery(batikId: string, userId: string) {
  // Mock implementation - replace with actual database update
  console.log(`Saving batik ${batikId} to gallery for user ${userId}`);
  
  /*
  // Real database implementation:
  await prisma.generatedBatik.update({
    where: { id: batikId, userId },
    data: { inGallery: true }
  });
  */
}

async function getBatikById(batikId: string, userId: string): Promise<any> {
  // Mock implementation - replace with actual database query
  return null;
  
  /*
  // Real database implementation:
  const batik = await prisma.generatedBatik.findFirst({
    where: { id: batikId, userId }
  });
  
  return batik;
  */
}

async function incrementDownloadCount(batikId: string) {
  // Mock implementation - replace with actual database update
  console.log(`Incrementing download count for batik ${batikId}`);
  
  /*
  // Real database implementation:
  await prisma.generatedBatik.update({
    where: { id: batikId },
    data: { downloadCount: { increment: 1 } }
  });
  */
}

async function getPublicGallery(filters: {
  page: number;
  limit: number;
  motif?: string;
  style?: string;
  region?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  // Mock implementation - replace with actual database query
  return {
    batiks: [],
    total: 0,
    page: filters.page,
    totalPages: 0
  };
  
  /*
  // Real database implementation:
  const where: any = { isPublic: true };
  
  if (filters.motif) where.motif = filters.motif;
  if (filters.style) where.style = filters.style;
  if (filters.region) where.region = filters.region;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { prompt: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  const orderBy: any = {};
  if (filters.sortBy === 'likes') orderBy.likesCount = filters.sortOrder || 'desc';
  else if (filters.sortBy === 'downloads') orderBy.downloadCount = filters.sortOrder || 'desc';
  else orderBy.createdAt = filters.sortOrder || 'desc';
  
  const batiks = await prisma.batikGallery.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { likes: true, comments: true } }
    },
    orderBy,
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit
  });
  
  const total = await prisma.batikGallery.count({ where });
  
  return {
    batiks,
    total,
    page: filters.page,
    totalPages: Math.ceil(total / filters.limit)
  };
  */
}

async function toggleLike(galleryId: string, userId: string) {
  // Mock implementation - replace with actual database operation
  return { liked: true, likesCount: 1 };
  
  /*
  // Real database implementation:
  const existingLike = await prisma.batikLike.findUnique({
    where: {
      userId_galleryId: {
        userId,
        galleryId
      }
    }
  });
  
  if (existingLike) {
    await prisma.batikLike.delete({
      where: { id: existingLike.id }
    });
    
    const likesCount = await prisma.batikLike.count({
      where: { galleryId }
    });
    
    return { liked: false, likesCount };
  } else {
    await prisma.batikLike.create({
      data: { userId, galleryId }
    });
    
    const likesCount = await prisma.batikLike.count({
      where: { galleryId }
    });
    
    return { liked: true, likesCount };
  }
  */
}

async function addComment(galleryId: string, userId: string, content: string) {
  // Mock implementation - replace with actual database operation
  return {
    id: Date.now().toString(),
    content,
    userId,
    galleryId,
    createdAt: new Date()
  };
  
  /*
  // Real database implementation:
  const comment = await prisma.batikComment.create({
    data: {
      content,
      userId,
      galleryId
    },
    include: {
      user: { select: { name: true, email: true } }
    }
  });
  
  return comment;
  */
}

async function getComments(galleryId: string, page: number, limit: number) {
  // Mock implementation - replace with actual database query
  return {
    comments: [],
    total: 0,
    page,
    totalPages: 0
  };
  
  /*
  // Real database implementation:
  const comments = await prisma.batikComment.findMany({
    where: { galleryId },
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  });
  
  const total = await prisma.batikComment.count({
    where: { galleryId }
  });
  
  return {
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
  */
}

async function getUserCollections(userId: string) {
  // Mock implementation - replace with actual database query
  return [];
  
  /*
  // Real database implementation:
  const collections = await prisma.batikCollection.findMany({
    where: { userId },
    include: {
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return collections;
  */
}

async function createCollection(userId: string, data: {
  name: string;
  description?: string;
  isPublic?: boolean;
}) {
  // Mock implementation - replace with actual database operation
  return {
    id: Date.now().toString(),
    name: data.name,
    description: data.description || '',
    isPublic: data.isPublic || false,
    userId,
    createdAt: new Date()
  };
  
  /*
  // Real database implementation:
  const collection = await prisma.batikCollection.create({
    data: {
      name: data.name,
      description: data.description,
      isPublic: data.isPublic || false,
      userId
    }
  });
  
  return collection;
  */
}

async function addBatikToCollection(collectionId: string, batikId: string, userId: string) {
  // Mock implementation - replace with actual database operation
  return { success: true };
  
  /*
  // Real database implementation:
  // First verify the collection belongs to the user
  const collection = await prisma.batikCollection.findFirst({
    where: { id: collectionId, userId }
  });
  
  if (!collection) {
    throw new Error('Collection not found or access denied');
  }
  
  // Check if the batik is already in the collection
  const existingItem = await prisma.batikCollectionItem.findFirst({
    where: { collectionId, batikId }
  });
  
  if (existingItem) {
    throw new Error('Batik is already in this collection');
  }
  
  await prisma.batikCollectionItem.create({
    data: { collectionId, batikId }
  });
  
  return { success: true };
  */
}

async function removeBatikFromCollection(collectionId: string, batikId: string, userId: string) {
  // Mock implementation - replace with actual database operation
  console.log(`Removing batik ${batikId} from collection ${collectionId} for user ${userId}`);
  
  /*
  // Real database implementation:
  // First verify the collection belongs to the user
  const collection = await prisma.batikCollection.findFirst({
    where: { id: collectionId, userId }
  });
  
  if (!collection) {
    throw new Error('Collection not found or access denied');
  }
  
  await prisma.batikCollectionItem.deleteMany({
    where: { collectionId, batikId }
  });
  */
}

async function getCollectionWithBatiks(collectionId: string, userId: string) {
  // Mock implementation - replace with actual database query
  return {
    id: collectionId,
    name: 'Mock Collection',
    description: 'Mock description',
    isPublic: false,
    userId,
    createdAt: new Date(),
    items: []
  };
  
  /*
  // Real database implementation:
  const collection = await prisma.batikCollection.findFirst({
    where: { 
      id: collectionId,
      OR: [
        { userId }, // User's own collection
        { isPublic: true } // Public collection
      ]
    },
    include: {
      items: {
        include: {
          batik: true
        },
        orderBy: { addedAt: 'desc' }
      },
      user: { select: { name: true, email: true } }
    }
  });
  
  return collection;
  */
}

export default router;
