/**
 * Firebase Cloud Functions
 *
 * Social stats (YouTube, Instagram, TikTok) come from Firestore only.
 * Admin edits mediaKit/socialStats via the Admin Panel — no external API fetching.
 */
import { initializeApp } from 'firebase-admin/app';
initializeApp();
