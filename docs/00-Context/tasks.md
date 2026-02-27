# משימות

## שלב 1: תשתית ומערכות בסיס
- [x] Setup — React 19 + Vite 7 + Tailwind CSS 4 + RTL + Firebase + Router
- [x] Party Zone shell — layout, nav, module cards
- [x] **UI Component Library** — 14 components
- [x] **Route Config System** — centralized routes.ts, ParticipantContext + Firebase Auth, AdminGuard
- [x] **Animation System** — Motion, AnimateOnScroll, StaggerChildren, PageTransition, hooks

## שלב 2: Homepage
- [x] Homepage Hero — full-bleed image, countdown, CTA, parallax, sparkles
- [x] Homepage Media Kit — stats, brand marquee, case studies, about, contact form, footer
- [ ] **⚠️ החלפת נתוני placeholder** — כל המספרים (עוקבים, אחוזי מעורבות) והקמפיינים הם placeholder. צריך להחליף לנתונים אמיתיים של מרים

## שלב 3: מתחם מסיבה
- [x] טריוויה — 10 שאלות, ניקוד, one-attempt, שיתוף, confetti
- [x] קיר ברכות — טופס inline, masonry, photo upload, relative timestamps
- [x] מילון — 5 מושגים, card-side, stagger animation
- [x] הצבעות — כרטיסי תמונות, results bar chart, confetti

## שלב 3.5: 🔑 מערכת הזדהות משתתפים
- [x] **מסך הזדהות משתתף** — התחברות עם Google. ParticipantGate component.
- [x] **שכבת נתונים (store.ts)** — abstraction layer עם localStorage, מוכן להחלפה ל-Firebase
- [x] **קישור הצבעות למשתתף** — מניעת הצבעה כפולה לפי participantId
- [x] **קישור טריוויה למשתתף** — מניעת ניסיון חוזר לפי participantId
- [x] **לוח מנצחים באדמין** — טאבים: סקירה, טריוויה leaderboard, תוצאות הצבעות, רשימת משתתפים
- [x] **מסך Live מחובר לנתונים** — קורא מ-store במקום hardcoded data

## שלב 4: מסך אירוע + אדמין
- [x] Event Display (/live) — מסך TV אוטומטי, 4 sections auto-rotate
- [x] Admin Panel (/admin) — dashboard with stats + quick-links
- [x] **ניהול אדמינים** — אדמינים יכולים להוסיף ולהסיר אדמינים אחרים (טאב אדמינים)
- [ ] **אדמין CRUD** — ניהול ברכות, שאלות טריוויה, מועמדים להצבעה דרך Firebase

## שלב 5: Firebase Integration
- [x] **Firebase project setup** — פרויקט מוגדר, Authentication + Firestore פעילים
- [x] **חיבור טריוויה ל-Firestore** — שאלות ב-Firestore, Firestore rules, deploy:rules
- [ ] **חיבור קיר ברכות ל-Firebase** — שמירה ב-Firestore, real-time updates
- [ ] **חיבור הצבעות ל-Firebase** — שמירה ב-RTDB, תוצאות real-time
- [ ] **חיבור תוצאות טריוויה ל-Firebase** — leaderboard ב-Firestore (כרגע localStorage)
- [ ] **חיבור טופס יצירת קשר ל-Firebase** — שמירת פניות ב-Firestore

## שלב 6: השקה
- [ ] QA — רספונסיבי, זרימה, עומסים
- [ ] החלפת נתונים אמיתיים (סטטיסטיקות, קמפיינים, שאלות טריוויה)
