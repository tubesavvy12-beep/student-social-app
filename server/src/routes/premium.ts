import { Router } from 'express';
import prisma from '../prisma.js';
import { requireAuth, AuthedRequest } from '../auth/middleware.js';
import { z } from 'zod';

const router = Router();

// School registration by headmaster
const schoolSchema = z.object({ name: z.string().min(2), domain: z.string().optional(), address: z.string().optional() });
router.post('/schools', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = schoolSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, domain, address } = parsed.data;
  const school = await prisma.school.create({ data: { name, domain: domain || null, address: address || null, headmasterUserId: req.userId! } });
  await prisma.user.update({ where: { id: req.userId! }, data: { role: 'HEADMASTER', schoolId: school.id } });
  res.json(school);
});

// Attach document to profile (student uploads proof)
const docSchema = z.object({ type: z.enum(['STUDENT_ID', 'TRANSCRIPT', 'OTHER']), url: z.string().url() });
router.post('/documents', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = docSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const doc = await prisma.document.create({ data: { userId: req.userId!, type: parsed.data.type as any, url: parsed.data.url } });
  res.json(doc);
});

// Groups
const groupSchema = z.object({ name: z.string().min(2), schoolId: z.string().optional(), isPrivate: z.boolean().default(true) });
router.post('/groups', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = groupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, schoolId, isPrivate } = parsed.data;
  const group = await prisma.group.create({ data: { name, schoolId: schoolId || null, isPrivate, ownerId: req.userId! } });
  await prisma.groupMember.create({ data: { groupId: group.id, userId: req.userId!, role: 'OWNER' } });
  res.json(group);
});

router.get('/groups/:id', requireAuth, async (req: AuthedRequest, res) => {
  const group = await prisma.group.findUnique({ where: { id: req.params.id }, include: { members: { include: { user: true } } } });
  if (!group) return res.status(404).json({ error: 'Not found' });
  res.json(group);
});

// Invites
const inviteSchema = z.object({ groupId: z.string(), inviteeHandle: z.string() });
router.post('/groups/invite', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const invitee = await prisma.user.findUnique({ where: { handle: parsed.data.inviteeHandle } });
  if (!invitee) return res.status(404).json({ error: 'Invitee not found' });
  const invite = await prisma.groupInvite.upsert({
    where: { groupId_inviteeId: { groupId: parsed.data.groupId, inviteeId: invitee.id } },
    update: { status: 'PENDING' },
    create: { groupId: parsed.data.groupId, inviterId: req.userId!, inviteeId: invitee.id }
  });
  res.json(invite);
});

router.post('/groups/invite/:id/accept', requireAuth, async (req: AuthedRequest, res) => {
  const invite = await prisma.groupInvite.update({ where: { id: req.params.id }, data: { status: 'ACCEPTED' } });
  await prisma.groupMember.upsert({ where: { groupId_userId: { groupId: invite.groupId, userId: req.userId! } }, update: {}, create: { groupId: invite.groupId, userId: req.userId!, role: 'MEMBER' } });
  res.json({ ok: true });
});

router.post('/groups/invite/:id/decline', requireAuth, async (req: AuthedRequest, res) => {
  await prisma.groupInvite.update({ where: { id: req.params.id }, data: { status: 'DECLINED' } });
  res.json({ ok: true });
});

export default router;