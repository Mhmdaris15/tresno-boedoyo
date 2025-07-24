import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

// Define UserRole enum locally until Prisma client is generated
enum UserRole {
  VOLUNTEER = 'VOLUNTEER',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN'
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      
      // Convert role string to UserRole enum
      let userRole: UserRole;
      switch (role?.toLowerCase()) {
        case 'volunteer':
          userRole = UserRole.VOLUNTEER;
          break;
        case 'coordinator':
          userRole = UserRole.COORDINATOR;
          break;
        case 'admin':
          userRole = UserRole.ADMIN;
          break;
        default:
          userRole = UserRole.VOLUNTEER; // Default to volunteer
      }
      
      const result = await this.authService.register({ email, password, role: userRole });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: 'REGISTRATION_FAILED'
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const result = await this.authService.login({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
        error: 'LOGIN_FAILED'
      });
    }
  };

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      // Extract user ID from JWT (middleware should handle this)
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'NO_USER_ID'
        });
      }

      const user = await this.authService.getCurrentUser(userId);
      
      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: 'PROFILE_FETCH_FAILED'
      });
    }
  };
}
