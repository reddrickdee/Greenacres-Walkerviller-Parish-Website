# Skills Usage Instructions

These instructions govern how to activate and use skills in `.agents/skills/` and `.agent/skills/`. Each skill has a `SKILL.md` with YAML frontmatter (name, description) and markdown instructions, plus optional scripts, references, and assets.

<mandatory_rules>
These rules are non-negotiable and override all other guidance in this file.

**Rule 1 — Always scan for relevant skills first.** Before beginning any task, scan the installed skills in `.agents/skills/` and `.agent/skills/` to identify which existing skills are relevant to the work. If no installed skill covers the domain or task, run `find-skills` to search the open skills ecosystem (`npx skills find [query]`). You have full permission to install any discovered skill into this repository using `npx skills add <package> -y`. Never proceed with work that a skill could improve without first checking whether that skill exists.

**Rule 2 — Brainstorming is the central planning gate.** For any task that involves creating features, building components, adding functionality, designing systems, or modifying behavior, `brainstorming` must run first. It is the mandatory entry point for all creative and implementation work. No code, no design, no implementation of any kind may begin until `brainstorming` has completed its full workflow and the user has approved the resulting design. This applies regardless of how simple the task appears.

**Rule 3 — Use skills only when genuinely needed.** Skills are powerful tools, not decorations. Activate a skill only when the task genuinely falls within that skill's scope and the skill will materially improve the quality or correctness of the output. Do not activate skills indiscriminately, stack them unnecessarily, or invoke them as a formality. Each activation must be justified by the actual requirements of the task at hand.
</mandatory_rules>

<read_skill_before_use>
Before invoking any skill, read its full SKILL.md using view_file. It contains the workflow, constraints, hard gates, and output formats. Do not assume you know a skill's process — skills contain mandatory checkpoints and anti-patterns only visible from a full read. Use bundled scripts/ and references/ as directed.
</read_skill_before_use>

## Directory Layout

- **`.agents/skills/`** — 44 skills: backend, testing, security, coding standards, databases, deployment, language-specific patterns
- **`.agent/skills/`** — 20 unique skills: creative work, document generation, UI/UX design, media creation. Also symlinks to all `.agents/` skills, making it the single comprehensive access point

## Activation Guide

<skill_activation_guide>
Activate skills based on what the task requires, not only what the user names explicitly.

### Pre-Implementation Planning

| Skill | When to Activate |
|-------|-----------------|
| `brainstorming` | Before any creative work. Asks questions, proposes 2–3 approaches, presents design for approval. **No code until approved.** |
| `doc-coauthoring` | Co-authoring documentation, proposals, specs. 3-stage: context → refinement → reader testing. |
| `strategic-compact` | Long sessions needing context preservation across compaction. |

### Frontend, UI/UX, and Design

| Skill | When to Activate |
|-------|-----------------|
| `frontend-design` | Building any web UI. Mandates bold aesthetics, rejects generic AI patterns. Distinctive typography, color, and motion. |
| `frontend-patterns` | React/Next.js component architecture, state management, data fetching, performance. |
| `ui-ux-pro-max` | Design system generation via Python CLI — 50+ styles, 97 palettes, 57 font pairings, 9 stacks. Run `--design-system` first. |
| `web-artifacts-builder` | Multi-component claude.ai HTML artifacts needing state management, routing, or shadcn/ui. |
| `web-design-guidelines` | Auditing UI code against Vercel's Web Interface Guidelines. |
| `webapp-testing` | Testing local web apps with Python Playwright scripts and server lifecycle management. |
| `theme-factory` | Applying professional themes (10 presets or custom) to slides, docs, reports, HTML. |
| `brand-guidelines` | Applying Anthropic brand colors and fonts (Poppins/Lora) to artifacts. |
| `canvas-design` | Creating high-art static visuals (PNG/PDF) — philosophy-first, spatial expression, multi-page. |

### Backend and Architecture

| Skill | When to Activate |
|-------|-----------------|
| `api-design` | REST API design — resource naming, status codes, pagination, filtering, versioning. |
| `backend-patterns` | Node.js/Express/Next.js API routes — architecture, optimization, best practices. |
| `django-patterns` | Django architecture — DRF APIs, ORM, caching, signals, middleware. |
| `springboot-patterns` | Spring Boot — REST APIs, layered services, data access, caching, async. |
| `golang-patterns` | Idiomatic Go patterns and conventions. |
| `docker-patterns` | Docker/Compose — local dev, security, networking, multi-service orchestration. |
| `deployment-patterns` | CI/CD pipelines, containerization, health checks, rollbacks, production readiness. |
| `mcp-builder` | Building MCP servers for LLM-to-service integration. TypeScript/Python. |

### Database

| Skill | When to Activate |
|-------|-----------------|
| `postgres-patterns` | PostgreSQL query optimization, schema design, indexing, security. |
| `clickhouse-io` | ClickHouse analytics and query optimization. |
| `database-migrations` | Schema changes, data migrations, rollbacks, zero-downtime across ORMs. |
| `jpa-patterns` | JPA/Hibernate entity design, relationships, transactions in Spring Boot. |
| `content-hash-cache-pattern` | Caching file processing via SHA-256 content hashes. |

### Testing and Verification

| Skill | When to Activate |
|-------|-----------------|
| `tdd-workflow` | Writing features, fixing bugs, or refactoring. Tests-first, 80%+ coverage. |
| `verification-loop` | After features or before PRs. 6 phases → structured PASS/FAIL report. |
| `e2e-testing` | Playwright E2E — Page Object Model, CI/CD, flaky test strategies. |
| `python-testing` | pytest — TDD, fixtures, mocking, parametrization, coverage. |
| `golang-testing` | Go table-driven tests, subtests, benchmarks, fuzzing. |
| `cpp-testing` | C++ GoogleTest/CTest, flaky diagnosis, coverage, sanitizers. |
| `django-tdd` | Django pytest-django, factory_boy, mocking, DRF API testing. |
| `django-verification` | Django verification — migrations, lint, tests, security, readiness. |
| `springboot-tdd` | Spring Boot TDD — JUnit 5, Mockito, MockMvc, Testcontainers. |
| `springboot-verification` | Spring Boot verification — build, analysis, tests, security, diff. |
| `eval-harness` | Formal evaluation framework for eval-driven development. |

### Coding Standards and Security

| Skill | When to Activate |
|-------|-----------------|
| `coding-standards` | TypeScript/JavaScript/React/Node.js standards and patterns. |
| `python-patterns` | Pythonic idioms, PEP 8, type hints. |
| `java-coding-standards` | Java 17+ for Spring Boot — naming, immutability, streams, generics. |
| `cpp-coding-standards` | C++ Core Guidelines — modern, safe, idiomatic. |
| `security-review` | Security audit — auth, input handling, secrets, APIs, payments. |
| `security-scan` | Scan Claude Code config (.claude/) for vulnerabilities. |
| `django-security` | Django CSRF, SQL injection, XSS prevention, secure deployment. |
| `springboot-security` | Spring Security — authn/authz, validation, CSRF, secrets. |

### Document and Media Generation

| Skill | When to Activate |
|-------|-----------------|
| `docx` | Word documents — create (docx-js), edit (XML unpack/edit/repack). Trigger on ".docx" or "Word doc". |
| `pdf` | PDF files — read, merge, split, rotate, watermark, create, form fill, encrypt, OCR. |
| `pptx` | PowerPoint — create (pptxgenjs), edit (unpack/pack), verify visually. |
| `xlsx` | Spreadsheets — .xlsx/.xlsm/.csv/.tsv. Mandates Excel formulas over hardcoded values. |
| `slack-gif-creator` | Animated GIFs for Slack — PIL-based, 128×128 emoji, 480×480 messages. |
| `algorithmic-art` | Generative art with p5.js — philosophy-first, seeded randomness, interactive. |
| `remotion-best-practices` | Remotion video creation in React — 25+ rule files. |
| `nutrient-document-processing` | Nutrient DWS API — conversion, OCR, extraction, redaction, signatures. |
| `internal-comms` | Internal comms — 3P updates, newsletters, FAQs, reports. |

### Specialized Utilities

| Skill | When to Activate |
|-------|-----------------|
| `cost-aware-llm-pipeline` | LLM API cost optimization — model routing, budget tracking, prompt caching. |
| `regex-vs-llm-structured-text` | Choosing regex vs LLM for parsing structured text. |
| `iterative-retrieval` | Progressive context retrieval for multi-agent workflows. |
| `swift-actor-persistence` | Swift actors for thread-safe persistence. |
| `swift-protocol-di-testing` | Swift protocol-based DI for deterministic testing. |
| `continuous-learning` | Extract reusable patterns from sessions as learned skills. |
| `continuous-learning-v2` | Instinct-based learning via hooks with confidence scoring. |
| `find-skills` | Discover and install skills from the ecosystem. Run `npx skills find [query]`. |
| `skill-creator` | Create or update skills — anatomy, progressive disclosure, 6-step process. |
| `configure-ecc` | Install Everything Claude Code — interactive installer. |
| `project-guidelines-example` | Template for project-specific skill definitions. |
</skill_activation_guide>

## Usage Workflow

<skill_usage_workflow>
1. **Scan for relevant skills** — check installed skills and run `find-skills` if no match exists. Install any useful skill found.
2. **Run brainstorming first** — if the task involves creating, building, designing, or modifying anything, `brainstorming` must complete with user approval before proceeding.
3. **Read the full SKILL.md** — even for previously used skills.
4. **Follow the documented workflow** — execute steps in order as specified. Do not skip or reorder.
5. **Use bundled resources** — run scripts via `--help` first; load references only when SKILL.md directs.
6. **Match output format** — produce verification reports, design docs, test results in the exact format specified.
</skill_usage_workflow>

## Combining Skills

<skill_composition_patterns>
Execute in order, completing each skill's workflow before starting the next:

- **New feature**: `brainstorming` → `frontend-design`/`backend-patterns` → `tdd-workflow` → `verification-loop`
- **UI work**: `ui-ux-pro-max` → `frontend-design` → `webapp-testing`
- **Backend API**: `api-design` → framework skill → `tdd-workflow` → `security-review`
- **Database changes**: `database-migrations` → `postgres-patterns`/`clickhouse-io` → `verification-loop`
- **Documents**: `brainstorming` → `docx`/`pdf`/`pptx`/`xlsx` → `theme-factory`
- **Spring Boot**: `springboot-patterns` → `springboot-tdd` → `springboot-security` → `springboot-verification`
- **Django**: `django-patterns` → `django-tdd` → `django-security` → `django-verification`
</skill_composition_patterns>

## Constraints

<skill_constraints>
- **Always scan first**: Before any task, check installed skills for relevance. If nothing matches, run `find-skills` to search and install. Full permission to install skills into this repository.
- **Brainstorming gates all creative work**: Must complete with user approval before any implementation begins. No exceptions.
- **Use only what is needed**: Activate skills only when genuinely required. Do not stack or invoke as formality.
- **Match skill to output format**: `docx` for Word, `pdf` for PDF, `xlsx` for spreadsheets, `pptx` for PowerPoint.
- **Verification is mandatory**: After significant code changes, run `verification-loop` or framework-specific equivalent.
- **Respect hard gates**: "Do NOT proceed until approved" checkpoints cannot be bypassed.
</skill_constraints>
