# Student Social App (Expo)

## Setup

1. Install deps

```bash
cd app
npm install
```

2. Create `.env` with Firebase and API base

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

3. Run

```bash
npm run start
```

## Android Play Store (to prepare)
- Configure Android package in `app.json` (`android.package`)
- Run `npm run android` to generate native project and build
- Set app icon, splash images in `assets/`
- Configure Firebase SHA-1 fingerprints if using Google sign-in on Android