# Project Review — Miryam Segal Website

**Review Date:** February 24, 2026  
**Reviewer:** Product & UX/UI Review  
**Scope:** Admin panel, Media Kit, brands carousel, engagement metric removal

---

## Executive Summary

The Miryam Segal website is a birthday party / media kit platform built with React, Vite, Firebase, and Tailwind. The review covered admin edit capabilities, removal of the "אחוז מעורבות" (engagement percentage) metric, brands carousel overflow, and general UX/UI observations.

---

## Changes Applied

### 1. Removed "אחוז מעורבות" (Engagement Percentage)

- **Admin:** Deleted `EngagementPercentCard.tsx` and removed it from `AdminMediaKitStats.tsx`
- **HomePage:** Removed the engagement stat from `buildDisplayStats()` and updated the stats grid from 4 columns to 3 (`md:grid-cols-3`)
- **Rationale:** Per feedback, the metric was not useful; it was an auto-calculated TikTok-only value that added noise to the Media Kit

### 2. Brands Carousel Overflow Fix

- **RootLayout:** Added `overflow-x-hidden` to the root layout to avoid horizontal page scroll
- **HomePage:** Added `overflow-x-hidden` to the brands section and `overflow-hidden` to the `Container`
- **Marquee component:** Added `w-full max-w-full` so the marquee stays within its parent
- **Result:** Brand logos in the "עבדתי עם" section should no longer cause horizontal overflow

### 3. Admin Edit Capabilities Added

| Admin Section   | Before                   | After                                      |
|-----------------|---------------------------|--------------------------------------------|
| **Brands**      | Add, Delete only          | Add, **Edit** (inline rename), Delete      |
| **Case Studies**| Add, Delete only          | Add, **Edit** (full form), Delete         |

- **AdminBrands:** Pencil icon opens inline edit; Check saves, X cancels
- **AdminCaseStudies:** "ערוך" button expands the card into an edit form for brand, title, description, metric, and image URL

---

## Admin Panel Logic Summary

| Section        | Add | Edit | Delete | Notes                                      |
|----------------|-----|------|--------|--------------------------------------------|
| Overview       | —   | —    | —      | Read-only dashboard                         |
| Costumes       | —   | —    | —      | Approve/Reject only                         |
| Trivia         | —   | —    | —      | View leaderboard                            |
| Votes          | —   | —    | —      | View results                                |
| Blessings      | ✅  | ✅   | ✅     | Full CRUD                                  |
| Participants   | —   | —    | —      | View only                                   |
| Dictionary     | ✅  | ✅   | ✅     | Full CRUD                                   |
| Admins         | ✅  | —    | ✅     | Add/remove by email; no edit needed         |
| Settings       | —   | ✅   | —      | Config updates                              |
| Media Kit      |     |       |         |                                             |
| — Stats        | —   | ✅   | —      | Edit YouTube, Instagram, TikTok, top videos |
| — Case Studies | ✅  | ✅   | ✅     | Full CRUD (edit added)                      |
| — Brands       | ✅  | ✅   | ✅     | Full CRUD (edit added)                      |

Admin panels that manage Firestore data now support editing where applicable.

---

## UX/UI Observations

### Strengths

- **RTL Support:** Hebrew-first layout with correct `dir="ltr"` for inputs where needed  
- **Design System:** Shared tokens (colors, typography, spacing) in `index.css`  
- **Motion:** AnimateOnScroll and StaggerChildren for landing page reveal  
- **Accessibility:** Semantic headings, ARIA on decorative elements  
- **Responsive:** Mobile-friendly grid breakpoints (`md:grid-cols-*`)

### Suggestions

1. **Confirm Dialogs:** `confirm()` is used for delete actions; consider a reusable `ConfirmModal` for consistency and better UX  
2. **Loading States:** Toast feedback on save is good; consider optimistic updates for faster perceived performance  
3. **Empty States:** Add clear empty-state messaging when lists (brands, case studies) are empty  
4. **Marquee on Small Screens:** On very narrow viewports, brands may scroll quickly; consider reducing speed or showing fewer items

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/pages/admin/media-kit/AdminMediaKitStats.tsx` | Removed EngagementPercentCard |
| `src/pages/admin/media-kit/EngagementPercentCard.tsx` | **Deleted** |
| `src/pages/HomePage.tsx` | Removed engagement stat; stats grid 3 cols; overflow fixes |
| `src/components/ui/Marquee.tsx` | Added `w-full max-w-full` |
| `src/components/layout/RootLayout.tsx` | Added `overflow-x-hidden` |
| `src/pages/admin/AdminBrands.tsx` | Added inline edit (Pencil, Check, X) |
| `src/pages/admin/AdminCaseStudies.tsx` | Added expandable edit form |

---

## Recommendations (Future)

1. **Replace Placeholder Data:** `FALLBACK_CASE_STUDIES` and `FALLBACK_BRANDS` contain sample data; ensure Firestore seeding or manual entry replaces them  
2. **Image Upload:** Case studies use image URLs; consider Firebase Storage for uploads  
3. **Reorder:** Add drag-and-drop reordering for brands and case studies (order field exists in stores)  
4. **Analytics:** Consider adding basic event tracking for contact form submissions and CTA clicks  

---

## Verification Checklist

- [x] אחוז מעורבות removed from HomePage and Admin  
- [x] Brands carousel overflow fixed  
- [x] AdminBrands supports edit  
- [x] AdminCaseStudies supports edit  
- [x] No broken imports after EngagementPercentCard removal  
- [ ] Manual QA: Test edit flow in admin with real data  
- [ ] Manual QA: Verify brands marquee on multiple viewport sizes  

### Testing Plan (Feb 27, 2026)

- [x] Phase A: type-check pass, build pass; lint has 3 errors (see [docs/07-Tests/testing-findings.md](../07-Tests/testing-findings.md))
- [x] Phase B: All public routes load (/, /party, trivia, blessings, dictionary, vote, /live)
- [ ] Phase B2: Image upload (Blessings, Voting) — requires signed-in participant
- [ ] Phase B3: QR visibility (ShareButton, TriviaShareCard) — manual click/share flow
- [x] Phase C/D: Admin accessible via bypass; bypass removed after QA
