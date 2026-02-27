# 06 Development

## Git & Collaboration Strategy (STRICT)

### 1. The "Main is Protected" Mandate
- **NEVER** commit directly to `main`.
- **NEVER** attempt to merge a feature branch into `main`.
- The AI's responsibility ends at pushing a feature branch. Final review and merging are handled EXCLUSIVELY by the human user.

### 2. Branching Protocol
- Every task, feature, or bug fix MUST have its own branch.
- **Naming Convention:** `feature/[task-slug]` or `fix/[bug-description]`.
- Branches must be created FROM `main` after a fresh `git pull`.

### 3. Commit Standards
- **Conventional Commits**: Use `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- **Atomic Commits**: One logical change per commit.
- **The "Why" Rule**: Commit messages must explain the technical rationale, especially for complex architectural changes.

---

## Coding Standards
- **Component Driven**: Use `src/components/ui/` for all UI elements.
- **Type Safety**: No `any`. Use strict TypeScript interfaces.
- **Performance**: Follow the optimization rules in `02-frontend.mdc`.
