export function getSupabaseEnv() {
  // Next.js only exposes NEXT_PUBLIC values to the browser when each variable
  // is referenced statically. Dynamic access such as process.env[name] leaves
  // the value undefined in the client bundle.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL',
    );
  }

  if (!publishableKey) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    );
  }

  return {
    url,
    publishableKey,
  };
}
