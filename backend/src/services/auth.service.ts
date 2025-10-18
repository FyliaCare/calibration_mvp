import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/auth.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validators.js';

export class AuthService {
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }
    
    // Hash password
    const passwordHash = await hashPassword(data.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: 'USER', // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    return user;
  }
  
  async login(data: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new AppError(401, 'Account is inactive');
    }
    
    // Verify password
    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = generateRefreshToken(user.id);
    
    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
  
  async refreshToken(token: string) {
    try {
      // Verify token
      const { userId } = verifyRefreshToken(token);
      
      // Check if token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });
      
      if (!storedToken) {
        throw new AppError(401, 'Invalid refresh token');
      }
      
      if (storedToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new AppError(401, 'Refresh token expired');
      }
      
      if (!storedToken.user.isActive) {
        throw new AppError(401, 'Account is inactive');
      }
      
      // Generate new access token
      const accessToken = generateAccessToken({
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      });
      
      // Optional: Rotate refresh token
      const newRefreshToken = generateRefreshToken(userId);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Delete old token and create new one (token rotation)
      await prisma.$transaction([
        prisma.refreshToken.delete({
          where: { id: storedToken.id },
        }),
        prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId,
            expiresAt,
          },
        }),
      ]);
      
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(401, 'Invalid refresh token');
    }
  }
  
  async logout(token: string) {
    try {
      await prisma.refreshToken.delete({
        where: { token },
      });
    } catch (error) {
      // Token might not exist, but that's okay
    }
  }
  
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    
    return user;
  }
}

export const authService = new AuthService();
