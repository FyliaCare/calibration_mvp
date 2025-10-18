import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';
import type { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.validators.js';

export class AuthController {
  register = asyncHandler(async (req: Request<object, object, RegisterInput>, res: Response) => {
    const user = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  });
  
  login = asyncHandler(async (req: Request<object, object, LoginInput>, res: Response) => {
    const result = await authService.login(req.body);
    
    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  });
  
  refreshToken = asyncHandler(async (req: Request<object, object, RefreshTokenInput>, res: Response) => {
    // Try to get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  });
  
  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  });
  
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getProfile(req.user!.id);
    
    res.json({
      success: true,
      data: user,
    });
  });
}

export const authController = new AuthController();
