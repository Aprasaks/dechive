const REQUIRED_PUBLIC_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
] as const;

export function getSupabaseEnv() {
  for (const name of REQUIRED_PUBLIC_ENV) {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    publishableKey: process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  };
}
