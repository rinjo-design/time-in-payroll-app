import { requireAdmin } from '@/lib/auth/sessions';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAttendanceLog, correctAttendanceLog } from './actions';

const display = (value: string | null) => value ? new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(value)) : 'Incomplete';
const inputValue = (value: string | null) => value ? new Date(value).toISOString().slice(0, 16) : '';

export default async function AttendancePage() {
  await requireAdmin();
  const db = supabaseAdmin();
  const [{ data: employeeRows }, { data: logRows }] = await Promise.all([
    db.from('employees').select('id,display_name,employee_code').eq('is_active', true).order('display_name'),
    db.from('attendance_logs').select('id,employee_id,clock_in_at,clock_out_at,notes,employees(display_name,employee_code)').order('clock_in_at', { ascending: false }).limit(50),
  ]);
  const employees = employeeRows ?? [];
  const logs = logRows ?? [];
  return <section className="space-y-6">
    <div><p className="text-sm font-semibold text-indigo-700">ADMINISTRATION</p><h1 className="text-3xl font-bold">Attendance review & corrections</h1><p className="mt-2 text-slate-600">Every manual entry or correction requires a reason and creates an immutable audit record.</p></div>
    <form action={createAttendanceLog} className="card grid gap-3 md:grid-cols-2"><h2 className="md:col-span-2 text-xl font-bold">Add attendance record</h2><label>Employee<select name="employeeId" required className="mt-1 w-full"><option value="">Select employee</option>{employees.map(employee => <option key={employee.id} value={employee.id}>{employee.display_name} · {employee.employee_code}</option>)}</select></label><label>Time in<input name="clockInAt" type="datetime-local" required className="mt-1 w-full" /></label><label>Time out (optional)<input name="clockOutAt" type="datetime-local" className="mt-1 w-full" /></label><label>Reason<textarea name="reason" minLength={5} required className="mt-1 w-full" placeholder="Why is this entry being added?" /></label><button className="md:col-span-2">Add audited record</button></form>
    <div className="card overflow-x-auto"><h2 className="mb-4 text-xl font-bold">Recent attendance</h2><table className="w-full min-w-[760px] text-left text-sm"><thead><tr><th>Employee</th><th>Time in</th><th>Time out</th><th>Status</th><th>Correction</th></tr></thead><tbody>{logs.map((log: any) => <tr className="border-t align-top" key={log.id}><td className="py-3 font-medium">{log.employees?.display_name}<br/><span className="text-slate-500">{log.employees?.employee_code}</span></td><td>{display(log.clock_in_at)}</td><td>{display(log.clock_out_at)}</td><td>{log.clock_out_at ? 'Complete' : 'Incomplete — review required'}</td><td><details><summary className="cursor-pointer font-semibold text-indigo-700">Correct</summary><form action={correctAttendanceLog} className="mt-2 grid gap-2"><input name="logId" type="hidden" value={log.id}/><label>Time in<input name="clockInAt" type="datetime-local" defaultValue={inputValue(log.clock_in_at)} required className="ml-2"/></label><label>Time out<input name="clockOutAt" type="datetime-local" defaultValue={inputValue(log.clock_out_at)} className="ml-2"/></label><label>Reason<textarea name="reason" minLength={5} required className="block w-full" placeholder="Required correction reason"/></label><button>Save correction</button></form></details></td></tr>)}</tbody></table>{!logs.length && <p>No attendance records were found.</p>}</div>
  </section>;
}
