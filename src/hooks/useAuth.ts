import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Set up listener BEFORE getting session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session.user ?? null);
      }
      setLoading(false);
    });

    // 2. Safely get current session with error handling for stale/invalid refresh tokens
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.warn('Auth session recovery error, clearing stale token:', error.message);
          // If the stored refresh token is expired or invalid on the server, clear local auth keys
          try {
            const projectKey = 'sb-' + (import.meta.env.VITE_SUPABASE_PROJECT_ID || '') + '-auth-token';
            localStorage.removeItem(projectKey);
            localStorage.removeItem('supabase.auth.token');
          } catch (e) {
            // ignore localStorage access errors
          }
          setSession(null);
          setUser(null);
        } else {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Unhandled auth getSession error:', err);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error during signOut:', e);
    }
    setSession(null);
    setUser(null);
  };

  return { session, user, loading, signOut };
}
