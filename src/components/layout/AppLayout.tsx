import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IconRail } from '@/components/nav/IconRail';
import { ProductSidebar } from '@/components/nav/ProductSidebar';
import { useApp } from '@/contexts/AppContext';
import { useAddProduct } from '@/hooks/useProdbodProducts';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { currentOrgId } = useApp();

  return (
    <div
      className="app"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--pb-bg-app)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Fixed Icon Rail (Rail 1) */}
      <IconRail
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Collapsible Product & Org Rail (Rail 2) */}
      <ProductSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAddProduct={() => setShowAddProduct(true)}
      />

      {/* Main Workspace View Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          position: 'relative',
        }}
      >
        {children}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModalInline
          orgId={currentOrgId || ''}
          onClose={() => setShowAddProduct(false)}
        />
      )}
    </div>
  );
}

function AddProductModalInline({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const addProduct = useAddProduct();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 13px',
    border: '1px solid var(--pb-border)',
    borderRadius: 'var(--pb-radius-md)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    color: 'var(--pb-text)',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }
    try {
      await addProduct.mutateAsync({ orgId, name: name.trim(), description: desc.trim() || undefined });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to add product.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,20,26,0.4)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--pb-border)',
          borderRadius: 'var(--pb-radius-lg)',
          width: '100%',
          maxWidth: 480,
          boxShadow: 'var(--pb-shadow-lg)',
          fontFamily: "'DM Sans', sans-serif",
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 22px 16px',
            borderBottom: '1px solid var(--pb-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700 }}>Add product</div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              background: 'var(--pb-row-hover)',
              cursor: 'pointer',
              color: 'var(--pb-text-muted)',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div
              style={{
                padding: '11px 14px',
                borderRadius: 'var(--pb-radius-md)',
                fontSize: 13,
                background: '#fde8e5',
                border: '1px solid #fecaca',
                color: 'var(--pb-danger)',
              }}
            >
              {error}
            </div>
          )}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--pb-text-muted)',
                marginBottom: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Product name
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Mobile Banking App"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--pb-text-muted)',
                marginBottom: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Description <span style={{ fontSize: 11, color: 'var(--pb-text-faint)', fontWeight: 400, textTransform: 'none', marginLeft: 6 }}>(optional)</span>
            </label>
            <input
              style={inputStyle}
              placeholder="What does this product do?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--pb-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 16px',
              borderRadius: 'var(--pb-radius-md)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid var(--pb-border)',
              background: '#fff',
              color: 'var(--pb-text-muted)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={addProduct.isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 'var(--pb-radius-md)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: '#17171c',
              color: '#fff',
            }}
          >
            {addProduct.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Add product
          </button>
        </div>
      </div>
    </div>
  );
}
