# Firebase Storage Structure

All admin-editable document images are stored in Firebase Storage. Firestore holds only the download URLs.

## Bucket paths

| Path | Collection | Who writes | Read |
|------|------------|------------|------|
| `blessings/{id}` | blessings | Participants (signed-in) | Public |
| `costumes/{id}` | costumes | Participants (signed-in) | Public |
| `case-studies/{id}` | caseStudies | Admin | Public |

## Rules summary

- **Read:** All paths allow public read (images are displayed on public pages).
- **Write:** All paths require `request.auth != null`. Storage rules cannot query Firestore for admin status; the app enforces admin-only access for case studies via AdminGuard.

## Code

- **Shared upload:** `src/lib/storage-upload.ts` — `uploadImage(path, file)` compresses (800px, 0.7 quality, 10MB max) and uploads to `{path}/{uuid}`.
- **Stores:** `blessings-store`, `costumes-store`, `case-studies-store` expose `uploadBlessingPhoto`, `uploadCostumeImage`, `uploadCaseStudyImage` respectively.

## Seed

The seed (`seedBrandsAndCaseStudies`) uploads case study images to Storage when `imageUrl` starts with `/images/`:

1. Fetches the file from the app origin (same-origin).
2. Uploads to Storage via `uploadCaseStudyImage`.
3. Uses the returned URL in Firestore.

**Prerequisite:** Place default case study images in `public/images/` (e.g. `WhatsApp Image 2026-02-23 at 10.39.53.jpeg`) before running seed. Placeholder 1x1 JPEGs are included for dev.

**How to run seed:**
1. Sign in with Google (admin email must be in Firestore `admins` collection)
2. Navigate to `/seed` — runs seed on load and shows result
3. Or: go to Admin → Media Kit → click "יצירת brands ו-caseStudies"

**Note:** Firestore rules require an authenticated admin for writes. `VITE_SKIP_ADMIN_AUTH` only bypasses the AdminGuard UI; Firestore will reject writes without a signed-in admin.
