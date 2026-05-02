---
name: gstack-code-review
description: |
  Pre-landing code review checklist adapted from GStack's /review skill.
  Two-pass review: CRITICAL (SQL safety, race conditions, XSS, enum completeness)
  then INFORMATIONAL (async mixing, type coercion, view/frontend, completeness gaps).
  Auto-fixes mechanical issues, asks about ambiguous ones. Use when asked to "review
  this PR", "code review", "check my diff", or before merging any branch.
---

# Pre-Landing Code Review

Adapted from [GStack](https://github.com/garrytan/gstack) `/review` and `review/checklist.md` by Garry Tan. MIT Licensed.

Analyze the current branch's diff for structural issues that tests don't catch.

## Workflow

1. Check you're on a feature branch with changes against main
2. Get the full diff: `git diff origin/main`
3. Run Pass 1 (CRITICAL) then Pass 2 (INFORMATIONAL)
4. If frontend files are touched, run the Design Quality check from `gstack-design-quality`
5. Apply Fix-First Review: auto-fix mechanical issues, batch-ask ambiguous ones
6. Check documentation staleness

---

## Pass 1 — CRITICAL

### Race Conditions & Concurrency
- Read-check-write without uniqueness constraint
- Status transitions without atomic WHERE conditions
- React state updates that depend on stale closures

### XSS Prevention (React-specific)
- `dangerouslySetInnerHTML` on user-controlled data
- Dynamic `href` or `src` attributes with user input
- Supabase query results rendered without proper escaping

### Enum & Value Completeness
When the diff introduces a new value, status, type, or route:
- **Trace it through every consumer.** Read each file that switches on, filters by, or displays that value
- **Check switch/if-else chains.** Does the new value fall through to a wrong default?
- **Check arrays/constants.** Are sibling value lists updated everywhere?

### Supabase Query Safety
- String interpolation in `.from()`, `.select()`, `.eq()`, `.filter()` calls
- Missing RLS considerations when adding new tables or columns
- Auth checks bypassed in Edge Functions

---

## Pass 2 — INFORMATIONAL

### View/Frontend
- Inline `<style>` blocks (re-parsed every render)
- O(n×m) lookups in components (`.find()` in a loop — use a Map/Set)
- Missing loading/error states on async data fetches
- Missing `key` props on mapped elements

### Completeness Gaps
- Shortcut implementations where the complete version costs <30 min
- Missing error handling on Supabase calls
- Missing responsive breakpoints on new components
- Dark mode not handled on new UI elements

### Documentation Staleness
For each `.md` file in repo root (README, AGENTS.md, content-update-guide.md):
- Did code changes affect features described in that doc?
- If the doc wasn't updated but the code it describes was → flag as INFORMATIONAL

---

## Fix-First Heuristic

```
AUTO-FIX (apply without asking):        ASK (needs human judgment):
├─ Dead code / unused variables          ├─ Security (auth, XSS, injection)
├─ Missing loading/error states          ├─ Race conditions
├─ Stale comments contradicting code     ├─ Design decisions
├─ Missing key props                     ├─ Large fixes (>20 lines)
├─ Inline styles → Tailwind classes      ├─ Enum completeness
├─ Variables assigned but never read     ├─ Removing functionality
└─ Import cleanup                        └─ Anything changing user-visible behavior
```

**Rule:** If the fix is mechanical and a senior engineer would apply it without discussion → AUTO-FIX. If reasonable engineers could disagree → ASK.

---

## Output Format

```
Pre-Landing Review: N issues (X critical, Y informational)

**AUTO-FIXED:**
- [file:line] Problem → fix applied

**NEEDS INPUT:**
- [file:line] Problem description
  Recommended fix: suggested fix
```

If no issues: `Pre-Landing Review: No issues found.`

Be terse. One line problem, one line fix. No preamble.

---

## Suppressions — DO NOT Flag

- "X is redundant with Y" when the redundancy aids readability
- "Add a comment explaining why" — comments rot, code is truth
- Consistency-only changes with no functional impact
- Anything already addressed in the diff you're reviewing
- Supabase anon key in client code (designed to be public)
- `VITE_` env vars (Vite exposes these by design)
