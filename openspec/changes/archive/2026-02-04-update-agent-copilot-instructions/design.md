## Context

Agent guidance lives in both `AGENTS.md` and `.github/agents/copilot-instructions.md`. The content overlaps and can drift, which creates ambiguity for contributors and tooling. This change updates and aligns both documents while keeping the scope strictly documentation-only.

## Goals / Non-Goals

**Goals:**
- Align the two instruction documents so they reinforce the same expectations.
- Keep guidance concise, in UK English, with clear sections and predictable phrasing.
- Reduce duplication and drift risk by establishing a clear source of truth.

**Non-Goals:**
- No changes to application code, build tooling, or tests.
- No new dependencies or external tooling.
- No rework of unrelated documentation.

## Decisions

- **Make `AGENTS.md` the primary source of truth, with Copilot instructions aligned to it.**
  - Rationale: `AGENTS.md` is the repo-level agreement and is already the most complete source.
  - Alternative: fully duplicate content in both files. Rejected to reduce drift and maintenance overhead.

- **Keep both documents structured with consistent headings and UK English.**
  - Rationale: Predictable structure improves discoverability and reduces interpretation variance.
  - Alternative: reformat into a single consolidated file or relocate guidance. Rejected to avoid breaking existing tooling expectations.

- **Use small, focused edits to avoid drive-by refactors.**
  - Rationale: Keeps the change reviewable and limits unintended policy shifts.
  - Alternative: broad rewrite of instructions. Rejected as out of scope.

## Risks / Trade-offs

- **Risk:** Summarising guidance in Copilot instructions could omit details. → **Mitigation:** Keep critical rules verbatim and link to `AGENTS.md` for full context.
- **Risk:** Over-prescriptive wording could reduce contributor flexibility. → **Mitigation:** Use concise, neutral phrasing and avoid unnecessary constraints.

## Migration Plan

- Update `AGENTS.md` and `.github/agents/copilot-instructions.md` in the same change.
- Review for conflicts or contradictions before merging.
- No rollout steps required beyond the documentation update.

## Open Questions

- None at this time.
