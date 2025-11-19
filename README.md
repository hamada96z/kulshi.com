# Kul-si Marketplace (Firebase MVP)

Arabic-first classifieds marketplace using:

- Next.js 14 (App Router)
- Firebase (Auth, Firestore, Storage)
- Tailwind CSS
- Languages: AR (default), EN, DE, TR (UI texts)

## 1. Firebase Setup

1. Go to https://console.firebase.google.com and create a project (e.g. `kulsi`).
2. In `Build -> Authentication`: enable **Email/Password**.
3. In `Build -> Firestore Database`: create a database (start in production or test mode).
4. In `Build -> Storage`: create a bucket (default region is fine).

5. In `Project settings -> General -> Your apps` create a **Web app** and copy the config:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

6. Put these values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 2. Firestore Collection

Create a collection `listings` (no fields required beforehand; documents are created by the app with fields):

- title (string)
- description (string)
- price (number)
- currency (string)
- thumbnailUrl (string)
- ownerUid (string)
- status (string)
- createdAt (timestamp)

Security rules can later be added to restrict write access to authenticated users only.

## 3. Local run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

- `/login` to register / login
- `/listings/new` to create a listing
- Home page shows all listings
