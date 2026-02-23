# משימות

## שלב 1: תשתית ומערכות בסיס
- [x] Setup — React 19 + Vite 7 + Tailwind CSS 4 + RTL + Firebase + Router
- [x] Party Zone shell — layout, nav, module cards
- [x] **UI Component Library** — 14 components
- [x] **Route Config System** — centralized routes.ts, AuthContext, AdminGuard
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

## שלב 3.5: 🔑 מערכת הזדהות משתתפים (חדש!)
מטרה: לזהות משתתפים בפעילויות כדי לדעת מי ניצח בסוף האירוע.
ההזדהות חייבת להיות פשוטה מספיק לילדים.

- [ ] **מסך הזדהות משתתף** — שם + 4 ספרות אחרונות של הטלפון (של ההורה). בלי סיסמה, בלי אימייל.
  - Firebase Anonymous Auth מאחורי הקלעים
  - שמירת פרופיל ב-Firestore (`participants` collection): name, phoneDigits, createdAt
  - Session נשמר ב-sessionStorage — לא צריך להתחבר שוב באותו ביקור
  - מסך הזדהות מופיע פעם אחת לפני הפעילות הראשונה (טריוויה/הצבעות)
- [ ] **קישור הצבעות למשתתף** — כל הצבעה נשמרת עם participantId ב-Firestore
  - מניעת הצבעה כפולה לפי participantId (ולא רק localStorage)
  - שמירה: `votes` collection → { participantId, candidateId, timestamp }
- [ ] **קישור טריוויה למשתתף** — תוצאת הטריוויה נשמרת עם participantId
  - שמירה: `trivia_results` collection → { participantId, nickname, score, timestamp }
  - מניעת ניסיון חוזר לפי participantId (ולא רק localStorage)
- [ ] **לוח מנצחים באדמין** — עמוד אדמין שמציג:
  - טריוויה: דירוג לפי ציון (מי ניצח)
  - הצבעות: תוצאות סופיות (איזו תחפושת ניצחה + כמה הצביעו)
  - רשימת כל המשתתפים

## שלב 4: מסך אירוע + אדמין
- [x] Event Display (/live) — מסך TV אוטומטי, 4 sections auto-rotate
- [x] Admin Panel (/admin) — dashboard with stats + quick-links (Firebase CRUD pending)
- [ ] **אדמין CRUD** — ניהול ברכות, שאלות טריוויה, מועמדים להצבעה דרך Firebase

## שלב 5: Firebase Integration
- [ ] **Firebase project setup** — יצירת פרויקט, הגדרת .env, הפעלת Authentication + Firestore + RTDB
- [ ] **חיבור קיר ברכות ל-Firebase** — שמירה ב-Firestore, real-time updates
- [ ] **חיבור הצבעות ל-Firebase** — שמירה ב-RTDB, תוצאות real-time
- [ ] **חיבור טריוויה ל-Firebase** — שמירת תוצאות, leaderboard
- [ ] **חיבור טופס יצירת קשר ל-Firebase** — שמירת פניות ב-Firestore

## שלב 6: השקה
- [ ] QA — רספונסיבי, זרימה, עומסים
- [ ] החלפת נתונים אמיתיים (סטטיסטיקות, קמפיינים, שאלות טריוויה)
