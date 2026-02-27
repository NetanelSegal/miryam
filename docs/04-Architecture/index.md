# 04 Architecture

## System Overview
The application is a Single Page Application (SPA) built with React and Vite. It heavily relies on client-side routing, lazy loading for performance, and a centralized routing configuration (`src/config/routes.ts`). State management is handled via custom React hooks and store files (`src/lib/*-store.ts`), transitioning from `localStorage` to Firebase.

## Data Layer & Firebase
The app acts directly against Firebase services without a traditional intermediary Node.js backend (though Firebase Functions `functions/src/index.ts` exist for specific server-side logic).

- **Authentication:** `ParticipantContext.tsx` handles user sessions via Firebase Auth (Google Provider).
- **Authorization:** `AdminGuard.tsx` protects the `/admin` routes by verifying the logged-in user against a Firestore `admins` collection.
- **Data Stores:** Abstracted stores (e.g., `blessings-store.ts`, `trivia-store.ts`) handle data fetching and syncing, designed to swap local mock data with Firestore queries seamlessly.

## Security Architecture
- **Firestore Rules:** Strict `firestore.rules` protect data integrity. Admin collections can only be read/written by verified admin UIDs. Public collections (like votes/blessings) have rate-limiting and validation rules.
- **Admin Access:** No password login; admins authenticate via Google, and their email must be present in the Firestore `admins` whitelist.

## Data Flow (Participant Identity)
1. User enters the Party Zone.
2. `ParticipantGate` prompts for Google Sign-in.
3. Upon auth, a unique `participantId` is created/retrieved.
4. This ID is used to prevent duplicate votes in the Realtime DB and multiple trivia attempts in Firestore.
