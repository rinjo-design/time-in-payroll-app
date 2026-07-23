import './globals.css';
import Link from 'next/link';
export const metadata = { title: 'Time In & Payroll', description: 'Secure internal time tracking and weekly payroll' };
export default function Layout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl items-center gap-4 p-4"><Link className="font-bold text-indigo-800" href="/">Time In & Payroll</Link><Link href="/time-clock">Time clock</Link><Link href="/calendar">Calendar</Link><Link href="/my-pay">My Pay</Link><Link href="/qr-code">QR code</Link><Link className="ml-auto" href="/admin">Admin</Link></nav></header><main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main></body></html> }
