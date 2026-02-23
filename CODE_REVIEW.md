# Code Review — miryam-segal-website

> Reviewed: Feb 23, 2026  
> Scope: Anti-patterns, potential bugs, DRY/component extraction opportunities

---

## CRITICAL BUGS

### 1. BlessingsPage doesn't persist data (data loss)

**File:** `src/pages/party/BlessingsPage.tsx`

The page defines its own local `Blessing` interface (with `timestamp: Date`) that shadows the one in `store.ts` (which uses `timestamp: number`). Blessings are stored in React state only — `store.saveBlessing()` and `store.getAllBlessings()` are never called. Every blessing is **lost on page refresh**, and the LivePage's `BlessingsSection` shows nothing because it reads from the store.

**Fix:** Remove the local interface, import from store, call `store.saveBlessing()` on submit, and seed `useState` from `store.getAllBlessings()`.

---

### 2. ContactForm doesn't save submissions (data loss)

**File:** `src/pages/HomePage.tsx` — `ContactForm` (line ~93-101)

The form handler does `console.log('Contact form:', formData)` and shows a success toast, but never calls `store.saveContact()`. Submissions are discarded.

**Fix:** Call `store.saveContact(formData)` inside `handleSubmit`.

---

### 3. localStorage as data store makes multi-user features non-functional

**Files:** `src/lib/store.ts`, all party pages

The app uses Firebase Auth (a cloud service) for identity but localStorage (browser-local) for data. This creates a fundamental architectural mismatch:

- Participant A's votes/blessings/trivia results are invisible to Participant B
- The LivePage (meant for a projected screen) shows empty data because it has its own localStorage
- The AdminPage only sees data from the admin's own browser

Firebase Firestore/RTDB are already initialized in `lib/firebase.ts` but never used for data.

**Fix:** Migrate `store.ts` to use Firestore or Realtime Database. The store's function signatures can remain the same (just swap the implementation from `localStorage` to Firebase calls and make them async).

---

### 4. Base64 images stored in localStorage — will hit 5MB limit

**Files:** `src/lib/store.ts`, `src/pages/party/VotingPage.tsx`

Costume images are compressed to 800×800 at 70% quality, then stored as base64 data URLs in localStorage. Each image is ~50–200KB as base64. The localStorage limit is ~5MB across all keys. After 10–25 costumes, the app will throw `QuotaExceededError` and silently fail.

**Fix:** Store images in Firebase Storage (already initialized) and save the download URL in the data store instead of the raw base64.

---

### 5. Admin password exposed in client bundle

**File:** `src/contexts/AuthContext.tsx` (line 30)

`import.meta.env.VITE_ADMIN_PASSWORD` is embedded in the production JavaScript bundle. Anyone can extract it from browser DevTools → Sources/Network.

**Fix:** Move admin authentication server-side (Firebase Custom Claims, or a Cloud Function that validates the password and returns a custom token).

---

## POTENTIAL BUGS

### 6. Non-null assertions on `participant` — runtime crash risk

**Files:** `src/pages/party/TriviaPage.tsx` (lines 35–36), `src/pages/party/VotingPage.tsx` (lines 16–17)

```ts
const participantId = participant!.id
const participantName = participant!.name
```

These rely on `ParticipantGate` always wrapping the component. If someone refactors the component tree or renders `TriviaGame` directly, it crashes with a null dereference.

**Fix:** Add an early guard: `if (!participant) return null` — or create a `useRequiredParticipant()` hook that throws a descriptive error.

---

### 7. Double state update in ParticipantContext

**File:** `src/contexts/ParticipantContext.tsx` (lines 54 vs 38–46)

`signInWithGoogle` calls `setParticipant(p)` explicitly (line 54), but `onAuthStateChanged` (line 38) also fires and sets the same participant. This causes two renders with the same state. Not a crash, but unnecessary work.

**Fix:** Remove the manual `setParticipant` from `signInWithGoogle` — let `onAuthStateChanged` be the single source of truth.

---

### 8. No cleanup for `setTimeout` in TriviaPage

**File:** `src/pages/party/TriviaPage.tsx` (line 78, line 101)

`handleAnswer` schedules a `setTimeout(…, 1500)` and `handleShare` schedules one at 2000ms. If the component unmounts during that window (e.g., user navigates away), the callback fires on an unmounted component.

**Fix:** Store the timeout ID in a ref and clear it in a cleanup `useEffect`, or use `useRef` to track mounted state.

---

### 9. Duplicate trivia submissions possible at the store level

**File:** `src/lib/store.ts` — `saveTriviaResult` (line 111)

The function pushes a new result without checking if the participant already has one. The UI prevents replays via `getTriviaResult(participantId)`, but a direct `store.saveTriviaResult()` call (or a race condition) can produce duplicates.

**Fix:** Add an idempotency check inside `saveTriviaResult`.

---

### 10. `getStats()` parses costumes JSON twice

**File:** `src/lib/store.ts` (lines 230–231)

```ts
totalCostumes: getList<CostumeEntry>(KEYS.costumes).length,
pendingCostumes: getList<CostumeEntry>(KEYS.costumes).filter(c => c.status === 'pending').length,
```

`getList` parses JSON from localStorage on every call. `KEYS.costumes` is parsed twice here.

**Fix:** Cache the result in a local variable:

```ts
const costumes = getList<CostumeEntry>(KEYS.costumes)
return {
  // …
  totalCostumes: costumes.length,
  pendingCostumes: costumes.filter(c => c.status === 'pending').length,
}
```

---

### 11. AdminPage filters rejected costumes 3 times in one render

**File:** `src/pages/AdminPage.tsx` (lines 224, 228, 230)

```ts
allCostumes.filter(c => c.status === 'rejected').length > 0     // line 224
allCostumes.filter(c => c.status === 'rejected').length          // line 228
allCostumes.filter(c => c.status === 'rejected').map(...)        // line 230
```

**Fix:** Compute `rejectedCostumes` once via `useMemo` (or a plain variable inside the render).

---

### 12. No error boundary for lazy-loaded routes

**File:** `src/App.tsx`

Routes use `lazy()` + `Suspense` but there's no `ErrorBoundary`. If a chunk fails to load (network issue), the app shows a blank screen with no recovery path.

**Fix:** Wrap routes in a React Error Boundary with a retry button.

---

### 13. `useMemo` with wrong dependency for `existingVote`

**File:** `src/pages/party/VotingPage.tsx` (line 22)

```ts
const existingVote = useMemo(() => store.getVote(pid), [pid])
```

This only recomputes when `pid` changes, but the user may vote during the session. After voting (line 76), the `hasVoted` flag is set manually, but `existingVote` remains stale. It works because `votedFor` is set separately — but it's misleading. If any logic ever depends on `existingVote` being current, it'll be wrong.

---

## ANTI-PATTERNS

### 14. AdminPage is a 356-line monolith

**File:** `src/pages/AdminPage.tsx`

One component with 7 state variables, a refresh interval, and 5 tab panels inline. Each tab panel should be its own component (e.g., `AdminOverview`, `AdminCostumes`, `AdminTrivia`, `AdminVotes`, `AdminParticipants`).

---

### 15. AdminGuard doesn't use the design system

**File:** `src/components/guards/AdminGuard.tsx`

Uses raw `<input>`, `<button>`, `<h1>`, and `<p>` with inline Tailwind, while the rest of the app has `Button`, `Input`, `Heading`, `Text` components.

**Fix:** Use `Heading`, `Input`, `Button`, `Text` from `@/components/ui`.

---

### 16. Hardcoded gradient appears 6+ times

**Files:** VotingPage (L214, L249), AdminPage (L298, L41), LivePage (L52), AdminGuard (L41)

```
bg-gradient-to-l from-[#6366f1] to-[#a855f7]
```

**Fix:** Define a single Tailwind utility class (e.g., `bg-gradient-brand`) in `index.css` or use the existing `gradient-text` pattern.

---

### 17. Medal color logic duplicated

**Files:** AdminPage (L258–259), LivePage (L102–103), AdminPage overview (L116)

```ts
i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-text-muted'
```

This same rank-color mapping exists in 3 places.

**Fix:** Extract a `getRankColor(index: number)` utility or a `<RankBadge>` component.

---

### 18. Date formatting scattered inline

**Files:** AdminPage (L264, L339)

```ts
new Date(r.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
new Date(p.createdAt).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
```

**Fix:** Create `formatTime()` and `formatDateTime()` utilities in a `lib/date.ts` file.

---

## DRY — EXTRACT COMPONENTS

### 19. `<EmptyState icon={} message="" />` component

This pattern repeats 6+ times across AdminPage, VotingPage, and LivePage:

```tsx
<Card variant="accent" className="p-8 text-center">
  <Icon className="w-12 h-12 text-text-muted mx-auto mb-3" />
  <Text variant="muted">message</Text>
</Card>
```

---

### 20. `<VoteBar>` component

The animated gradient progress bar for vote counts is implemented 3 separate times with minor size variations:

| File | Lines |
|------|-------|
| `VotingPage.tsx` | 247–257 |
| `AdminPage.tsx` | 296–304 |
| `LivePage.tsx` | 51–55 |

**Proposed API:**

```tsx
<VoteBar votes={count} maxVotes={max} size="sm" | "md" | "lg" />
```

---

### 21. `<CostumeCard>` component

The costume thumbnail pattern (image + title + participantName) appears in:
- VotingPage: voting grid cards (L202–224)
- VotingPage: "my costume" display (L167–184)
- AdminPage: pending review cards (L163–194)
- AdminPage: approved grid (L206–217)
- AdminPage: rejected grid (L229–241)
- LivePage: vote results (L42–57)

---

### 22. `<LeaderboardRow>` component

Trivia leaderboard rows with rank colors appear in:
- AdminPage overview (L113–123)
- AdminPage trivia tab (L253–266)
- LivePage (L96–108)

---

## DRY — EXTRACT HOOKS

### 23. `useFileUpload()` hook

VotingPage and BlessingsPage share the same file upload pattern:

```ts
const fileInputRef = useRef<HTMLInputElement>(null)
const [preview, setPreview] = useState<string | null>(null)
const [selectedFile, setSelectedFile] = useState<File | null>(null)

function handleFileChange(e) { /* FileReader → setPreview */ }
function clearFile() { /* reset state + input */ }
```

**Proposed API:**

```ts
const { fileInputRef, preview, selectedFile, handleFileChange, clearFile } = useFileUpload()
```

---

### 24. `useStoreData()` or `useAutoRefresh()` hook

AdminPage and LivePage both follow this pattern:

```ts
const [data, setData] = useState(store.getSomething())
const refreshData = useCallback(() => {
  setData(store.getSomething())
  // … repeat for each piece of data
}, [])
useEffect(() => {
  const interval = setInterval(refreshData, N)
  return () => clearInterval(interval)
}, [refreshData])
```

**Proposed API:**

```ts
const stats = useAutoRefresh(() => store.getStats(), 5000)
```

---

### 25. `useRequiredParticipant()` hook

Instead of `participant!.id` scattered in pages wrapped by `ParticipantGate`:

```ts
function useRequiredParticipant() {
  const { participant } = useParticipant()
  if (!participant) throw new Error('Component must be rendered inside ParticipantGate')
  return participant  // typed as Participant (not Participant | null)
}
```

---

## MINOR IMPROVEMENTS

### 26. `RootLayout` and `PartyLayout` are nearly identical

**Files:** `src/components/layout/RootLayout.tsx`, `src/components/layout/PartyLayout.tsx`

The only differences are: `PartyLayout` passes `showBackHome` to Navbar, adds `relative` and `pt-[65px]` classes, and uses `variant="party"` on Orbs. These could be a single `<AppLayout>` component with props.

---

### 27. Route helper functions in `routes.ts` are unused

`getRoutesByLayout()` and `getRouteByPath()` (lines 111–117) are exported but never imported anywhere. `App.tsx` filters routes inline.

---

### 28. `UserRole` type 'user' is never used

**File:** `src/contexts/AuthContext.tsx` (line 3)

`type UserRole = 'guest' | 'user' | 'admin'` — the `'user'` variant is never assigned or checked anywhere.

---

### 29. Missing `<title>` / document head management

Route configs have `title` and `meta` fields, but they're never applied to the document. There's no `document.title` update or `<Helmet>` equivalent.

---

### 30. `useParallax` scroll listener has no throttle

**File:** `src/hooks/useParallax.ts`

The scroll event handler fires on every pixel of scroll without throttle/debounce, which can cause jank on lower-end devices.

**Fix:** Use `requestAnimationFrame` throttling or `passive: true` at minimum.

---

## SUMMARY TABLE

| # | Severity | Category | Description |
|---|----------|----------|-------------|
| 1 | CRITICAL | Bug | BlessingsPage data not persisted |
| 2 | CRITICAL | Bug | ContactForm data not persisted |
| 3 | CRITICAL | Architecture | localStorage can't work multi-user |
| 4 | HIGH | Bug | Base64 images will exceed localStorage limit |
| 5 | HIGH | Security | Admin password in client bundle |
| 6 | MEDIUM | Bug | Non-null assertions on participant |
| 7 | LOW | Performance | Double state update in ParticipantContext |
| 8 | MEDIUM | Bug | No setTimeout cleanup in TriviaPage |
| 9 | LOW | Bug | Duplicate trivia submissions possible |
| 10 | LOW | Performance | getStats() parses JSON redundantly |
| 11 | LOW | Performance | Rejected costumes filtered 3x |
| 12 | MEDIUM | Reliability | No error boundary |
| 13 | LOW | Bug | Stale useMemo for existingVote |
| 14 | MEDIUM | Anti-pattern | AdminPage monolith (356 lines) |
| 15 | LOW | Anti-pattern | AdminGuard doesn't use design system |
| 16 | LOW | DRY | Hardcoded gradient string |
| 17 | LOW | DRY | Medal color logic duplicated |
| 18 | LOW | DRY | Date formatting inline |
| 19 | LOW | DRY | EmptyState component needed |
| 20 | MEDIUM | DRY | VoteBar duplicated 3x |
| 21 | MEDIUM | DRY | CostumeCard duplicated 5x |
| 22 | LOW | DRY | LeaderboardRow duplicated 3x |
| 23 | MEDIUM | DRY | File upload logic duplicated |
| 24 | MEDIUM | DRY | Auto-refresh pattern duplicated |
| 25 | MEDIUM | DRY | useRequiredParticipant hook |
| 26 | LOW | DRY | Two nearly identical layout components |
| 27 | LOW | Dead code | Unused route helper functions |
| 28 | LOW | Dead code | Unused 'user' role variant |
| 29 | MEDIUM | Feature gap | No document title management |
| 30 | LOW | Performance | Scroll listener without throttle |
