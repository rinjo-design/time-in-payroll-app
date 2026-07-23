# Project conventions
Use TypeScript, App Router server components/actions, Zod validation at every server boundary, and server-only Supabase access. Never wrap imports in try/catch.

## Security and data
Never expose service keys, session secrets, hashes, or raw credentials. Preserve attendance/payroll history: correct via revisions, voids, or audit logs; never destructive cascades. RLS must remain enabled and anonymous browser access denied.

## Database and calculations
Migrations are additive, transactional where possible, and retain auditability. Use `numeric` for money, shared two-decimal rounding, UTC storage, and `Asia/Manila` display. Settings—not UI code—own payroll rules.

## Checks
Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before committing. Run `npm run test:e2e` when Playwright/browser infrastructure is configured.
