import { getSession, setSession } from '@/lib/auth/sessions';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

async function login(formData: FormData) {
  'use server';

  const password = String(formData.get('password') ?? '');
  const hash = process.env.ADMIN_PASSWORD_HASH;
  let signedIn = false;

  try {
    if (hash && await bcrypt.compare(password, hash)) {
      await setSession('admin', 'administrator', 60);
      signedIn = true;
    }
  } catch {
    // Return the same generic message for malformed credentials or server configuration.
  }

  if (!signedIn) redirect('/admin?error=sign-in');
  redirect('/admin/dashboard');
}

type AdminProps = { searchParams: Promise<{ error?: string }> };

export default async function Admin({ searchParams }: AdminProps) {
  if (await getSession('admin')) redirect('/admin/dashboard');
  const { error } = await searchParams;

  return <section className="mx-auto max-w-md">
    <h1 className="text-3xl font-bold">Administrator sign in</h1>
    <form action={login} className="card mt-5 space-y-4">
      {error === 'sign-in' && <p className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-950" role="alert">Unable to sign in. Check your password and ask an administrator to verify the server configuration.</p>}
      <label className="block">Password<input className="mt-1 w-full" name="password" type="password" required /></label>
      <button className="w-full">Sign in</button>
      <p className="text-sm text-slate-600">Password verification happens only on the server.</p>
    </form>
  </section>;
}
