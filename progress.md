# Progress

## History
- **Security Audit:** Complete — Firestore rules, Firebase Auth לאדמין (במקום סיסמה), deploy:rules, npm audit
- **ניהול אדמינים:** Complete — טאב אדמינים באדמין פאנל, הוספה והסרה של אדמינים, Firestore rules
- **עיצוב:** מאושר — BRAND-GUIDE.md + design-system.html
- **Setup:** Complete — React 19 + Vite 7.3 + Tailwind CSS 4 + React Router 7 + Firebase SDK + RTL + Rubik/Noto fonts
- **Party Zone Shell:** Complete — layout, nav with back-home, 4 module cards with icons
- **UI Component Library:** Complete — 14 components (Heading, Text, Button, Input, Card, Badge, Modal, Toast, Skeleton, Container, Countdown, StatCard, Marquee, Orbs) with barrel export
- **Route Config System:** Complete — centralized routes.ts, ParticipantContext + Firebase Auth, AdminGuard with Google sign-in + Firestore admins whitelist, config-driven App.tsx and Navbar, lazy-loaded pages with Suspense
- **Animation System:** Complete — Framer Motion (motion package), AnimateOnScroll (6 variants), StaggerChildren, PageTransition, useCountUp hook, useParallax hook, confetti utility, prefers-reduced-motion support
- **Page Refactor:** Complete — all pages use UI components + animations, zero raw HTML elements

## Current Focus
- **הבא:** החלפת נתוני placeholder, אדמין CRUD (ברכות, טריוויה, הצבעות)

## Tech Stack
- React 19.1.0, Vite 7.3.1, Tailwind CSS 4, React Router 7.13
- Firebase (Firestore, Realtime DB, Storage)
- Motion (Framer Motion), TypeScript, ESLint, Lucide React icons

## Architecture
```
src/
├── config/routes.ts          ← single source of truth for all routes
├── contexts/ParticipantContext.tsx ← auth + admin check via Firestore admins
├── components/
│   ├── ui/                   ← 14 design system components
│   ├── motion/               ← animation primitives
│   ├── layout/               ← RootLayout, PartyLayout, Navbar
│   └── guards/               ← AdminGuard
├── hooks/                    ← useCountUp, useParallax, useFileUpload, useRequiredParticipant
├── lib/                      ← firebase.ts, store.ts, trivia-store.ts, admins-store.ts, confetti.ts
└── pages/                    ← all lazy-loaded page components
```
