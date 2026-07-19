import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export async function isLocalAdminRequest() {
  if (process.env.NODE_ENV === 'production') return false;
  if (process.env.DECHIVE_LOCAL_ADMIN === 'enabled') return true;
  const host = (await headers()).get('host')?.split(':')[0]?.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

export async function requireLocalAdminPage() {
  if (!(await isLocalAdminRequest())) notFound();
}

export async function requireLocalAdminAction() {
  if (!(await isLocalAdminRequest())) throw new Error('local_admin_access_denied');
}
