# Progress

## History
- **Form Hooks (RHF + Zod):** Complete — React Hook Form + Zod + @hookform/resolvers; Input ref as regular prop (React 19, no forwardRef); useContactForm, useBlessingForm, useCostumeUploadForm, useTermForm, useAdminEmailForm; ContactForm, BlessingsContent, VotingGame, TermEditor, AdminAdmins refactored.
- **Component Separation Refactor:** Complete — HomePage, LivePage, TriviaPage, VotingPage, BlessingsPage split into folder structures with focused components; SocialIcons and GoogleIcon extracted; Countdown/TiktokEmbed utils moved to lib (calculateTimeLeft in date.ts, extractTiktokVideoId in utils.ts).
- **Brands Carousel Fix:** Marquee now uses `dir="ltr"` for consistent animation in RTL pages, respects `prefers-reduced-motion`, and uses stable `Brand.id` keys. Fallback brands use full `Brand[]` shape.
- **Firebase Integration:** Complete — Blessings, Votes, Contacts, Trivia Results, Participants, Costumes, Dictionary, Case Studies, Brands, Social Stats (mediaKit) — all Firestore. Storage for images (blessings, costumes, case-studies).
- **Admin CRUD:** Complete — AdminBlessings, AdminTriviaQuestions, AdminDictionary, AdminCostumes (approve/reject), AdminMediaKit (stats, brands, case studies). Vote candidates = approved costumes.
- **Image Upload Tests:** Complete — Vitest + 5 test files for compressImage, uploadBlessingPhoto (blessings), submitCostume (costumes), addCaseStudy (imageUrl), useFileUpload. `npm run test:run`.
- **Security Audit:** Complete — Firestore rules, Firebase Auth לאדמין (במקום סיסמה), deploy:rules, npm audit
- **ניהול אדמינים:** Complete — טאב אדמינים באדמין פאנל, הוספה והסרה של אדמינים, Firestore rules
- **עיצוב:** מאושר — BRAND-GUIDE.md + design-system.html
- **Setup:** Complete — React 19 + Vite 7.3 + Tailwind CSS 4 + React Router 7 + Firebase SDK + RTL + Rubik/Noto fonts
- **Party Zone Shell:** Complete — layout, nav with back-home, 4 module cards with icons
- **UI Component Library:** Complete — 23 components (Heading, Text, Button, Input, Card, Badge, Modal, Toast, Skeleton, Container, Countdown, StatCard, Marquee, Orbs, EmptyState, VoteBar, LeaderboardRow, ShareButton, TiktokEmbed, TriviaShareCard, Spinner, LoadingState, SubTabNav) with barrel export
- **Route Config System:** Complete — centralized routes.ts, ParticipantContext + Firebase Auth, AdminGuard with Google sign-in + Firestore admins whitelist, config-driven App.tsx and Navbar, lazy-loaded pages with Suspense
- **Animation System:** Complete — Framer Motion (motion package), AnimateOnScroll (6 variants), StaggerChildren, PageTransition, useCountUp hook, useParallax hook, confetti utility, prefers-reduced-motion support
- **Page Refactor:** Complete — all pages use UI components + animations, zero raw HTML elements

## Current Focus
- **הבא:** החלפת נתוני placeholder — סטטיסטיקות מדיה (עוקבים, אחוזי מעורבות), מותגים, case studies. Admin Media Kit מאפשר עריכה; צריך להזין נתונים אמיתיים של מרים.

## Tech Stack
- React 19.1.0, Vite 7.3.1, Tailwind CSS 4, React Router 7.13
- Firebase (Firestore, Storage — votes/trivia/blessings/contacts use Firestore, not RTDB)
- Motion (Framer Motion), TypeScript, ESLint, Lucide React icons

## Architecture
```
src/
├── config/routes.ts          ← single source of truth for all routes
├── contexts/ParticipantContext.tsx ← auth + admin check via Firestore admins
├── components/
│   ├── ui/                   ← 23 design system components
│   ├── motion/               ← animation primitives
│   ├── layout/               ← RootLayout, PartyLayout, Navbar
│   └── guards/               ← AdminGuard, ParticipantGate
├── hooks/                    ← useCountUp, useParallax, useFileUpload, useRequiredParticipant, useAsyncAutoRefresh, useAsyncData
├── lib/                      ← firebase.ts, store.ts (facade), *-store.ts (Firestore)
│   ├── blessings-store, votes-store, contacts-store, trivia-results-store
│   ├── trivia-store, dictionary-store, participants-store, costumes-store
│   ├── case-studies-store, brands-store, social-stats-store, admins-store
│   ├── storage-upload, confetti, image, date, utils
│   └── seed.ts               ← seed brands + case studies
├── icons/                    ← GoogleIcon (shared by AdminGuard, ParticipantGate)
└── pages/                    ← all lazy-loaded; page folders (HomePage/, LivePage/, party/TriviaPage/, etc.) with index + section components; admin tabs: overview, costumes, trivia, votes, blessings, participants, dictionary, admins, settings, mediakit
```
