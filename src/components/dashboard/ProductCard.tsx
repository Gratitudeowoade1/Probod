import React from 'react';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import { useProductRoles } from '@/hooks/useProductRoles';

export interface ProductCardData {
  id: string;
  name: string;
  code?: string;
  desc?: string;
  description?: string;
  pm?: { name: string; color: string; code: string } | null;
  live?: number;
  flight?: number;
  total?: number;
  segments?: Array<{ c: string; w: number }>;
}

interface ProductCardProps {
  product: ProductCardData;
  canManage?: boolean;
  onClick: () => void;
  onAssignRole?: (role: 'pm' | 'lead_engineer') => void;
}

export function ProductCard({ product, canManage = true, onClick, onAssignRole }: ProductCardProps) {
  const { pm: dbPm, leadEngineer: dbLeadEng } = useProductRoles(product.id);

  const code = (product.code || product.name.charAt(0) || 'P').toUpperCase();
  const desc = product.description || product.desc || 'Comprehensive product workflow management.';
  
  // Role info from db or mock
  const pmName = dbPm?.name || product.pm?.name;
  const pmColor = dbPm?.avatarColor || product.pm?.color || '#e0508a';
  const pmCode = dbPm?.initials || product.pm?.code || 'PM';

  const segments = product.segments || [
    { c: 'var(--pb-accent-purple)', w: 35 },
    { c: 'var(--pb-accent-blue)', w: 20 },
    { c: 'var(--pb-accent-orange)', w: 15 },
    { c: 'var(--pb-accent-pink)', w: 10 },
    { c: 'var(--pb-accent-green)', w: 20 },
  ];

  const live = product.live ?? 18;
  const flight = product.flight ?? 10;
  const total = product.total ?? (live + flight + 15);

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid var(--pb-border)',
        borderRadius: 'var(--pb-radius-lg)',
        padding: 20,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
        transition: 'box-shadow .15s, transform .15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--pb-shadow)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: 'var(--pb-accent-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 16,
            fontFamily: "'Syne', sans-serif",
            color: '#17171c',
          }}
        >
          {code}
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            color: 'var(--pb-text-faint)',
            padding: 4,
            display: 'flex',
            cursor: 'pointer',
          }}
        >
          <PhosphorIcon name="dotsThreeVertical" size={17} />
        </div>
      </div>

      {/* Name and Description */}
      <div>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            margin: '0 0 4px 0',
            fontFamily: "'Syne', sans-serif",
            color: 'var(--pb-text)',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'var(--pb-text-muted)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 38,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Role Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {pmName ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAssignRole?.('pm');
            }}
            style={{
              border: '1px solid var(--pb-border)',
              background: '#fafaf9',
              fontSize: 11.5,
              fontWeight: 600,
              padding: '4px 10px 4px 4px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--pb-text-muted)',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: pmColor,
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {pmCode}
            </div>
            <span>PM · {pmName}</span>
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAssignRole?.('pm');
            }}
            style={{
              border: '1px solid var(--pb-border)',
              background: '#fafaf9',
              color: 'var(--pb-text-muted)',
              fontSize: 11.5,
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PhosphorIcon name="plus" size={11} />
            <span>Assign PM</span>
          </div>
        )}

        <div
          onClick={(e) => {
            e.stopPropagation();
            onAssignRole?.('lead_engineer');
          }}
          style={{
            border: '1px solid var(--pb-border)',
            background: '#fafaf9',
            color: 'var(--pb-text-muted)',
            fontSize: 11.5,
            fontWeight: 600,
            padding: '6px 10px',
            borderRadius: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {dbLeadEng ? (
            <>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: dbLeadEng.avatarColor || '#3a63e0',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {dbLeadEng.initials}
              </div>
              <span>ENG · {dbLeadEng.name.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <PhosphorIcon name="plus" size={11} />
              <span>Assign Lead Eng</span>
            </>
          )}
        </div>
      </div>

      {/* Progress segmented bar */}
      <div
        style={{
          height: 5,
          borderRadius: 3,
          overflow: 'hidden',
          background: '#efeeea',
          display: 'flex',
        }}
      >
        {segments.map((s, idx) => (
          <div key={idx} style={{ width: `${s.w}%`, background: s.c }} />
        ))}
      </div>

      {/* Footer: Avatars and Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#3a63e0',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Syne', sans-serif",
              border: '2px solid #fff',
            }}
          >
            EA
          </div>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#e0508a',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Syne', sans-serif",
              border: '2px solid #fff',
              marginLeft: -8,
            }}
          >
            GA
          </div>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#7c5cf0',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Syne', sans-serif",
              border: '2px solid #fff',
              marginLeft: -8,
            }}
          >
            RO
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '1.5px dashed var(--pb-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--pb-text-faint)',
              marginLeft: -8,
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="plus" size={12} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pb-accent-green)' }}>{live}</div>
            <div style={{ fontSize: 10.5, color: 'var(--pb-text-faint)' }}>live</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pb-accent-orange)' }}>{flight}</div>
            <div style={{ fontSize: 10.5, color: 'var(--pb-text-faint)' }}>in flight</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pb-text)' }}>{total}</div>
            <div style={{ fontSize: 10.5, color: 'var(--pb-text-faint)' }}>total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
