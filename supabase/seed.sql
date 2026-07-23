-- Development-only fixture identifiers. No passwords, hashes, or production credentials.
insert into employees (id,employee_code,display_name) values
 ('00000000-0000-0000-0000-000000000001','EMP-001','Ava Santos'),('00000000-0000-0000-0000-000000000002','EMP-002','Ben Cruz'),('00000000-0000-0000-0000-000000000003','EMP-003','Cara Reyes');
insert into daily_rate_history(employee_id,daily_rate,effective_from,effective_to,created_by) values
 ('00000000-0000-0000-0000-000000000001',700,'2026-01-01','2026-06-30','seed'),('00000000-0000-0000-0000-000000000001',800,'2026-07-01',null,'seed');
insert into attendance_logs(employee_id,clock_in_at,clock_out_at) values
 ('00000000-0000-0000-0000-000000000001','2026-07-20 00:00+00','2026-07-20 09:00+00'),('00000000-0000-0000-0000-000000000001','2026-07-21 00:00+00','2026-07-21 04:00+00'),('00000000-0000-0000-0000-000000000002','2026-07-22 00:00+00',null);
insert into payroll_periods(id,period_start,period_end,status) values ('10000000-0000-0000-0000-000000000001','2026-07-13','2026-07-19','paid'),('10000000-0000-0000-0000-000000000002','2026-07-20','2026-07-26','draft');
insert into overtime_records(employee_id,work_date,overtime_minutes,multiplier,status) values ('00000000-0000-0000-0000-000000000001','2026-07-20',60,1.25,'approved'),('00000000-0000-0000-0000-000000000001','2026-07-21',30,1.25,'pending');
insert into payroll_payouts(id,payroll_period_id,employee_id,computed_regular_pay,computed_overtime_pay,computed_bonus_total,computed_adjustment_total,computed_gross_pay,manual_override_amount,manual_override_reason,final_payout_amount,status,created_by) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001',4000,125,300,0,4425,4400,'Seed reconciliation example',4400,'paid','seed');
insert into payroll_line_items(payroll_payout_id,line_type,description,amount) values ('20000000-0000-0000-0000-000000000001','bonus','Sample performance bonus',300);
