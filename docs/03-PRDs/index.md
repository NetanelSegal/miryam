# 03 Product Requirement Documents (PRDs)

## Feature: The Hybrid Application

### 1. Problem Statement
Miryam Segal needs a single digital destination that captures the energetic celebration of a birthday event for her followers while simultaneously presenting a professional, numbers-driven media kit to attract brand partnerships.

### 2. Core Modules

#### A. Media Kit (Homepage)
- **Stats Dashboard:** Display follower counts, top videos, and platform splits (Instagram, TikTok, YouTube).
- **Brand Marquee:** Infinite scroll of brands Miryam has collaborated with.
- **Case Studies:** Highlight successful campaigns with metrics and imagery.
- **Contact:** Form for agencies to get in touch.

#### B. Party Zone (`/party`)
- **Trivia:** 10-question quiz with a leaderboard and one attempt per user.
- **Blessings Wall:** Masonry layout of user-submitted blessings with photo uploads.
- **Dictionary:** Interactive cards explaining Miryam's internal slang/concepts.
- **Voting:** Real-time polls on fun topics (e.g., best costumes) with a results bar chart.

#### C. Live Event Display (`/live`)
- An auto-rotating, TV-friendly display showing leaderboards, incoming blessings, and vote results in real-time for the physical party venue.

#### D. Admin Dashboard (`/admin`)
- Secure portal restricted to whitelisted Google accounts.
- Full CRUD operations for Brands, Case Studies, Trivia Questions, Blessings, Dictionary terms, and Media Kit Stats.
