import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';

// Define UserRole enum locally until Prisma client is generated
enum UserRole {
  VOLUNTEER = 'VOLUNTEER',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN'
}

interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

  async register(data: RegisterData) {
    const { email, password, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        volunteer: true,
        coordinator: true
      }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        volunteer: user.volunteer,
        coordinator: user.coordinator
      },
      token
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteer: {
          include: {
            skills: {
              include: {
                skill: true
              }
            },
            interests: {
              include: {
                interest: true
              }
            },
            achievements: true
          }
        },
        coordinator: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      volunteer: user.volunteer,
      coordinator: user.coordinator
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { userId: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
