# sharepoint-formatter Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-27

## Active Technologies

- TypeScript (strict), Next.js 16, React, Monaco Editor, AJV, SharePoint v2 JSON schemas (bundled locally) (001-sharepoint-formatter-app)

## Project Structure

```text
app/
tests/
```

## Commands

yarn test && yarn lint

## Code Style

TypeScript (strict) with Next.js 16: Follow standard conventions

## Recent Changes

- 001-sharepoint-formatter-app: Added TypeScript (strict), Next.js 16, React, Monaco Editor, AJV, SharePoint v2 JSON schemas (bundled locally)

<!-- MANUAL ADDITIONS START -->
## Source of Truth

`AGENTS.md` is the primary source of truth for agent guidance. `.github/agents/copilot-instructions.md` must align to this file.

## Working Agreements

- Write in English (UK). Use concise, credible phrasing in active voice.
- For non-trivial tasks, start with a short plan (3–6 bullets), then execute.
- Make small, reviewable diffs. Avoid drive-by refactors unless asked.
- Avoid `any` unless you justify it in code.
- Use yarn for scripts and package management.
- Before adding dependencies, check for existing equivalents and ask before adding production dependencies.
- After changes, run the closest available quality gates using existing scripts.
- Treat secrets as radioactive: never hard-code tokens/keys; use environment variables; update `.env.example` and docs.
- When blocked by missing info, make a reasonable assumption, state it, and continue; ask only when truly blocked.
- When offering choices, include a quick Impact × Effort/Energy rating (H/M/L).

## Output Style

- Prefer Markdown with short sections and clear headings when explaining decisions or writing docs.
- Use emoji headings when producing user-facing notes/docs (not inside code).
- Use inline code for file paths like `apps/web/src/app/page.tsx` and include a line number when helpful.

## TypeScript / Next.js Norms

- Prefer strict typing and narrow types; validate external inputs at boundaries.
- Prefer `const`, pure functions, and predictable side effects.
- Follow the repo’s conventions (App Router vs Pages Router, ESLint/Prettier rules, testing framework).
- Avoid clever abstractions when a direct implementation is clearer.

## Quality Gates

- Default order: `yarn test` then `yarn lint`.
- If scripts don’t exist, add the smallest sensible ones only if asked.

## Safety & Approvals

- Ask before destructive actions (deleting lots of files, rewriting git history, force-push, wiping data, rotating keys).
- Prefer reversible migrations and feature flags when changing behaviour.

## Ops / Process Docs (When Relevant)

- Include: goal, owner/stakeholders, inputs/outputs, edge cases, and definition of done.
- Suggest metrics (accuracy, cycle time, failure rate) and a lightweight adoption plan.
<!-- MANUAL ADDITIONS END -->
