import { Router } from 'express';
import prisma from '../prisma.js';
import { requireAuth, AuthedRequest } from '../auth/middleware.js';
import { z } from 'zod';

const router = Router();

// Feed: friends/following first, then popular
router.get('/feed/home', requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;

  const following = await prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } });
  const followingIds = following.map(f => f.followingId);

  const followingTweets = await prisma.tweet.findMany({
    where: { authorId: { in: [...followingIds, userId] }, visibility: 'PUBLIC' },
    include: { media: true, author: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const popularTweets = await prisma.tweet.findMany({
    where: { authorId: { notIn: [...followingIds, userId] }, visibility: 'PUBLIC' },
    include: { media: true, author: true },
    orderBy: [
      { likeCount: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 50
  });

  res.json([...followingTweets, ...popularTweets]);
});

const createTweetSchema = z.object({
  content: z.string().min(1).max(1000),
  media: z.array(z.object({ url: z.string().url(), type: z.enum(['IMAGE', 'VIDEO']), width: z.number().optional(), height: z.number().optional(), duration: z.number().optional() })).default([]),
  groupId: z.string().optional()
});

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createTweetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { content, media, groupId } = parsed.data;

  const tweet = await prisma.tweet.create({
    data: {
      authorId: req.userId!,
      content,
      groupId: groupId || null,
      media: { create: media.map(m => ({ url: m.url, type: m.type as any, width: m.width ?? null, height: m.height ?? null, duration: m.duration ?? null })) }
    },
    include: { media: true }
  });
  res.json(tweet);
});

router.get('/:id', async (req, res) => {
  const tweet = await prisma.tweet.findUnique({ where: { id: req.params.id }, include: { media: true, author: true } });
  if (!tweet) return res.status(404).json({ error: 'Not found' });
  res.json(tweet);
});

router.get('/:id/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { tweetId: req.params.id },
    include: { author: true },
    orderBy: { createdAt: 'asc' }
  });
  res.json(comments);
});

router.post('/:id/like', requireAuth, async (req: AuthedRequest, res) => {
  const id = req.params.id;
  try {
    await prisma.like.create({ data: { tweetId: id, userId: req.userId! } });
    await prisma.tweet.update({ where: { id }, data: { likeCount: { increment: 1 } } });
  } catch {}
  res.json({ ok: true });
});

router.post('/:id/unlike', requireAuth, async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const deleted = await prisma.like.deleteMany({ where: { tweetId: id, userId: req.userId! } });
  if (deleted.count > 0) {
    await prisma.tweet.update({ where: { id }, data: { likeCount: { decrement: 1 } } });
  }
  res.json({ ok: true });
});

const commentSchema = z.object({ content: z.string().min(1).max(500), parentId: z.string().optional() });
router.post('/:id/comment', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { content, parentId } = parsed.data;
  const id = req.params.id;
  const comment = await prisma.comment.create({ data: { content, authorId: req.userId!, tweetId: id, parentId: parentId || null } });
  await prisma.tweet.update({ where: { id }, data: { commentCount: { increment: 1 } } });
  res.json(comment);
});

export default router;