import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: {
  userId: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(
    payload, 
    String(config.jwt.accessSecret), 
    { expiresIn: config.jwt.accessExpiresIn } as SignOptions
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId }, 
    String(config.jwt.refreshSecret), 
    { expiresIn: config.jwt.refreshExpiresIn } as SignOptions
  );
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, String(config.jwt.refreshSecret)) as { userId: string };
};
