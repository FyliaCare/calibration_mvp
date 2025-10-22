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
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiresIn,
  };
  return jwt.sign(payload, String(config.jwt.accessSecret), options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn,
  };
  return jwt.sign({ userId }, String(config.jwt.refreshSecret), options);
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, String(config.jwt.refreshSecret)) as { userId: string };
};
