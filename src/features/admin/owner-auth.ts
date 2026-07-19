import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Pool, PoolClient } from 'pg';
import { ADMIN_SESSION_COOKIE, readAdminSession } from '@/lib/adminAuth';

type Queryable = Pick<Pool | PoolClient, 'query'>;

export async function ensureOwnerActor(pool: Pool, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SELECT pg_advisory_xact_lock(hashtext('dechive-single-owner'))`);
    const existing = await client.query<{ actor_id: string; provider_subject: string }>(`SELECT ei.actor_id,ei.provider_subject FROM external_identities ei
      JOIN actor_role_memberships arm ON arm.actor_id=ei.actor_id AND arm.role='owner'
      WHERE ei.provider='local_owner' AND ei.email_verified AND ei.allowlisted LIMIT 1`);
    if (existing.rows[0]) {
      if (existing.rows[0].provider_subject !== normalizedEmail) throw new Error('owner_identity_mismatch');
      await client.query('COMMIT'); return existing.rows[0].actor_id;
    }
    const actorId = (await client.query<{ id: string }>(`INSERT INTO actors(role,display_name) VALUES ('owner','Dechive Owner') RETURNING id`)).rows[0]!.id;
    await client.query(`INSERT INTO external_identities(provider,provider_subject,email,email_verified,actor_id,allowlisted) VALUES ('local_owner',$1,$1,true,$2,true)`, [normalizedEmail, actorId]);
    await client.query(`INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1)`, [actorId]);
    await client.query('COMMIT');
    return actorId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

export async function isAuthorizedOwner(db: Queryable, actorId: string) {
  const result = await db.query(`SELECT 1 FROM actors a JOIN actor_role_memberships arm ON arm.actor_id=a.id AND arm.role='owner'
    JOIN external_identities ei ON ei.actor_id=a.id AND ei.provider='local_owner' AND ei.email_verified AND ei.allowlisted WHERE a.id=$1`, [actorId]);
  return Boolean(result.rowCount);
}

async function sessionActorId() {
  const value = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return readAdminSession(value)?.actorId ?? null;
}

export async function getAuthorizedOwnerActor(pool: Pool) {
  const actorId = await sessionActorId();
  return actorId && await isAuthorizedOwner(pool, actorId) ? actorId : null;
}

export async function requireOwnerPage(pool: Pool) {
  const actorId = await getAuthorizedOwnerActor(pool);
  if (!actorId) redirect('/admin/login');
  return actorId;
}

export async function requireOwnerAction() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  if (!origin || !host || new URL(origin).origin !== `${protocol}://${host}`) throw new Error('admin_access_denied');
  const actorId = await sessionActorId();
  if (!actorId) throw new Error('admin_access_denied');
  return actorId;
}
