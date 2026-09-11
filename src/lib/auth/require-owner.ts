import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: member, error } = await supabase
    .from('site_members')
    .select('user_id,role')
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .maybeSingle();

  if (error || !member) {
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return { supabase, user };
}
