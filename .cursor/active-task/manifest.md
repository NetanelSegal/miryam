# Active Task: Blessings, Live, Share Fixes

## Subtasks

1. **[Fix]** Blessings content not updating after add
2. **[Feat]** Live page: clickable prev/next to skip screens
3. **[Feat]** Share-to-story for trivia + blessings (nice design)

## Contracts

- Blessings: `subscribeToBlessings` + refetch on success for reliability
- Live: `activeIndex` state, dots + prev/next buttons clickable
- Share: `BlessingShareCard` + `BlessingShareModal` (mirror TriviaShareModal pattern)
