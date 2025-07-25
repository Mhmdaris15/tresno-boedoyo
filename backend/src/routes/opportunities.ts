import { Router } from 'express';
import prisma from '../config/database';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get all opportunities with filters
router.get('/', async (req: any, res: any) => {
  try {
    const { 
      status = 'PUBLISHED', 
      location, 
      search, 
      limit = 20, 
      offset = 0 
    } = req.query;

    const where: any = {};

    // Status filter
    if (status !== 'ALL') {
      where.status = status;
    }

    // Location filter
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        coordinator: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        applications: {
          select: {
            id: true,
            status: true
          }
        },
        _count: {
          select: {
            applications: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { dateTime: 'asc' }
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Transform data to match frontend expectations
    const transformedOpportunities = opportunities.map(opp => ({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      type: opp.skills.length > 0 ? opp.skills[0].skill.category.toUpperCase() : 'GENERAL',
      location: opp.location,
      startDate: opp.dateTime.toISOString().split('T')[0],
      endDate: new Date(opp.dateTime.getTime() + (opp.duration * 60 * 60 * 1000)).toISOString().split('T')[0],
      maxParticipants: opp.maxVolunteers,
      currentParticipants: opp._count.applications,
      status: opp.status === 'PUBLISHED' ? 'ACTIVE' : 
              opp.status === 'COMPLETED' ? 'COMPLETED' : 
              opp.status === 'CANCELLED' ? 'CANCELLED' : 'ACTIVE',
      coordinator: {
        name: `${opp.coordinator.firstName} ${opp.coordinator.lastName}`,
        email: opp.coordinator.user.email
      },
      skills: opp.skills.map(s => ({
        name: s.skill.name,
        category: s.skill.category,
        required: s.required,
        level: s.level
      })),
      requirements: opp.requirements,
      benefits: opp.benefits,
      impactStatement: opp.impactStatement,
      duration: opp.duration,
      createdAt: opp.createdAt,
      updatedAt: opp.updatedAt
    }));

    res.json({
      opportunities: transformedOpportunities,
      total: await prisma.opportunity.count({ where }),
      page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
      totalPages: Math.ceil(await prisma.opportunity.count({ where }) / parseInt(limit))
    });

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch opportunities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single opportunity by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        coordinator: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        applications: {
          include: {
            volunteer: {
              include: {
                user: {
                  select: {
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Transform data
    const transformedOpportunity = {
      id: opportunity.id,
      title: opportunity.title,
      description: opportunity.description,
      type: opportunity.skills.length > 0 ? opportunity.skills[0].skill.category.toUpperCase() : 'GENERAL',
      location: opportunity.location,
      startDate: opportunity.dateTime.toISOString().split('T')[0],
      endDate: new Date(opportunity.dateTime.getTime() + (opportunity.duration * 60 * 60 * 1000)).toISOString().split('T')[0],
      maxParticipants: opportunity.maxVolunteers,
      currentParticipants: opportunity.applications.filter(app => app.status === 'APPROVED').length,
      status: opportunity.status === 'PUBLISHED' ? 'ACTIVE' : 
              opportunity.status === 'COMPLETED' ? 'COMPLETED' : 
              opportunity.status === 'CANCELLED' ? 'CANCELLED' : 'ACTIVE',
      coordinator: {
        name: `${opportunity.coordinator.firstName} ${opportunity.coordinator.lastName}`,
        email: opportunity.coordinator.user.email
      },
      skills: opportunity.skills.map(s => ({
        name: s.skill.name,
        category: s.skill.category,
        required: s.required,
        level: s.level
      })),
      requirements: opportunity.requirements,
      benefits: opportunity.benefits,
      impactStatement: opportunity.impactStatement,
      duration: opportunity.duration,
      applications: opportunity.applications.map(app => ({
        id: app.id,
        status: app.status,
        volunteer: {
          name: `${app.volunteer.firstName} ${app.volunteer.lastName}`,
          email: app.volunteer.user.email
        },
        appliedAt: app.appliedAt,
        message: app.message
      })),
      createdAt: opportunity.createdAt,
      updatedAt: opportunity.updatedAt
    };

    res.json(transformedOpportunity);

  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ 
      error: 'Failed to fetch opportunity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Apply to opportunity
router.post('/:id/apply', authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Get volunteer record
    const volunteer = await prisma.volunteer.findUnique({
      where: { userId }
    });

    if (!volunteer) {
      return res.status(403).json({ error: 'Only volunteers can apply to opportunities' });
    }

    // Check if opportunity exists and is active
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    if (opportunity.status !== 'PUBLISHED') {
      return res.status(400).json({ error: 'This opportunity is not available for applications' });
    }

    if (opportunity._count.applications >= opportunity.maxVolunteers) {
      return res.status(400).json({ error: 'This opportunity is full' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        volunteerId_opportunityId: {
          volunteerId: volunteer.id,
          opportunityId: id
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this opportunity' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        volunteerId: volunteer.id,
        opportunityId: id,
        message: message || '',
        status: 'PENDING'
      },
      include: {
        opportunity: {
          select: {
            title: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        opportunity: application.opportunity.title,
        appliedAt: application.appliedAt
      }
    });

  } catch (error) {
    console.error('Error applying to opportunity:', error);
    res.status(500).json({ 
      error: 'Failed to apply to opportunity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new opportunity (coordinators only)
router.post('/', authMiddleware, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      location,
      dateTime,
      duration,
      maxVolunteers,
      requirements,
      benefits,
      impactStatement,
      skills
    } = req.body;

    // Get coordinator record
    const coordinator = await prisma.coordinator.findUnique({
      where: { userId }
    });

    if (!coordinator) {
      return res.status(403).json({ error: 'Only coordinators can create opportunities' });
    }

    // Create opportunity
    const opportunity = await prisma.opportunity.create({
      data: {
        coordinatorId: coordinator.id,
        title,
        description,
        location,
        dateTime: new Date(dateTime),
        duration: parseInt(duration),
        maxVolunteers: parseInt(maxVolunteers),
        requirements: requirements || null,
        benefits: benefits || null,
        impactStatement: impactStatement || null,
        status: 'PUBLISHED'
      }
    });

    // Add skills if provided
    if (skills && Array.isArray(skills)) {
      for (const skillData of skills) {
        // Find or create skill
        let skill = await prisma.skill.findFirst({
          where: { name: skillData.name }
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: {
              name: skillData.name,
              category: skillData.category || 'GENERAL',
              description: skillData.description || null
            }
          });
        }

        // Link skill to opportunity
        await prisma.opportunitySkill.create({
          data: {
            opportunityId: opportunity.id,
            skillId: skill.id,
            required: skillData.required || true,
            level: skillData.level || 'BEGINNER'
          }
        });
      }
    }

    res.status(201).json({
      message: 'Opportunity created successfully',
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        status: opportunity.status,
        createdAt: opportunity.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ 
      error: 'Failed to create opportunity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
