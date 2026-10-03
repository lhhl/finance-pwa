import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fires INITIAL_SESSION on subscribe, then on every sign-in/sign-out/token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    isLoggedIn: !!session,
    loading,
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
