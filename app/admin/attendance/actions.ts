'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/sessions';
import { supabaseAdmin } from '@/lib/supabase/server';
import { attendanceEditSchema } from '@/lib/validation/schemas';

const toUtc = (value: string) => { const date = new Date(value); return Number.isNaN(date.valueOf()) ? '' : date.toISOString(); };

export async function createAttendanceLog(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = attendanceEditSchema.safeParse({
    clockInAt: toUtc(String(formData.get('clockInAt') ?? '')),
    clockOutAt: formData.get('clockOutAt') ? toUtc(String(formData.get('clockOutAt'))) : undefined,
    reason: String(formData.get('reason') ?? ''),
  });
  const employeeId = String(formData.get('employeeId') ?? '');
  if (!parsed.success || !employeeId) throw new Error('Enter an employee, valid timestamps, and a correction reason.');
  const db = supabaseAdmin();
  const { data, error } = await db.from('attendance_logs').insert({
    employee_id: employeeId, clock_in_at: parsed.data.clockInAt, clock_out_at: parsed.data.clockOutAt ?? null,
    source: 'admin_correction', notes: parsed.data.reason, created_by_admin: admin, last_edited_by_admin: admin,
  }).select('id').single();
  if (error) throw new Error(error.message);
  await db.from('admin_audit_logs').insert({ actor: admin, action: 'attendance_created', entity_type: 'attendance_log', entity_id: data.id, new_data: parsed.data, reason: parsed.data.reason });
  revalidatePath('/admin/attendance');
}

export async function correctAttendanceLog(formData: FormData) {
  const admin = await requireAdmin();
  const logId = String(formData.get('logId') ?? '');
  const parsed = attendanceEditSchema.safeParse({
    clockInAt: toUtc(String(formData.get('clockInAt') ?? '')),
    clockOutAt: formData.get('clockOutAt') ? toUtc(String(formData.get('clockOutAt'))) : undefined,
    reason: String(formData.get('reason') ?? ''),
  });
  if (!parsed.success || !logId) throw new Error('A valid correction reason and timestamps are required.');
  const db = supabaseAdmin();
  const { data: oldLog, error: lookupError } = await db.from('attendance_logs').select('id,employee_id,clock_in_at,clock_out_at,notes').eq('id', logId).single();
  if (lookupError || !oldLog) throw new Error('Attendance record was not found.');
  const next = { clock_in_at: parsed.data.clockInAt, clock_out_at: parsed.data.clockOutAt ?? null, notes: parsed.data.reason, last_edited_by_admin: admin, updated_at: new Date().toISOString() };
  const { error } = await db.from('attendance_logs').update(next).eq('id', logId);
  if (error) throw new Error(error.message);
  await db.from('attendance_log_revisions').insert({ attendance_log_id: logId, old_values: oldLog, new_values: next, reason: parsed.data.reason, admin_identifier: admin });
  await db.from('admin_audit_logs').insert({ actor: admin, action: 'attendance_corrected', entity_type: 'attendance_log', entity_id: logId, previous_data: oldLog, new_data: next, reason: parsed.data.reason });
  revalidatePath('/admin/attendance');
}
