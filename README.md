# Student Social - Twitter-like app for students

## Monorepo
- `server/`: Node.js + TypeScript + Express + Prisma + PostgreSQL
- `app/`: Expo (React Native) for Android + Web

## Backend setup (no Docker)

1. Create env

```bash
cp server/.env.example server/.env
```

2. Install deps and run migrations

```bash
cd server
npm install
npx prisma generate
# Set DATABASE_URL in .env to a running Postgres
npx prisma migrate dev --name init
npm run dev
```

Server runs at `http://localhost:4000`.

## Backend with Docker (optional)
Requires Docker Engine.

```bash
docker compose up -d --build
```

## Expo app setup

1. Create env in `app/.env` (or shell env)

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

2. Install and run

```bash
cd app
npm install
npm run start
```

## Features implemented
- Auth via Firebase ID tokens (Google/Facebook providers on web; configure native flows for Android)
- Tweets: text + unlimited images, optional group visibility
- Feed: following-first, then popular
- Interactions: like, comment, follow/unfollow
- Search users by handle/name/email
- Premium: school registration, documents attach, private groups (create/invite/accept)

## Android Play Store preparation
- Set Android package in `app/app.json` (`android.package`)
- Configure Firebase project, add Android app, set SHA-1/256 for Google sign-in
- Run `npm run android` to generate native project and build an APK/AAB
- Provide icons/splash under `app/assets/`

## Database schema
Prisma models located at `server/prisma/schema.prisma` include: `User`, `Tweet`, `Media`, `Like`, `Comment`, `Follow`, `School`, `Document`, `Group`, `GroupMember`, `GroupInvite`.

## API overview
- `GET /api/users?q=` search users
- `GET /api/users/:handle` profile by handle
- `POST /api/users/follow/:handle`, `POST /api/users/unfollow/:handle`
- `GET /api/tweets/feed/home` personalized feed
- `POST /api/tweets` create tweet
- `GET /api/tweets/:id` tweet detail
- `GET /api/tweets/:id/comments` list comments
- `POST /api/tweets/:id/like` / `POST /api/tweets/:id/unlike`
- `POST /api/tweets/:id/comment`
- `POST /api/premium/schools` register school
- `POST /api/premium/documents` attach document
- `POST /api/premium/groups` create group
- `POST /api/premium/groups/invite` invite to group
- `POST /api/premium/groups/invite/:id/accept|decline`

## Notes
- Production image/video storage should use a CDN/S3/GCS; the current app accepts URLs for simplicity.
- Payments are skipped for now.
