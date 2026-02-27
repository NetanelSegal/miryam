# 99 Archive

## Deprecated Features

### EngagementPercentCard
- **Removed:** February 24, 2026
- **Reason:** The engagement percentage metric was an auto-calculated TikTok-only value that added noise to the overall Media Kit and was confusing for multi-platform case studies.
- **Files Removed:** `src/pages/admin/media-kit/EngagementPercentCard.tsx`
- **Impact:** The Homepage stats grid was adjusted from 4 columns down to 3 (`md:grid-cols-3`).

### Local Storage Fallbacks
- Initially, the project used `localStorage` to mock database interactions (e.g., storing Trivia results and Blessings). These are actively being replaced by Firebase Firestore and Realtime Database integrations as of Phase 5.
