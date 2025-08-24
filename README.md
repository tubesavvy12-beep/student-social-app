# Student Social - Twitter-like app for students

## Quick start (local)

1. Docker Engine running
2. Copy server env: `cp server/.env.example server/.env` and set Firebase vars if available
3. Start services:

```bash
docker compose up -d --build
```

4. Open Prisma Studio (optional):

```bash
cd server && npx prisma studio
```

Server runs at `http://localhost:4000`.

## Stack
- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL, Firebase Admin (ID tokens)
- App: Expo (React Native) + Web (to be added next)

## Roadmap
- [x] Database schema
- [x] Core API: users, tweets, likes, comments, follow, feed, search
- [ ] Expo app with UI screens (Login, Feed, Compose, Profile, Search, Groups, School)
- [ ] Premium: documents and groups UI, video upload
- [ ] Android Play Store packaging and instructions
