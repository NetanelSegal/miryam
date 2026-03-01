# משימות

## שלב 1: תשתית ומערכות בסיס
- [x] Setup — React 19 + Vite 7 + Tailwind CSS 4 + RTL + Firebase + Router
- [x] Party Zone shell — layout, nav, module cards
- [x] **UI Component Library** — 23 components
- [x] **Route Config System** — centralized routes.ts, ParticipantContext + Firebase Auth, AdminGuard
- [x] **Animation System** — Motion, AnimateOnScroll, StaggerChildren, PageTransition, hooks

## שלב 2: Homepage
- [x] Homepage Hero — full-bleed image, countdown, CTA, parallax, sparkles
- [x] Homepage Media Kit — stats, brand marquee, case studies, about, contact form, footer
- [ ] **⚠️ החלפת נתוני placeholder** — סטטיסטיקות (עוקבים, אחוזי מעורבות), מותגים, case studies — Admin Media Kit מאפשר עריכה; צריך להזין נתונים אמיתיים של מרים

## שלב 3: מתחם מסיבה
- [x] טריוויה — 10 שאלות, ניקוד, one-attempt, שיתוף, confetti
- [x] קיר ברכות — טופס inline, masonry, photo upload, relative timestamps
- [x] מילון — 5 מושגים, card-side, stagger animation
- [x] הצבעות — כרטיסי תמונות, results bar chart, confetti

## שלב 3.5: 🔑 מערכת הזדהות משתתפים
- [x] **מסך הזדהות משתתף** — התחברות עם Google. ParticipantGate component.
- [x] **שכבת נתונים (store.ts)** — Firebase as SSOT. כל ה-stores מחוברים ל-Firestore.
- [x] **קישור הצבעות למשתתף** — מניעת הצבעה כפולה לפי participantId
- [x] **קישור טריוויה למשתתף** — מניעת ניסיון חוזר לפי participantId
- [x] **לוח מנצחים באדמין** — טאבים: סקירה, טריוויה leaderboard, תוצאות הצבעות, רשימת משתתפים
- [x] **מסך Live מחובר לנתונים** — קורא מ-store (Firebase)

## שלב 4: מסך אירוע + אדמין
- [x] Event Display (/live) — מסך TV אוטומטי, 4 sections auto-rotate
- [x] Admin Panel (/admin) — dashboard with stats + quick-links
- [x] **ניהול אדמינים** — אדמינים יכולים להוסיף ולהסיר אדמינים אחרים (טאב אדמינים)
- [x] **אדמין CRUD** — ברכות (AdminBlessings), שאלות טריוויה (AdminTriviaQuestions), מילון (AdminDictionary), תחפושות (AdminCostumes approve/reject), Media Kit (סטטיסטיקות, מותגים, case studies). מועמדים להצבעה = תחפושות מאושרות.

## שלב 5: Firebase Integration
- [x] **Firebase project setup** — פרויקט מוגדר, Authentication + Firestore + Storage פעילים
- [x] **חיבור טריוויה ל-Firestore** — שאלות ב-Firestore, Firestore rules, deploy:rules
- [x] **חיבור קיר ברכות ל-Firebase** — שמירה ב-Firestore, subscribeToBlessings real-time
- [x] **חיבור הצבעות ל-Firebase** — שמירה ב-Firestore (votes collection)
- [x] **חיבור תוצאות טריוויה ל-Firebase** — triviaResults ב-Firestore
- [x] **חיבור טופס יצירת קשר ל-Firebase** — contacts ב-Firestore
- [x] **חיבור Media Kit** — socialStats, brands, caseStudies ב-Firestore; Storage לתמונות

## שלב 6: השקה
- [ ] QA — רספונסיבי, זרימה, עומסים
- [ ] החלפת נתונים אמיתיים (סטטיסטיקות, קמפיינים, שאלות טריוויה) — דרך Admin Media Kit
