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

`AGENTS.md` is the primary source of truth for agent guidance. This file must align to it; if there is a conflict, follow `AGENTS.md`.

## Aligned Summary

- Write in English (UK) using concise, active phrasing.
- For non-trivial tasks, start with a short plan (3–6 bullets), then execute.
- Keep changes small and reviewable; avoid drive-by refactors unless asked.
- Avoid `any` unless you justify it in code; follow repo conventions for TypeScript and Next.js.
- Use yarn for scripts and package management; ask before adding production dependencies.
- After changes, run `yarn test` then `yarn lint` when possible.
- Treat secrets as radioactive: use environment variables and update `.env.example` and docs.
- Use Markdown with clear headings; add emoji headings for user-facing notes/docs; wrap file paths in inline code.

For full guidance, see `AGENTS.md`.
<!-- MANUAL ADDITIONS END -->
