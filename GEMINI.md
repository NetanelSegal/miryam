# Gemini CLI - Project Entry Point (Cursor-Optimized)

Welcome to the **Miryam** project. This workspace is optimized for AI-driven development using Cursor and the Gemini CLI.

## Documentation Map

All project documentation is organized in the `docs/` directory. For AI agents, use the following triggers:

- **[00-Context](./docs/00-Context/):** ACTIVE state. Check `tasks.md` for current goals and `progress.md` for history.
- **[01-Discovery](./docs/01-Discovery/index.md):** Project vision and research.
- **[02-Frameworks](./docs/02-Frameworks/index.md):** Tech stack (React 19, Tailwind 4, Firebase).
- **[03-PRDs](./docs/03-PRDs/index.md):** Product Requirements.
- **[04-Architecture](./docs/04-Architecture/index.md):** System design & Firebase rules.
- **[05-Design](./docs/05-Design/index.md):** UI/UX guidelines & Brand Guide.
- **[06-Development](./docs/06-Development/index.md):** Coding standards.
- **[07-Tests](./docs/07-Tests/index.md):** Quality assurance checklists.

## AI Operational Rules (The Cursor System)

We use a **Glob-Triggered Rule System** in `.cursor/rules/`:

1.  **[01-Workflow](./.cursor/rules/01-workflow.mdc)**: Always active (`**/*`). Governs the Research -> Plan -> Approve -> Execute lifecycle.
2.  **[02-Frontend](./.cursor/rules/02-frontend.mdc)**: Triggers on `src/` UI files. Enforces React 19, Tailwind 4, and RTL standards.
3.  **[03-Firebase](./.cursor/rules/03-firebase.mdc)**: Triggers on Firebase configs and rules. Enforces security and data integrity.

## Strategic Workflow
1.  **Read Task**: Check `docs/00-Context/tasks.md`.
2.  **Research**: Use `@docs` to understand the domain.
3.  **Strategy**: Propose subtasks and wait for "Go ahead".
4.  **Execute**: Surgical changes with automated verification.
5.  **Log**: Update `progress.md` after completion.
