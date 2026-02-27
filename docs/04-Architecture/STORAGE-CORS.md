# Firebase Storage CORS Configuration

> **TL;DR:** Run `gsutil cors set storage.cors.json gs://miryam-22429.firebasestorage.app` (requires Google Cloud SDK). Required for uploads from localhost and for images to display correctly from cross-origin.

## Problem
Browser uploads to Firebase Storage from localhost fail with:
- `CORS Preflight Did Not Succeed`
- `404` on OPTIONS request
- `Cross-Origin Request Blocked`

Firebase Storage requires CORS to be configured on the underlying Google Cloud Storage bucket for cross-origin requests (e.g., localhost → Firebase).

## Solution

### 1. Apply CORS to your bucket

```bash
gsutil cors set storage.cors.json gs://miryam-22429.firebasestorage.app
```

If that fails, try the legacy bucket:
```bash
gsutil cors set storage.cors.json gs://miryam-22429.appspot.com
```

(Replace `miryam-22429` with your Firebase project ID if different. Check Firebase Console → Storage for the exact bucket name.)

### 2. Verify
```bash
gsutil cors get gs://miryam-22429.firebasestorage.app
```

### 3. Restart dev server
After applying CORS, restart `npm run dev` and retry image uploads.

## Storage paths (all admin-editable images)

| Path | Used by | Who uploads |
|------|---------|-------------|
| `blessings/{id}` | Blessings | Participants |
| `costumes/{id}` | Voting (costumes) | Participants |
| `case-studies/{id}` | Case studies (HomePage) | Admin |

## Verifying Firebase Storage URLs

After uploading an image (e.g. via Admin → Case Studies), verify the URL serves the image:

```bash
npm run verify-storage -- "https://firebasestorage.googleapis.com/v0/b/YOUR-BUCKET/o/case-studies%2FUUID?alt=media&token=XXX"
```

Get the URL from Firestore (`caseStudies` collection, `imageUrl` field) or the Admin Panel. The script checks:
- HTTP 200
- `Content-Type` starts with `image/`

For `<img src="...">`, some environments require CORS to be configured for GET. The updated `storage.cors.json` includes:
- `origin: ["*"]` for GET/HEAD — allows images to load from any origin
- Specific origins for uploads (localhost, Firebase Hosting)

## Troubleshooting: Images show as black/broken on homepage

1. **Apply CORS** — Run `gsutil cors set storage.cors.json gs://miryam-22429.firebasestorage.app`
2. **Reset & Re-seed** — Admin → Media Kit → "איפוס מלא ויצירה מחדש" to wipe and repopulate with Storage URLs
3. **Verify URLs** — DevTools → Network → filter "Img"; check for 403/404/CORS errors
4. **Check Firestore** — Ensure `caseStudies` docs have `imageUrl` as full `https://firebasestorage.googleapis.com/...` URLs, not `/images/...` local paths

## Unit tests vs real uploads

| | Unit tests | Browser (real) |
|---|------------|----------------|
| Firebase | **Mocked** — no network calls | Real Firebase Storage/Firestore |
| Uploads | Simulated via `vi.fn()` | Actual HTTP to Firebase |
| CORS | Not relevant (no network) | **Required** — must configure bucket |

The unit tests in `src/lib/*.test.ts` verify **code logic** (correct functions called, correct data shape). They do **not** verify that real Firebase uploads work. Use manual QA or Firebase Emulator for integration testing.
