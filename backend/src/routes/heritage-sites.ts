import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()
const prisma = new PrismaClient()

// Extend Express Request to include user
interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// GET /heritage-sites - List heritage sites with filtering
router.get('/', async (req, res) => {
  try {
    const {
      search,
      type,
      province,
      conservationStatus,
      unescoStatus,
      hasOpportunities,
      lat,
      lng,
      radius,
      limit = '50',
      offset = '0'
    } = req.query

    const where: any = {}

    // Text search across name and description
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { significance: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    // Filter by site type
    if (type) {
      where.type = type
    }

    // Filter by province
    if (province) {
      where.province = province
    }

    // Filter by conservation status
    if (conservationStatus) {
      where.conservationStatus = conservationStatus
    }

    // Filter by UNESCO status
    if (unescoStatus !== undefined) {
      where.unescoStatus = unescoStatus === 'true'
    }

    // Filter by sites with opportunities
    if (hasOpportunities === 'true') {
      where.opportunities = {
        some: {
          status: 'PUBLISHED' // Use correct enum value
        }
      }
    }

    // Geographic filtering (if lat/lng/radius provided)
    let sites
    if (lat && lng && radius) {
      // For PostgreSQL with PostGIS, you would use spatial queries
      // For now, we'll use basic filtering and sort by distance
      const allSites = await prisma.heritageSite.findMany({
        where,
        include: {
          opportunities: {
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true }
          },
          siteReports: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { reportType: true, urgency: true, createdAt: true }
          },
          siteReviews: {
            select: { rating: true }
          }
        },
        take: parseInt(limit as string) * 2, // Get more to filter by distance
        skip: parseInt(offset as string)
      })

      // Calculate distances and filter
      const centerLat = parseFloat(lat as string)
      const centerLng = parseFloat(lng as string)
      const maxDistance = parseFloat(radius as string)

      const sitesWithDistance = allSites.map(site => {
        const distance = calculateDistance(
          centerLat, centerLng,
          site.latitude, site.longitude
        )
        return { ...site, distance }
      })

      sites = sitesWithDistance
        .filter(site => site.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, parseInt(limit as string))
    } else {
      sites = await prisma.heritageSite.findMany({
        where,
        include: {
          opportunities: {
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true }
          },
          siteReports: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { reportType: true, urgency: true, createdAt: true }
          },
          siteReviews: {
            select: { rating: true }
          }
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: { name: 'asc' }
      })
    }

    // Calculate average ratings and format response
    const formattedSites = sites.map(site => ({
      ...site,
      averageRating: site.siteReviews.length > 0
        ? site.siteReviews.reduce((sum, review) => sum + review.rating, 0) / site.siteReviews.length
        : null,
      opportunityCount: site.opportunities.length,
      lastReportDate: site.siteReports[0]?.createdAt || null,
      lastReportUrgency: site.siteReports[0]?.urgency || null
    }))

    res.json({
      data: formattedSites,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: formattedSites.length
      }
    })
  } catch (error) {
    console.error('Error fetching heritage sites:', error)
    res.status(500).json({ error: 'Failed to fetch heritage sites' })
  }
})

// GET /heritage-sites/:id - Get specific heritage site details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const site = await prisma.heritageSite.findUnique({
      where: { id },
      include: {
        opportunities: {
          where: { status: 'PUBLISHED' },
          include: {
            coordinator: {
              select: { id: true, userId: true }
            }
          }
        },
        siteReports: {
          include: {
            reporter: {
              select: { id: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        siteReviews: {
          include: {
            reviewer: {
              select: { id: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!site) {
      return res.status(404).json({ error: 'Heritage site not found' })
    }

    // Calculate average rating
    const averageRating = site.siteReviews.length > 0
      ? site.siteReviews.reduce((sum, review) => sum + review.rating, 0) / site.siteReviews.length
      : null

    res.json({
      ...site,
      averageRating,
      reviewCount: site.siteReviews.length,
      reportCount: site.siteReports.length,
      opportunityCount: site.opportunities.length
    })
  } catch (error) {
    console.error('Error fetching heritage site:', error)
    res.status(500).json({ error: 'Failed to fetch heritage site' })
  }
})

// POST /heritage-sites/:id/reports - Submit a site condition report
router.post('/:id/reports', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { reportType, description, urgency, images, latitude, longitude } = req.body
    const userId = req.user!.id

    // Verify site exists
    const site = await prisma.heritageSite.findUnique({
      where: { id }
    })

    if (!site) {
      return res.status(404).json({ error: 'Heritage site not found' })
    }

    const report = await prisma.siteReport.create({
      data: {
        siteId: id,
        reporterId: userId,
        reportType,
        description,
        urgency,
        images: images || [],
        latitude: latitude || site.latitude,
        longitude: longitude || site.longitude
      },
      include: {
        reporter: {
          select: { id: true, email: true }
        }
      }
    })

    res.status(201).json(report)
  } catch (error) {
    console.error('Error creating site report:', error)
    res.status(500).json({ error: 'Failed to create site report' })
  }
})

// POST /heritage-sites/:id/reviews - Submit a site review
router.post('/:id/reviews', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { rating, comment, visitDate, images } = req.body
    const userId = req.user!.id

    // Verify site exists
    const site = await prisma.heritageSite.findUnique({
      where: { id }
    })

    if (!site) {
      return res.status(404).json({ error: 'Heritage site not found' })
    }

    // Check if user already reviewed this site
    const existingReview = await prisma.siteReview.findFirst({
      where: {
        siteId: id,
        reviewerId: userId
      }
    })

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this site' })
    }

    const review = await prisma.siteReview.create({
      data: {
        siteId: id,
        reviewerId: userId,
        rating,
        comment,
        visitDate: visitDate ? new Date(visitDate) : null,
        images: images || []
      },
      include: {
        reviewer: {
          select: { id: true, email: true }
        }
      }
    })

    res.status(201).json(review)
  } catch (error) {
    console.error('Error creating site review:', error)
    res.status(500).json({ error: 'Failed to create site review' })
  }
})

// GET /heritage-sites/provinces - Get list of provinces with heritage sites
router.get('/meta/provinces', async (req, res) => {
  try {
    const provinces = await prisma.heritageSite.findMany({
      select: {
        province: true
      },
      distinct: ['province'],
      orderBy: {
        province: 'asc'
      }
    })

    res.json(provinces.map(p => p.province))
  } catch (error) {
    console.error('Error fetching provinces:', error)
    res.status(500).json({ error: 'Failed to fetch provinces' })
  }
})

// GET /heritage-sites/types - Get list of heritage site types
router.get('/meta/types', async (req, res) => {
  try {
    const types = await prisma.heritageSite.findMany({
      select: {
        type: true,
        category: true
      },
      distinct: ['type', 'category']
    })

    const uniqueTypes = Array.from(new Set(types.map(t => t.type)))
    const uniqueCategories = Array.from(new Set(types.map(t => t.category).filter(Boolean)))

    res.json({
      types: uniqueTypes,
      categories: uniqueCategories
    })
  } catch (error) {
    console.error('Error fetching types:', error)
    res.status(500).json({ error: 'Failed to fetch types' })
  }
})

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const d = R * c // Distance in kilometers
  return d
}

export default router
