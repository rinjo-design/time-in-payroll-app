import { selectEmployee } from './actions';
import { supabaseAdmin } from '@/lib/supabase/server';

// Employee availability changes in Supabase must be reflected on every kiosk visit.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type HomeProps = { searchParams: Promise<{ message?: string }> };

export default async function Home({ searchParams }: HomeProps) {
  const { message } = await searchParams;
  let employees: { id: string; display_name: string; employee_code: string }[] = [];
  let employeeDirectoryUnavailable = false;

  try {
    const result = await supabaseAdmin()
      .from('employees')
      .select('id,display_name,employee_code')
      .eq('is_active', true)
      .order('display_name');
    employees = result.data ?? [];
  } catch {
    // Keep the kiosk page available without exposing server configuration details.
    employeeDirectoryUnavailable = true;
  }

  return <section className="mx-auto max-w-xl space-y-6">
    <div>
      <p className="text-sm font-semibold text-indigo-700">WORKPLACE TIME CLOCK</p>
      <h1 className="text-3xl font-bold">Select your name</h1>
      <p className="mt-2 text-slate-600">This kiosk identifies you for attendance only. My Pay always needs your private PIN.</p>
    </div>
    {message === 'select-employee' && <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="status">Select an active employee before opening attendance, calendar, My Pay, or QR code.</p>}
    <form action={selectEmployee} className="card space-y-4">
      <label className="block font-medium" htmlFor="employeeId">Active employee</label>
      <select id="employeeId" name="employeeId" required className="w-full">
        <option value="">Choose your name</option>
        {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.display_name} ({employee.employee_code})</option>)}
      </select>
      <button className="w-full min-h-14" type="submit">Continue to time clock</button>
      {employeeDirectoryUnavailable ? (
        <p className="text-sm text-amber-800" role="alert">The employee directory is temporarily unavailable. Check the server&apos;s Supabase configuration and redeploy.</p>
      ) : !employees.length && <p className="text-sm text-slate-500">No active employees are available. An administrator can add one.</p>}
    </form>
  </section>;
}
