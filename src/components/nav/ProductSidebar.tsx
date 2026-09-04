import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import { useApp } from '@/contexts/AppContext';
import { useMyOrgs } from '@/hooks/useProdbodOrgs';
import { useOrgProducts } from '@/hooks/useProdbodProducts';
import { NewOrgModal } from '@/components/organizations/NewOrgModal';

interface ProductSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: () => void;
}

const DEFAULT_SIDEBAR_PRODUCTS = [
  { code: 'R', name: 'RegComply', id: 'regcomply' },
  { code: 'R', name: 'RegLearn', id: 'reglearn' },
  { code: 'R', name: 'RegPort', id: 'regport' },
  { code: 'R', name: 'RegGuard', id: 'regguard' },
  { code: 'E', name: 'ECI', id: 'eci' },
  { code: 'R', name: 'RegWatch', id: 'regwatch' },
  { code: 'C', name: 'CIP_Solution', id: 'cip_solution' },
  { code: 'S', name: 'SupTech Liberia', id: 'suptech_liberia' },
  { code: 'S', name: 'SupTech Nigeria', id: 'suptech_nigeria' },
  { code: 'I', name: 'IT-GRC (RegComply ...)', id: 'it_grc' },
  { code: 'R', name: 'RegPort Liberia', id: 'regport_liberia' },
];

export function ProductSidebar({ isOpen, onClose, onAddProduct }: ProductSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrgId, setCurrentOrgId } = useApp();
  const { data: orgs = [] } = useMyOrgs();
  const { data: dbProducts = [] } = useOrgProducts(currentOrgId);

  const [orgDropOpen, setOrgDropOpen] = useState(false);
  const [newOrgModalOpen, setNewOrgModalOpen] = useState(false);
  const orgDropRef = useRef<HTMLDivElement>(null);

  // Expanded product id in sidebar
  const [expandedProductId, setExpandedProductId] = useState<string | null>('regcomply');

  const currentOrg = orgs.find((o) => o.id === currentOrgId) || { name: 'RegTech365' };

  // Combine DB products with prototype products for full demonstration
  const productList = dbProducts.length > 0
    ? dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        code: (p.icon_letter || p.name.charAt(0) || 'P').toUpperCase(),
      }))
    : DEFAULT_SIDEBAR_PRODUCTS;

  // Auto expand active product if on /products/:id
  useEffect(() => {
    if (location.pathname.startsWith('/products/')) {
      const parts = location.pathname.split('/');
      if (parts[2]) {
        setExpandedProductId(parts[2]);
      }
    }
  }, [location.pathname]);

  // Close org drop on outside click
  useEffect(() => {
    if (!orgDropOpen) return;
    const handler = (e: MouseEvent) => {
      if (orgDropRef.current && !orgDropRef.current.contains(e.target as Node)) {
        setOrgDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [orgDropOpen]);

  const handleProductClick = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const handleOpenBacklog = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <aside
        id="rail2"
        style={{
          width: isOpen ? 264 : 0,
          minWidth: isOpen ? 264 : 0,
          background: 'var(--pb-rail2-bg)',
          borderRight: isOpen ? '3px solid var(--pb-rail2-border)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.18s ease, min-width 0.18s ease',
          zIndex: 20,
          height: '100vh',
          overflow: isOpen ? 'visible' : 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Top: Org Switcher + Collapse button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 12px 6px 16px',
            position: 'relative',
          }}
        >
          <div
            ref={orgDropRef}
            onClick={() => setOrgDropOpen((o) => !o)}
            style={{
              padding: '9px 10px',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: orgDropOpen ? '1px solid var(--pb-rail2-divider)' : '1px solid transparent',
              background: orgDropOpen ? 'var(--pb-rail2-hover)' : 'transparent',
              flex: 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!orgDropOpen) e.currentTarget.style.background = 'var(--pb-rail2-hover)';
            }}
            onMouseLeave={(e) => {
              if (!orgDropOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14.5,
                  fontFamily: "'Syne', sans-serif",
                  color: 'var(--pb-rail1-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentOrg.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--pb-rail1-muted)', marginTop: 1 }}>Organisation</div>
            </div>
            <div
              style={{
                color: 'var(--pb-rail1-muted)',
                transition: 'transform .15s',
                transform: orgDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'flex',
                marginLeft: 6,
              }}
            >
              <PhosphorIcon name="caretDown" size={12} />
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={onClose}
            title="Collapse products panel"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--pb-rail1-muted)',
              width: 26,
              height: 26,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              marginLeft: 4,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pb-rail2-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <PhosphorIcon name="caretLeft" size={15} />
          </button>
        </div>

        {/* Org Dropdown */}
        {orgDropOpen && (
          <div
            style={{
              margin: '0 16px 8px 16px',
              background: '#fff',
              border: '1px solid var(--pb-rail2-border)',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: 'var(--pb-shadow)',
              zIndex: 35,
            }}
          >
            {orgs.map((org) => (
              <div
                key={org.id}
                onClick={() => {
                  setCurrentOrgId(org.id);
                  setOrgDropOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                  cursor: 'pointer',
                  color: 'var(--pb-text)',
                  background: org.id === currentOrgId ? 'var(--pb-rail2-hover)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pb-rail2-hover)')}
                onMouseLeave={(e) => {
                  if (org.id !== currentOrgId) e.currentTarget.style.background = 'transparent';
                }}
              >
                {org.name}
              </div>
            ))}
            {orgs.length === 0 && (
              <div
                style={{
                  padding: '10px 12px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                RegTech365
              </div>
            )}
            <div
              onClick={() => {
                setOrgDropOpen(false);
                setNewOrgModalOpen(true);
              }}
              style={{
                padding: '10px 12px',
                fontSize: 13,
                color: 'var(--pb-rail1-muted)',
                borderTop: '1px solid var(--pb-rail2-divider)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--pb-rail2-hover)';
                e.currentTarget.style.color = 'var(--pb-rail1-text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--pb-rail1-muted)';
              }}
            >
              <PhosphorIcon name="plus" size={13} />
              <span>New organisation</span>
            </div>
          </div>
        )}

        {/* Rail 2 Body: Products List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: '.09em',
              color: 'var(--pb-rail1-muted)',
              opacity: 0.85,
              padding: '14px 16px 6px 16px',
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            PRODUCTS
          </div>

          <div style={{ padding: '0 8px' }}>
            {productList.map((product) => {
              const isExpanded = expandedProductId === product.id;
              const isBacklogActive =
                location.pathname === `/products/${product.id}` ||
                location.pathname.startsWith(`/products/${product.id}/`);

              return (
                <div key={product.id} style={{ marginBottom: 1, borderRadius: 8, overflow: 'hidden' }}>
                  {/* Product top row */}
                  <div
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '8px 10px',
                      fontSize: 13.5,
                      color: 'var(--pb-rail1-text)',
                      cursor: 'pointer',
                      borderRadius: 8,
                      borderLeft: isExpanded ? '3px solid #B8860B' : '3px solid transparent',
                      background: isExpanded ? 'var(--pb-rail2-active)' : 'transparent',
                      fontWeight: isExpanded ? 700 : 500,
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'var(--pb-rail2-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: '#17171c',
                        color: 'var(--pb-accent-yellow)',
                        fontSize: 11,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {product.code}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        color: isExpanded ? '#8a6d10' : 'var(--pb-rail1-muted)',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s',
                        display: 'flex',
                      }}
                    >
                      <PhosphorIcon name="caretRight" size={11} />
                    </div>
                  </div>

                  {/* Subnav items when expanded */}
                  {isExpanded && (
                    <div style={{ padding: '2px 0 6px 0' }}>
                      <div
                        onClick={() => handleOpenBacklog(product.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 10px 7px 39px',
                          fontSize: 13,
                          color: isBacklogActive ? 'var(--pb-rail1-text)' : 'var(--pb-rail1-muted)',
                          background: isBacklogActive ? '#ffffff' : 'transparent',
                          fontWeight: isBacklogActive ? 600 : 500,
                          cursor: 'pointer',
                          borderRadius: 6,
                          margin: '0 4px',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isBacklogActive) {
                            e.currentTarget.style.background = 'var(--pb-rail2-hover)';
                            e.currentTarget.style.color = 'var(--pb-rail1-text)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isBacklogActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--pb-rail1-muted)';
                          }
                        }}
                      >
                        <PhosphorIcon name="listBullets" size={14} />
                        <span>Backlog</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add product button */}
          <div
            onClick={onAddProduct}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px 9px 24px',
              fontSize: 13,
              color: 'var(--pb-rail1-muted)',
              cursor: 'pointer',
              transition: 'color 0.15s',
              fontWeight: 600,
              marginTop: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pb-rail1-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pb-rail1-muted)')}
          >
            <PhosphorIcon name="plus" size={13} />
            <span>Add product</span>
          </div>
        </div>
      </aside>

      <NewOrgModal
        open={newOrgModalOpen}
        onClose={() => setNewOrgModalOpen(false)}
        onCreated={(orgId) => setCurrentOrgId(orgId)}
      />
    </>
  );
}
