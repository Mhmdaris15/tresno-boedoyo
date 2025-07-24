import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'UNAUTHORIZED'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true 
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        error: 'UNAUTHORIZED'
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};
