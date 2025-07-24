import { Request, Response } from 'express';
import prisma from '../config/database';

// Define UserRole enum locally until Prisma client is generated
enum UserRole {
  VOLUNTEER = 'VOLUNTEER',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN'
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export class UserController {
  getUserStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // For now, return default stats - will be implemented with actual data later
      const stats = {
        totalVolunteerHours: 0,
        eventsParticipated: 0,
        impactScore: 0,
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user stats',
        error: error.message
      });
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Fetch user with related profile data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          volunteer: {
            include: {
              skills: true,
            }
          },
          coordinator: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message
      });
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { volunteer, coordinator } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update based on user role
      if (user.role === 'VOLUNTEER' && volunteer) {
        // Update volunteer profile
        const updatedVolunteer = await prisma.volunteer.upsert({
          where: { userId },
          create: {
            userId,
            firstName: volunteer.firstName || '',
            lastName: volunteer.lastName || '',
            phone: volunteer.phone || '',
            dateOfBirth: volunteer.dateOfBirth ? new Date(volunteer.dateOfBirth) : null,
            nationality: volunteer.nationality || '',
            languages: volunteer.languages || [],
            bio: volunteer.bio || '',
          },
          update: {
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            phone: volunteer.phone,
            dateOfBirth: volunteer.dateOfBirth ? new Date(volunteer.dateOfBirth) : null,
            nationality: volunteer.nationality,
            languages: volunteer.languages,
            bio: volunteer.bio,
          }
        });

        // Handle skills, experiences, and education updates
        // For now, we'll implement basic profile updates
        // Skills, experiences, and education will be handled separately
      } else if (user.role === 'COORDINATOR' && coordinator) {
        // Update coordinator profile
        await prisma.coordinator.upsert({
          where: { userId },
          create: {
            userId,
            firstName: coordinator.firstName || '',
            lastName: coordinator.lastName || '',
            phone: coordinator.phone || '',
            department: coordinator.department || '',
            bio: coordinator.bio || '',
          },
          update: {
            firstName: coordinator.firstName,
            lastName: coordinator.lastName,
            phone: coordinator.phone,
            department: coordinator.department,
            bio: coordinator.bio,
          }
        });
      }

      // Fetch updated user data
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          volunteer: {
            include: {
              skills: true,
            }
          },
          coordinator: true
        }
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  };

  uploadProfilePicture = async (req: AuthenticatedRequest, res: Response) => {
    try {
      // This will be implemented when we add file upload middleware
      res.status(501).json({
        success: false,
        message: 'Profile picture upload not implemented yet'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile picture',
        error: error.message
      });
    }
  };
}
