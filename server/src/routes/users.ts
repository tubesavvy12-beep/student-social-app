import { Router } from 'express';
import prisma from '../prisma.js';
import { requireAuth, AuthedRequest } from '../auth/middleware.js';

const router = Router();

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.userId }, include: { school: true } });
  res.json(me);
});

router.get('/:handle', async (req, res) => {
  const { handle } = req.params;
  const user = await prisma.user.findUnique({ where: { handle }, include: { school: true } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.get('/', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { handle: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 20,
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

router.post('/follow/:handle', requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { handle: req.params.handle } });
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.id === req.userId) return res.status(400).json({ error: 'Cannot follow yourself' });
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: req.userId!, followingId: target.id } },
    update: {},
    create: { followerId: req.userId!, followingId: target.id }
  });
  res.json({ ok: true });
});

router.post('/unfollow/:handle', requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { handle: req.params.handle } });
  if (!target) return res.status(404).json({ error: 'User not found' });
  await prisma.follow.deleteMany({ where: { followerId: req.userId!, followingId: target.id } });
  res.json({ ok: true });
});

export default router;