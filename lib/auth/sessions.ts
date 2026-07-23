import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
type Role='employee'|'my-pay'|'admin'; const names: Record<Role,string>={employee:'tip_employee', 'my-pay':'tip_my_pay',admin:'tip_admin'};
function key(role:Role) { const value=process.env[role==='employee'?'EMPLOYEE_SESSION_SECRET':role==='my-pay'?'MY_PAY_SESSION_SECRET':'ADMIN_SESSION_SECRET']; if (!value) throw new Error(`${role} session secret is missing`); return new TextEncoder().encode(value); }
export async function setSession(role:Role, subject:string, minutes=480) { const token=await new SignJWT({role}).setProtectedHeader({alg:'HS256'}).setSubject(subject).setIssuedAt().setExpirationTime(`${minutes}m`).sign(key(role)); (await cookies()).set(names[role],token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:minutes*60}); }
export async function getSession(role:Role) { const token=(await cookies()).get(names[role])?.value; if(!token)return null; try { const {payload}=await jwtVerify(token,key(role)); return payload.role===role&&payload.sub?payload.sub:null; } catch{return null;} }
export async function clearSession(role:Role){(await cookies()).delete(names[role]);}
/** Redirect unauthenticated navigation instead of exposing a Next.js error page. */
export async function requireEmployee(){const id=await getSession('employee');if(!id)redirect('/?message=select-employee');return id;}
/** Redirect unauthenticated navigation instead of exposing a Next.js error page. */
export async function requireAdmin(){const id=await getSession('admin');if(!id)redirect('/admin');return id;}
