import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import { useApp } from '@/contexts/AppContext';
import { useMyOrgs } from '@/hooks/useProdbodOrgs';
import { useOrgProducts } from '@/hooks/useProdbodProducts';
import { useOrgMembersProdbod } from '@/hooks/useProdbodMembers';
import { ProductCard, ProductCardData } from '@/components/dashboard/ProductCard';
import { PeoplePicker } from '@/components/dashboard/PeoplePicker';
import { useProductRoles } from '@/hooks/useProductRoles';
import { NewOrgModal } from '@/components/organizations/NewOrgModal';

const DEFAULT_PROTOTYPE_PRODUCTS: ProductCardData[] = [
  {
    id: 'regcomply',
    code: 'R',
    name: 'RegComply',
    desc: 'Enterprise-wide compliance management with a workflow-first approach.',
    pm: { name: 'Efe A.', color: '#e0508a', code: 'E' },
    live: 18,
    flight: 10,
    total: 43,
    segments: [
      { c: 'var(--pb-accent-purple)', w: 38 },
      { c: 'var(--pb-accent-blue)', w: 20 },
      { c: 'var(--pb-accent-orange)', w: 14 },
      { c: 'var(--pb-accent-pink)', w: 8 },
      { c: 'var(--pb-accent-green)', w: 20 },
    ],
  },
  {
    id: 'reglearn',
    code: 'R',
    name: 'RegLearn',
    desc: 'A compliance learning solution',
    pm: null,
    live: 23,
    flight: 15,
    total: 66,
    segments: [
      { c: 'var(--pb-accent-purple)', w: 28 },
      { c: 'var(--pb-accent-blue)', w: 12 },
      { c: 'var(--pb-accent-orange)', w: 22 },
      { c: 'var(--pb-accent-pink)', w: 6 },
      { c: 'var(--pb-accent-green)', w: 32 },
    ],
  },
  {
    id: 'regport',
    code: 'R',
    name: 'RegPort',
    desc: 'An Anti-money laundry solution',
    pm: null,
    live: 57,
    flight: 0,
    total: 61,
    segments: [
      { c: 'var(--pb-accent-blue)', w: 6 },
      { c: 'var(--pb-accent-green)', w: 94 },
    ],
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentOrgId, setCurrentOrgId } = useApp();
  const { data: orgs = [] } = useMyOrgs();
  const { data: dbProducts = [], isLoading: productsLoading } = useOrgProducts(currentOrgId);
  const { data: members = [] } = useOrgMembersProdbod(currentOrgId);

  const [newOrgOpen, setNewOrgOpen] = useState(false);
  const [pickerState, setPickerState] = useState<{
    isOpen: boolean;
    productId: string | null;
    role: 'pm' | 'lead_engineer';
    title: string;
  }>({ isOpen: false, productId: null, role: 'pm', title: '' });

  const { assignRole } = useProductRoles(pickerState.productId);

  const currentOrg = orgs.find((o) => o.id === currentOrgId) || { name: 'RegTech365', industry: 'SaaS / B2B' };
  const totalMembers = members.length > 0 ? members.length : 13;
  const activeMembers = members.filter((m) => m.status === 'Active').length || 12;
  const pendingMembers = members.filter((m) => m.status === 'Pending').length || 1;

  // Combine DB products with prototype products
  const displayProducts: ProductCardData[] =
    dbProducts.length > 0
      ? dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          code: (p.icon_letter || p.name.charAt(0) || 'P').toUpperCase(),
          desc: p.description || 'Product intelligence and delivery workflow.',
          live: 18,
          flight: 10,
          total: 35,
          segments: [
            { c: 'var(--pb-accent-purple)', w: 30 },
            { c: 'var(--pb-accent-blue)', w: 25 },
            { c: 'var(--pb-accent-orange)', w: 15 },
            { c: 'var(--pb-accent-green)', w: 30 },
          ],
        }))
      : DEFAULT_PROTOTYPE_PRODUCTS;

  const handleAssignRole = (productId: string, role: 'pm' | 'lead_engineer') => {
    setPickerState({
      isOpen: true,
      productId,
      role,
      title: role === 'pm' ? 'Assign Product Manager' : 'Assign Lead Engineer',
    });
  };

  const handlePickerSelect = async (userId: string) => {
    if (pickerState.productId) {
      await assignRole(pickerState.role, userId);
    }
    setPickerState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        background: 'var(--pb-bg-app)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          padding: '20px 32px 0 32px',
          fontSize: 13,
          color: 'var(--pb-text-muted)',
          fontWeight: 600,
        }}
      >
        Dashboard
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 32px 18px 32px',
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            margin: 0,
            fontFamily: "'Syne', sans-serif",
            color: 'var(--pb-text)',
          }}
        >
          Dashboard
        </h1>

        <button
          onClick={() => setNewOrgOpen(true)}
          style={{
            background: '#17171c',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 9,
            fontSize: 13.5,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#000000')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#17171c')}
        >
          <span style={{ color: 'var(--pb-accent-yellow)', display: 'inline-flex' }}>
            <PhosphorIcon name="plus" size={14} />
          </span>
          <span>New organisation</span>
        </button>
      </div>

      {/* 3 Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          padding: '0 32px 26px 32px',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--pb-border)',
            borderRadius: 'var(--pb-radius-lg)',
            padding: '20px 22px',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.07em',
              color: 'var(--pb-text-faint)',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            TOTAL MEMBERS
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1,
              color: 'var(--pb-text)',
            }}
          >
            {totalMembers}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--pb-text-muted)', marginTop: 8 }}>
            {activeMembers} active · {pendingMembers} pending
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid var(--pb-border)',
            borderRadius: 'var(--pb-radius-lg)',
            padding: '20px 22px',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.07em',
              color: 'var(--pb-text-faint)',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            PRODUCTS
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1,
              color: 'var(--pb-accent-orange)',
            }}
          >
            {displayProducts.length > 0 ? displayProducts.length : 11}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--pb-text-muted)', marginTop: 8 }}>
            in this organisation
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid var(--pb-border)',
            borderRadius: 'var(--pb-radius-lg)',
            padding: '20px 22px',
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '.07em',
              color: 'var(--pb-text-faint)',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            ORGANISATION
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              color: 'var(--pb-text)',
              marginTop: 2,
            }}
          >
            {currentOrg.name}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--pb-text-muted)', marginTop: 8 }}>
            {(currentOrg as any).industry || 'SaaS / B2B'}
          </div>
        </div>
      </div>

      {/* Products Section Header */}
      <div
        style={{
          padding: '8px 32px 4px 32px',
          fontSize: 19,
          fontWeight: 700,
          fontFamily: "'Syne', sans-serif",
          color: 'var(--pb-text)',
        }}
      >
        Products
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 18,
          padding: '14px 32px 40px 32px',
        }}
      >
        {displayProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => navigate(`/products/${p.id}`)}
            onAssignRole={(role) => handleAssignRole(p.id, role)}
          />
        ))}
      </div>

      {/* New Org Modal */}
      <NewOrgModal
        open={newOrgOpen}
        onClose={() => setNewOrgOpen(false)}
        onCreated={(orgId) => setCurrentOrgId(orgId)}
      />

      {/* People picker modal */}
      <PeoplePicker
        isOpen={pickerState.isOpen}
        title={pickerState.title}
        onSelect={handlePickerSelect}
        onClose={() => setPickerState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
