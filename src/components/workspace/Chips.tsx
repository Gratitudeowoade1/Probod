import React from 'react';
import {
  CATEGORY_META,
  TAG_COLORS,
  MoSCoWPriority,
  MOSCOW_META,
  MoSCoWMeta,
  UrgencyLevel,
  URGENCY_META,
  UrgencyMeta,
} from '@/types/workspace';
import PhosphorIcon from '@/components/icons/PhosphorIcons';

const DEFAULT_MOSCOW_META: MoSCoWMeta = { label: '—', color: null };
const DEFAULT_URGENCY_META: UrgencyMeta = { label: '—', color: null };

export function normalizePriority(p?: string | null): MoSCoWMeta {
  if (!p) return MOSCOW_META?.none || DEFAULT_MOSCOW_META;
  const key = String(p).toLowerCase().trim();
  if (key === 'must' || key === 'critical' || key === 'urgent') return MOSCOW_META?.must || { label: 'Must-Do', color: '#e0503a' };
  if (key === 'should' || key === 'high') return MOSCOW_META?.should || { label: 'Should-Do', color: '#d9971f' };
  if (key === 'could' || key === 'medium' || key === 'normal') return MOSCOW_META?.could || { label: 'Could-Do', color: '#3a63e0' };
  if (key === 'wont' || key === "won't" || key === 'low') return MOSCOW_META?.wont || { label: "Won't-Do", color: '#8a8a92' };
  if (MOSCOW_META && key in MOSCOW_META) return MOSCOW_META[key as MoSCoWPriority] || DEFAULT_MOSCOW_META;
  return MOSCOW_META?.none || DEFAULT_MOSCOW_META;
}

export function normalizeUrgency(u?: string | null): UrgencyMeta {
  if (!u) return URGENCY_META?.none || DEFAULT_URGENCY_META;
  const key = String(u).toLowerCase().trim();
  if (URGENCY_META && key in URGENCY_META) return URGENCY_META[key as UrgencyLevel] || DEFAULT_URGENCY_META;
  if (key === 'critical' || key === 'must') return URGENCY_META?.urgent || { label: 'Urgent', color: '#e0503a' };
  if (key === 'high') return URGENCY_META?.high || { label: 'High', color: '#d9971f' };
  if (key === 'medium' || key === 'normal') return URGENCY_META?.normal || { label: 'Normal', color: '#3a63e0' };
  if (key === 'low') return URGENCY_META?.low || { label: 'Low', color: '#8a8a92' };
  return URGENCY_META?.none || DEFAULT_URGENCY_META;
}

export function CategoryChip({ category }: { category?: string | null }) {
  if (!category) return null;
  const meta = (CATEGORY_META && CATEGORY_META[category]) || { color: '#8a8a92', bg: '#f3f2ef' };
  return (
    <span
      style={{
        fontSize: 9.5,
        fontWeight: 800,
        padding: '3px 7px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '.03em',
        background: meta?.bg || '#f3f2ef',
        color: meta?.color || '#8a8a92',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {category}
    </span>
  );
}

export function TagChip({ tag }: { tag?: string | null }) {
  if (!tag) return null;
  const c = (TAG_COLORS && TAG_COLORS[tag.toLowerCase()]) || { bg: '#f3f2ef', text: '#8a8a92' };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 12,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        background: c?.bg || '#f3f2ef',
        color: c?.text || '#8a8a92',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {tag}
    </span>
  );
}

export function PriorityCell({ priority }: { priority?: MoSCoWPriority | string | null }) {
  const pr = normalizePriority(priority) || DEFAULT_MOSCOW_META;
  const hasColor = Boolean(pr && pr.color);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: hasColor ? 700 : 400,
        color: hasColor ? 'var(--pb-text)' : 'var(--pb-text-faint)',
      }}
    >
      {hasColor && pr.color && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: pr.color,
            flexShrink: 0,
          }}
        />
      )}
      <span>{pr?.label || '—'}</span>
    </div>
  );
}

export function AssigneeStack({ assignees = [] }: { assignees?: string[] | null }) {
  const ASSIGNEE_COLORS: Record<string, { code: string; color: string }> = {
    CH: { code: 'CH', color: '#1596a6' },
    GB: { code: 'GB', color: '#2fa86b' },
    ST: { code: 'ST', color: '#1596a6' },
    EA: { code: 'EA', color: '#3a63e0' },
  };

  const list = assignees || [];

  if (list.length === 0) {
    return (
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1.5px dashed var(--pb-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--pb-text-faint)',
          background: '#fff',
        }}
      >
        <PhosphorIcon name="plus" size={11} />
      </div>
    );
  }

  const shown = list.slice(0, 2);
  const extra = list.length - shown.length;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((code, idx) => {
        const info = ASSIGNEE_COLORS[code] || {
          code: (code || 'U').slice(0, 2).toUpperCase(),
          color: '#3a63e0',
        };
        return (
          <div
            key={idx}
            style={{
              width: 23,
              height: 23,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 9.5,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              border: '1.5px solid #fff',
              background: info.color,
              marginLeft: idx === 0 ? 0 : -7,
            }}
          >
            {info.code}
          </div>
        );
      })}
      {extra > 0 && (
        <div
          style={{
            width: 23,
            height: 23,
            borderRadius: '50%',
            background: '#e9e8e3',
            color: 'var(--pb-text-muted)',
            fontSize: 9,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -7,
            border: '1.5px solid #fff',
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
