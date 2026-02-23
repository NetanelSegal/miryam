import { defineSecret } from 'firebase-functions/params';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const youtubeApiKey = defineSecret('YOUTUBE_API_KEY');
initializeApp();
const db = getFirestore();
async function fetchYouTubeStats(channelId, apiKey) {
    if (!apiKey)
        return null;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok)
        return null;
    const data = (await res.json());
    const item = data.items?.[0];
    const stats = item?.statistics;
    if (!stats?.subscriberCount)
        return null;
    return {
        subscribers: parseInt(stats.subscriberCount, 10),
        views: stats.viewCount ? parseInt(stats.viewCount, 10) : undefined,
    };
}
async function fetchInstagramStats(_username) {
    // Instagram API requires Facebook App + OAuth + Business Discovery
    // Requires INSTAGRAM_ACCESS_TOKEN in env - set up per CREDENTIALS.md
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token)
        return null;
    // Business Discovery: GET /{ig-user-id}/business_discovery?fields=business_discovery.username({username}){followers_count}
    // We need ig-user-id from the token - for now we skip; user configures per docs
    return null;
}
async function syncSocialStats() {
    const [configSnap, existingSnap] = await Promise.all([
        db.doc('mediaKit/config').get(),
        db.doc('mediaKit/socialStats').get(),
    ]);
    const config = (configSnap.data() ?? {});
    const existing = (existingSnap.exists ? existingSnap.data() : {});
    const stats = {
        youtube: existing.youtube,
        instagram: existing.instagram,
        tiktok: existing.tiktok,
        engagementPercent: existing.engagementPercent,
        updatedAt: Date.now(),
    };
    // YouTube
    let ytKey = '';
    try {
        ytKey = youtubeApiKey.value() ?? '';
    }
    catch {
        /* secret not set */
    }
    if (config.youtubeChannelId && ytKey && ytKey !== 'not-set') {
        const youtube = await fetchYouTubeStats(config.youtubeChannelId, ytKey);
        if (youtube)
            stats.youtube = youtube;
    }
    // Instagram - manual override or API
    if (config.manualInstagram != null) {
        stats.instagram = { followers: config.manualInstagram };
    }
    else if (config.instagramUsername) {
        const ig = await fetchInstagramStats(config.instagramUsername);
        if (ig)
            stats.instagram = ig;
    }
    // TikTok - manual only
    if (config.manualTiktok != null) {
        stats.tiktok = { followers: config.manualTiktok };
    }
    // Engagement - manual only
    if (config.manualEngagement != null) {
        stats.engagementPercent = config.manualEngagement;
    }
    // TikTok top videos - from config (admin-curated)
    if (config.tiktokTopVideos && Array.isArray(config.tiktokTopVideos)) {
        stats.tiktokTopVideos = config.tiktokTopVideos.filter((v) => typeof v === 'string').slice(0, 3);
    }
    else if (existing.tiktokTopVideos) {
        stats.tiktokTopVideos = existing.tiktokTopVideos;
    }
    // Seed fallback when doc is empty and no API/manual data
    if (!stats.youtube && !stats.instagram && !stats.tiktok && stats.engagementPercent == null) {
        stats.youtube = { subscribers: 45000, views: 0 };
        stats.instagram = { followers: 580000 };
        stats.tiktok = { followers: 620000 };
        stats.engagementPercent = 8.2;
    }
    return stats;
}
const secrets = [youtubeApiKey];
/** Scheduled: run every 6 hours to refresh social stats */
export const scheduledSyncSocialStats = onSchedule({ schedule: '0 */6 * * *', timeZone: 'Asia/Jerusalem', secrets }, async () => {
    const stats = await syncSocialStats();
    await db.doc('mediaKit/socialStats').set(stats, { merge: true });
});
/** Callable: admin can trigger sync manually */
export const syncSocialStatsCallable = onCall({ secrets, cors: true }, async (request) => {
    if (!request.auth?.token?.email) {
        throw new HttpsError('unauthenticated', 'Must be logged in');
    }
    const adminSnap = await db.doc(`admins/${request.auth.token.email}`).get();
    if (!adminSnap.exists) {
        throw new HttpsError('permission-denied', 'Admin only');
    }
    const stats = await syncSocialStats();
    await db.doc('mediaKit/socialStats').set(stats, { merge: true });
    return { success: true, updatedAt: stats.updatedAt };
});
