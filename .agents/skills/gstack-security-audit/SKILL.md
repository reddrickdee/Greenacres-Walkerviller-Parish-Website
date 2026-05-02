---
name: gstack-security-audit
description: |
  Security audit checklist adapted from GStack's /cso (Chief Security Officer) skill.
  Covers secrets archaeology, dependency supply chain, OWASP Top 10, STRIDE threat
  modeling, and Supabase-specific security checks. Use when asked to "security audit",
  "check for vulnerabilities", "OWASP review", "CSO review", or before deploying
  changes that touch auth, Supabase, or user input handling.
---

# Security Audit Checklist

Adapted from [GStack](https://github.com/garrytan/gstack) `/cso` (Chief Security Officer) by Garry Tan. MIT Licensed.

You are a **Chief Security Officer** conducting a security posture review. Think like an attacker, report like a defender. No security theater — find the doors that are actually unlocked.

## Project Context

- **Stack:** React 18 SPA + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment:** Vercel (static hosting with `vercel.json` rewrites)
- **Auth:** Supabase Auth (env-gated: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- **Data:** Static JSON fallback in `public/data/`, Supabase for dynamic features
- **Features with auth:** Daily Reflections, Community Hub

---

## Phase 1: Supabase-Specific Security (Priority for this project)

### Anon Key Exposure
- The Supabase anon key is designed to be public, BUT check that Row Level Security (RLS) policies are properly configured on every table
- Verify `supabase_*.sql` schema files have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for all tables
- Check that RLS policies restrict access appropriately (read-only for public content, auth-required for user-generated content)

### Edge Functions
- Check `supabase/functions/` for input validation on all request parameters
- Verify CORS headers are restrictive (not `*`)
- Check for secrets handling — no hardcoded keys in function code

### Auth Configuration
- Verify redirect URLs are restricted to the production domain
- Check for proper session handling and token refresh logic
- Verify email templates don't contain XSS vectors

---

## Phase 2: Secrets Archaeology

Scan for leaked credentials:

```bash
# Check git history for secret patterns
git log -p --all -S "sk-" --diff-filter=A -- "*.env" "*.yml" "*.json" "*.ts" "*.js"
git log -p --all -G "password|secret|token|api_key" -- "*.env" "*.yml" "*.json"

# Check .env is gitignored
grep -q "^\.env$" .gitignore && echo ".env IS gitignored" || echo "WARNING: .env NOT in .gitignore"

# Check for tracked env files
git ls-files '*.env' '.env.*' | grep -v '.example\|.sample'
```

**Severity:** CRITICAL for active secrets in git history. HIGH for .env tracked by git.

---

## Phase 3: Dependency Supply Chain

```bash
# Run npm audit
npm audit --production

# Check for postinstall scripts in production deps
node -e "const p=require('./package.json'); Object.keys(p.dependencies||{}).forEach(d=>{try{const dp=require('./node_modules/'+d+'/package.json'); if(dp.scripts&&(dp.scripts.postinstall||dp.scripts.preinstall||dp.scripts.install)){console.log('ALERT:',d,'has install script:',dp.scripts.postinstall||dp.scripts.preinstall||dp.scripts.install)}}catch(e){}})"

# Verify lockfile is tracked
git ls-files package-lock.json | grep -q . && echo "lockfile tracked" || echo "WARNING: lockfile not tracked"
```

---

## Phase 4: OWASP Top 10 (Adapted for SPA + Supabase)

### A01: Broken Access Control
- Check Supabase RLS policies cover all tables
- Verify client-side route guards match server-side auth requirements
- Check for direct object references (can user A see user B's data by changing IDs in Supabase queries?)

### A02: Cryptographic Failures
- Is sensitive data encrypted at rest (Supabase handles this, but verify Edge Functions)?
- Are API keys properly env-gated?

### A03: Injection
- Check for `dangerouslySetInnerHTML` usage — is the content sanitized?
- Check Supabase queries for string interpolation (should use parameterized queries)
- Check Edge Functions for command injection patterns

### A05: Security Misconfiguration
- CORS in `vercel.json` — is it restrictive?
- CSP headers present in `vercel.json` security headers?
- Debug mode / verbose errors exposed in production?
- Source maps exposed in production build?

### A07: Identification and Authentication Failures
- Session management via Supabase Auth — is token refresh handled?
- Is auth state properly cleared on logout?
- Are protected routes properly guarded client-side AND server-side?

### A10: Server-Side Request Forgery (SSRF)
- Check Edge Functions for URL construction from user input
- Check for fetch/axios calls with user-controlled URLs

---

## Phase 5: Frontend-Specific Security

### XSS Prevention
- Search for `dangerouslySetInnerHTML` — verify all uses sanitize input
- Check for `v-html` or `innerHTML` usage
- Verify user-generated content from Supabase is escaped before rendering

### Content Security Policy
- Check `vercel.json` for CSP headers
- Verify `script-src`, `style-src`, `img-src` directives
- Check for inline scripts that would require `unsafe-inline`

### Sensitive Data in Client Bundle
- Search for hardcoded secrets, API keys, or credentials in `.ts`/`.tsx` files
- Verify only the Supabase anon key is exposed (not service role key)
- Check for sensitive data in localStorage that should be in httpOnly cookies

---

## Phase 6: STRIDE Threat Model (Parish Website)

```
COMPONENT: Supabase Auth
  Spoofing:             Can an unauthenticated user post as another user?
  Tampering:            Can Community Hub posts be modified by non-authors?
  Repudiation:          Are auth events logged?
  Information Disclosure: Can user email addresses be enumerated?
  Denial of Service:    Rate limiting on auth endpoints?
  Elevation of Privilege: Can a regular user access admin features?

COMPONENT: Community Hub
  Spoofing:             Posts require authentication?
  Tampering:            RLS prevents unauthorized edits?
  Information Disclosure: Private content only visible to authenticated users?

COMPONENT: Static Content (public/data/)
  Tampering:            JSON files served from CDN — content integrity?
  Information Disclosure: No sensitive data in public JSON files?
```

---

## Output Format

```
SECURITY POSTURE REPORT
═══════════════════════
#   Sev    Conf   Status      Category         Finding                     File:Line
──  ────   ────   ──────      ────────         ───────                     ─────────
1   CRIT   9/10   VERIFIED    Secrets          Description                 file.ts:42
```

For each finding include:
- **Severity:** CRITICAL | HIGH | MEDIUM
- **Confidence:** N/10
- **Exploit scenario:** Step-by-step attack path
- **Recommendation:** Specific fix

---

## False Positive Rules

Do NOT flag:
- Supabase anon key in client code (it's designed to be public with RLS)
- `VITE_` prefixed env vars (Vite exposes these by design — verify they're non-sensitive)
- Denial of Service / rate limiting (out of scope for a parish website)
- Test fixtures and mock data
- Dependencies with CVEs that have no known exploit
- React's built-in XSS protection (only flag `dangerouslySetInnerHTML`)

---

## Disclaimer

This checklist is an AI-assisted scan that catches common vulnerability patterns — it is not comprehensive and not a replacement for a professional security audit. For production systems handling sensitive data, engage a qualified security firm.
