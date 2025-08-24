import { Request, Response, NextFunction } from 'express';
import { getAuth } from './firebase.js';
import prisma from '../prisma.js';

export interface AuthedRequest extends Request {
  userId?: string;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing auth token' });
    }
    const token = authHeader.substring('Bearer '.length);

    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({ error: 'Auth not configured' });
    }

    const decoded = await auth.verifyIdToken(token);

    // find or create user
    let user = await prisma.user.findUnique({ where: { uid: decoded.uid } });
    if (!user) {
      const handleBase = (decoded.email?.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      let handle = handleBase;
      let suffix = 0;
      while (await prisma.user.findUnique({ where: { handle } })) {
        suffix += 1;
        handle = `${handleBase}${suffix}`;
      }
      user = await prisma.user.create({
        data: {
          uid: decoded.uid,
          email: decoded.email || null,
          handle,
          displayName: decoded.name || handle
        }
      });
    }

    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}