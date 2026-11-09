import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.ts';
import { activityLogs } from '../db/schema.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'ngobrol-di-kantor-dark-secret-key-2024';

export interface AdminUserPayload {
  id: number;
  username: string;
  role: string;
  mustChangePassword: boolean;
}

export interface AuthenticatedAdminRequest extends Request {
  admin?: AdminUserPayload;
}

export function generateToken(payload: AdminUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminUserPayload;
  } catch {
    return null;
  }
}

// Simple in-memory rate limiter for login protection
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  // 15-minute window
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= 8) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true;
}

export function clearLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export const requireAdminAuth = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak: Token autentikasi diperlukan.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sesi telah kedaluwarsa atau token tidak valid. Silakan login kembali.' });
  }

  req.admin = payload;
  next();
};

export async function logAdminActivity(
  adminUsername: string,
  action: string,
  targetType: string,
  details: string,
  ipAddress?: string
) {
  try {
    await db.insert(activityLogs).values({
      adminUsername,
      action,
      targetType,
      details,
      ipAddress: ipAddress || 'internal',
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
}
