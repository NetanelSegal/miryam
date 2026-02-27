#!/usr/bin/env node
/**
 * Verify that a Firebase Storage URL returns a valid image.
 * Usage: node scripts/verify-storage-url.mjs <url>
 * Example: node scripts/verify-storage-url.mjs "https://firebasestorage.googleapis.com/v0/b/miryam-22429.firebasestorage.app/o/..."
 */
const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/verify-storage-url.mjs <firebase-storage-url>')
  console.error('Get a URL from: Admin Panel → Case Studies → copy imageUrl from any campaign')
  process.exit(1)
}

const isFirebaseStorageUrl = (u) =>
  typeof u === 'string' &&
  (u.startsWith('https://firebasestorage.googleapis.com/') || u.includes('firebasestorage'))

if (!isFirebaseStorageUrl(url)) {
  console.error('Error: URL does not look like a Firebase Storage URL')
  console.error('Expected: https://firebasestorage.googleapis.com/v0/b/...')
  process.exit(1)
}

try {
  const res = await fetch(url, { method: 'HEAD' })
  const contentType = res.headers.get('content-type') || ''

  if (!res.ok) {
    console.error(`✗ Failed: HTTP ${res.status} ${res.statusText}`)
    if (res.status === 404) console.error('  → File not found in Storage')
    if (res.status === 403) console.error('  → Check storage.rules allow read')
    process.exit(1)
  }

  if (!contentType.startsWith('image/')) {
    console.error(`✗ Unexpected Content-Type: ${contentType} (expected image/*)`)
    process.exit(1)
  }

  console.log(`✓ OK: ${contentType} (${res.headers.get('content-length') || '?'} bytes)`)
  console.log('  Firebase Storage URL is reachable and returns an image.')
} catch (err) {
  console.error('✗ Fetch failed:', err.message)
  process.exit(1)
}
