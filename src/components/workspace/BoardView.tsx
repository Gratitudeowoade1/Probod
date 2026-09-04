import React from 'react';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import {
  WorkspaceFeatureItem,
  WorkspaceTask,
  PhaseKey,
  PHASE_META,
  PHASE_ORDER,
} from '@/types/workspace';
import { CategoryChip, TagChip, AssigneeStack } from './Chips';

interface BoardViewProps {
  features: WorkspaceFeatureItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string, kind: 'feature' | 'task', parentFeatureId?: string) => void;
}

export function BoardView({ features, selectedItemId, onSelectItem }: BoardViewProps) {
  // Flatten features and tasks per phase
  const getItemsForPhase = (phaseKey: PhaseKey) => {
    const out: Array<{
      id: string;
      title: string;
      kind: 'feature' | 'task';
      category?: string;
      tags?: string[];
      assignees?: string[];
      endDate?: string | null;
      parentFeatureId?: string;
    }> = [];

    features
      .filter((f) => f.phase === phaseKey)
      .forEach((f) => {
        out.push({
          id: f.id,
          title: f.title,
          kind: 'feature',
          tags: f.tags,
          assignees: f.assignees,
          endDate: f.endDate,
        });

        (f.tasks || [])
          .filter((t) => t.phase === phaseKey)
          .forEach((t) => {
            out.push({
              id: t.id,
              title: t.title,
              kind: 'task',
              category: t.category,
              tags: t.tags,
              assignees: t.assignees,
              endDate: t.endDate,
              parentFeatureId: f.id,
            });
          });
      });

    return out;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 24px 40px 24px',
        overflowX: 'auto',
        background: 'var(--pb-bg-surface)',
        minHeight: 'calc(100vh - 140px)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {PHASE_ORDER.map((phaseKey) => {
        const meta = PHASE_META[phaseKey];
        const items = getItemsForPhase(phaseKey);

        return (
          <div
            key={phaseKey}
            style={{
              minWidth: 270,
              maxWidth: 270,
              background: '#faf9f7',
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Column Head */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
                padding: '0 4px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '5px 11px',
                  borderRadius: 20,
                  background: meta.bg,
                  color: meta.color,
                }}
              >
                <PhosphorIcon name={meta.icon} size={12} />
                <span>{meta.label}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--pb-text-faint)', fontWeight: 600 }}>
                {items.length}
              </div>
            </div>

            {/* Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
              {items.map((it) => {
                const isSelected = selectedItemId === it.id;
                return (
                  <div
                    key={it.id}
                    onClick={() => onSelectItem(it.id, it.kind, it.parentFeatureId)}
                    style={{
                      background: '#fff',
                      border: isSelected ? '1.5px solid var(--pb-accent-blue)' : '1px solid var(--pb-border)',
                      borderRadius: 10,
                      padding: 12,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      boxShadow: isSelected ? '0 0 0 2px rgba(76,125,240,0.15)' : 'none',
                      transition: 'box-shadow .15s, transform .12s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.06)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div style={{ color: 'var(--pb-text)', lineHeight: 1.4 }}>{it.title}</div>

                    {/* Tags / Category */}
                    {(it.category || (it.tags || []).length > 0) && (
                      <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                        {it.category && <CategoryChip category={it.category} />}
                        {(it.tags || []).map((t) => (
                          <TagChip key={t} tag={t} />
                        ))}
                      </div>
                    )}

                    {/* Footer: Assignees & Due Date */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}
                    >
                      <AssigneeStack assignees={it.assignees || []} />
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--pb-text-faint)',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {it.endDate && <PhosphorIcon name="calendar" size={11} />}
                        <span>{it.endDate || ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--pb-text-faint)',
                    border: '1px dashed var(--pb-border)',
                    borderRadius: 8,
                  }}
                >
                  No items in {meta.label}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
