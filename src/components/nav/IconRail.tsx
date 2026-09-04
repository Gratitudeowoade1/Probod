import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';

interface IconRailProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function getInitials(first?: string | null, last?: string | null, email?: string | null) {
  if (first || last) return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
  return (email || 'EA').substring(0, 2).toUpperCase();
}

export function IconRail({ sidebarOpen, onToggleSidebar }: IconRailProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const myName = userProfile?.first_name
    ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
    : 'Emmanuel A.';
  const myInitials = getInitials(userProfile?.first_name, userProfile?.last_name) || 'EA';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const isHomeActive = location.pathname === '/';
  const isPeopleActive = location.pathname === '/people';

  return (
    <aside
      id="rail1"
      style={{
        width: 72,
        minWidth: 72,
        height: '100vh',
        background: 'var(--pb-rail1-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0 14px 0',
        zIndex: 25,
        userSelect: 'none',
        borderRight: sidebarOpen ? 'none' : '1px solid var(--pb-border)',
      }}
    >
      {/* Show products panel button (only when rail 2 is collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          title="Show products panel"
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--pb-rail1-muted)',
            width: 28,
            height: 28,
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pb-rail1-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <PhosphorIcon name="caretRight" size={15} />
        </button>
      )}

      {/* Brand mark */}
      <div
        title="ProdBod"
        onClick={() => navigate('/')}
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: '#17171c',
          color: 'var(--pb-accent-yellow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          fontFamily: "'Syne', sans-serif",
          marginBottom: 16,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        PB
      </div>

      {/* Navigation items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', alignItems: 'center' }}>
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: 58,
            padding: '9px 4px 7px 4px',
            borderRadius: 11,
            cursor: 'pointer',
            color: isHomeActive ? 'var(--pb-rail1-text)' : 'var(--pb-rail1-muted)',
            background: isHomeActive ? 'var(--pb-rail1-active)' : 'transparent',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => {
            if (!isHomeActive) {
              e.currentTarget.style.background = 'var(--pb-rail1-hover)';
              e.currentTarget.style.color = 'var(--pb-rail1-text)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isHomeActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--pb-rail1-muted)';
            }
          }}
        >
          <PhosphorIcon name="house" size={18} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.01em' }}>Home</span>
        </div>

        <div
          onClick={() => navigate('/people')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            width: 58,
            padding: '9px 4px 7px 4px',
            borderRadius: 11,
            cursor: 'pointer',
            color: isPeopleActive ? 'var(--pb-rail1-text)' : 'var(--pb-rail1-muted)',
            background: isPeopleActive ? 'var(--pb-rail1-active)' : 'transparent',
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => {
            if (!isPeopleActive) {
              e.currentTarget.style.background = 'var(--pb-rail1-hover)';
              e.currentTarget.style.color = 'var(--pb-rail1-text)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPeopleActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--pb-rail1-muted)';
            }
          }}
        >
          <PhosphorIcon name="users" size={18} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.01em' }}>People</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* User profile avatar */}
      <div ref={userMenuRef} style={{ position: 'relative' }}>
        <div
          title={myName}
          onClick={() => setUserMenuOpen((o) => !o)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#b3245c',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {myInitials}
        </div>

        {userMenuOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 'calc(100% + 10px)',
              background: '#ffffff',
              border: '1px solid var(--pb-border)',
              borderRadius: 10,
              boxShadow: 'var(--pb-shadow)',
              zIndex: 100,
              overflow: 'hidden',
              minWidth: 170,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--pb-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--pb-text)' }}>{myName}</div>
              <div style={{ fontSize: 11, color: 'var(--pb-text-muted)' }}>Signed in</div>
            </div>
            <div
              onClick={() => {
                navigate('/settings');
                setUserMenuOpen(false);
              }}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--pb-text)',
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pb-row-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <PhosphorIcon name="gearSix" size={14} />
              Settings
            </div>
            <div
              onClick={handleSignOut}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--pb-danger)',
                borderTop: '1px solid var(--pb-border)',
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Sign out
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
