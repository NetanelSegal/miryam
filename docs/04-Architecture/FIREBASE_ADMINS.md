# Admin Setup

Admin access is controlled via Firebase Auth (Google sign-in) and a Firestore whitelist.

## Adding the First Admin

1. Deploy Firestore rules: `npm run deploy:rules` (או `firebase deploy --only firestore:rules`)
2. In [Firebase Console](https://console.firebase.google.com) → Firestore Database:
   - Create a collection named `admins`
   - Add a document with **document ID** = the admin's email (e.g. `admin@gmail.com`)
   - The document can be empty or contain `{ "role": "admin" }`

## Adding More Admins

**Option A:** Use the Admin Panel — go to `/admin` → טאב "אדמינים" → הוסף אדמין (enter email, click Add).

**Option B:** Firebase Console — add documents to the `admins` collection with document ID = admin email.

## Deploy (Vercel)

Firestore rules נפרדים מ-Vercel — הם נפרסים ל-Firebase. אחרי כל שינוי ב-`firestore.rules` הרץ `npm run deploy:rules`. אם תרצה לשלב ב-CI, הוסף `FIREBASE_TOKEN` ל-Vercel env.

## Security

- Only users whose email exists in `admins/{email}` can write to `triviaQuestions`
- Existing admins can add/remove other admins via the Admin Panel or Firestore
- Firestore rules enforce this server-side; the client cannot bypass it
