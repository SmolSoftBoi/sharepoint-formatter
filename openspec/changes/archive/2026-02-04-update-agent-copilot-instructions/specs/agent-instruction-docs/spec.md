## ADDED Requirements

### Requirement: Aligned agent instruction sources
The repository MUST provide aligned guidance between `AGENTS.md` and `.github/agents/copilot-instructions.md`, ensuring they do not conflict on core working agreements, output style, and repo-specific norms.

#### Scenario: Guidance alignment
- **WHEN** a contributor reads both documents
- **THEN** the guidance on working agreements, output style, and repo-specific norms is consistent and non-contradictory

### Requirement: Clear source-of-truth hierarchy
The repository MUST state that `AGENTS.md` is the primary source of truth, with `.github/agents/copilot-instructions.md` aligned to it.

#### Scenario: Source-of-truth clarity
- **WHEN** a contributor consults the instructions
- **THEN** they can identify `AGENTS.md` as the primary source of truth

### Requirement: Consistent language and structure
The two instruction documents MUST use UK English and a consistent, predictable structure for headings and guidance sections.

#### Scenario: Language and structure consistency
- **WHEN** a contributor scans both documents
- **THEN** they observe UK English and a consistent section structure
