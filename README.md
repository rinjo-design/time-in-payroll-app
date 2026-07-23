# Time In & Payroll
A Next.js internal kiosk attendance and weekly payroll application for Philippine operations (default `Asia/Manila`, PHP, Monday–Sunday periods).

## Architecture
The browser renders App Router pages; sensitive writes run through server actions and a server-only Supabase service client. Signed HTTP-only cookies keep distinct employee, My Pay (15 minutes), and administrator sessions. PostgreSQL RLS is enabled on exposed sensitive tables; the browser never receives a service key.

## Local setup
```bash
git clone <repository-url> && cd time-in-payroll-app
cp .env.example .env.local
npm install
npm run hash:admin 2001 # put output in ADMIN_PASSWORD_HASH
npx supabase db reset # applies supabase/migrations in a configured Supabase CLI project
npm run dev
```
Configure Supabase Storage with a private `employee-qr-codes` bucket and server-only uploads. Apply migrations with `npx supabase db push`; seed data should be inserted only in local development and must never contain production credentials.

## Environment
Set the variables in `.env.example`. Generate long random values for all three session secrets. `ADMIN_PASSWORD_HASH` is a bcrypt hash; the initial behavior is password `2001`, but that literal is never bundled or committed as configuration.

## Security
Name selection is intentionally low-security and only establishes attendance identity. It cannot prove identity. My Pay requires a separate bcrypt-hashed 4–8 digit PIN, locks after five failures for 15 minutes, and has an administrator-approved reset workflow. Admin passwords are checked only in a server action. Audit records and immutable finalized/paid payroll support review.

## Payroll assumptions
`regular_minutes = min(worked_minutes, standard_daily_hours × 60)` and `regular_pay = daily_rate × regular_minutes / standard_daily_minutes`. Approved overtime is `daily_rate / standard_daily_hours × overtime_hours × multiplier`; rejected/pending overtime is excluded. Gross = regular + overtime + bonus/reimbursement + positive adjustments − negative adjustments. Values are rounded by the shared two-decimal utility. Effective-dated rates are snapshots in payroll line items; rate changes must not rewrite finalized history. Manual overrides retain computed gross, require a reason, and set a separately labeled final payout.

## Quality and deployment
```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
vercel --prod
```
Set all secrets in Vercel project environment settings, deploy from GitHub, and run migrations before serving traffic. Recommended future work: production-rate-limit store, full admin CRUD/action forms, Supabase Storage upload route with magic-byte inspection, rate-period exclusion constraint, expanded Playwright coverage, and operational backup/audit retention policies.
