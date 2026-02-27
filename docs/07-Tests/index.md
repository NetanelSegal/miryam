# 07 Tests

## Testing & Validation Strategy

A task is not complete until it is verified. We follow a "Validation First" approach.

### 1. Automated Testing (Baseline)
- **Type Checking**: Every build MUST pass `npm run type-check`.
- **Linting**: No ESLint errors allowed in new code.
- **Unit Tests**: Logic in `src/lib/` or `src/hooks/` should have corresponding unit tests where applicable.

### 2. Manual QA Checklist (MANDATORY)
For every UI/Feature change, the AI must verify:
- **Responsive Audit**: Test at 375px (Mobile), 768px (Tablet), and 1440px (Desktop).
- **RTL Integrity**: Ensure Hebrew text alignment, icon mirroring, and layout flow are correct.
- **Interactive States**: Verify Hover, Active, Disabled, and Loading states for all interactive elements.
- **Accessibility (A11y)**: Check ARIA labels and keyboard navigation for new components.

### 3. Bug Reproduction
- For every bug fix, the AI MUST first document the steps to reproduce the bug.
- The fix is only valid if the reproduction steps no longer trigger the error.

### 4. Visual Proof
- For UI tasks, the AI must provide a textual description of the visual result in `docs/00-Context/progress.md`.
