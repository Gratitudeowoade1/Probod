import React, { useState } from 'react';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import {
  WorkspaceFeatureItem,
  WorkspaceTask,
  PhaseKey,
  PHASE_META,
  PHASE_ORDER,
  MOSCOW_META,
} from '@/types/workspace';
import { ProgressRing } from './ProgressRing';
import { CategoryChip, TagChip, PriorityCell, AssigneeStack } from './Chips';

interface ListViewProps {
  features: WorkspaceFeatureItem[];
  expandedFeatureIds: Set<string>;
  selectedItemId: string | null;
  onToggleExpand: (featureId: string) => void;
  onSelectItem: (id: string, kind: 'feature' | 'task', parentFeatureId?: string) => void;
  onAddFeatureToPhase: (phase: PhaseKey) => void;
}

export function ListView({
  features,
  expandedFeatureIds,
  selectedItemId,
  onToggleExpand,
  onSelectItem,
  onAddFeatureToPhase,
}: ListViewProps) {
  // Group features by phase
  const featuresByPhase = PHASE_ORDER.reduce<Record<PhaseKey, WorkspaceFeatureItem[]>>(
    (acc, key) => {
      acc[key] = features.filter((f) => f.phase === key);
      return acc;
    },
    {
      idea: [],
      discovery: [],
      proto: [],
      dev: [],
      qa: [],
      prodready: [],
      live: [],
    }
  );

  return (
    <div style={{ padding: '8px 30px 60px 30px', background: 'var(--pb-bg-surface)', fontFamily: "'DM Sans', sans-serif" }}>
      {PHASE_ORDER.map((phaseKey) => {
        const meta = PHASE_META[phaseKey];
        const phaseFeatures = featuresByPhase[phaseKey] || [];
        const count = phaseFeatures.length;

        return (
          <div key={phaseKey} style={{ marginTop: 22 }}>
            {/* Status group head */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  <PhosphorIcon name={meta.icon} size={13} />
                  <span>{meta.label}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--pb-text-faint)', fontWeight: 600 }}>
                  {count}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  title="Group options"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--pb-text-faint)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f2ef')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <PhosphorIcon name="dotsThree" size={15} />
                </button>
                <button
                  onClick={() => onAddFeatureToPhase(phaseKey)}
                  title={`Add ${meta.label} feature`}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--pb-text-faint)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f2ef')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <PhosphorIcon name="plus" size={14} />
                </button>
              </div>
            </div>

            {/* Row table */}
            <div style={{ borderTop: '1px solid var(--pb-border)' }}>
              {/* Head */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 110px 130px 110px',
                  padding: '8px 10px',
                  fontSize: 10.5,
                  letterSpacing: '.06em',
                  color: 'var(--pb-text-faint)',
                  fontWeight: 700,
                }}
              >
                <div>NAME</div>
                <div>ASSIGNEE</div>
                <div>DUE DATE</div>
                <div>PRIORITY</div>
              </div>

              {/* Feature Rows */}
              {phaseFeatures.map((feat) => {
                const isExpanded = expandedFeatureIds.has(feat.id);
                const hasTasks = (feat.tasks || []).length > 0;
                const isSelected = selectedItemId === feat.id;

                const completedCount = (feat.tasks || []).filter((t) => t.pstatus === 'done').length;
                const pct = hasTasks
                  ? Math.round((completedCount / (feat.tasks || []).length) * 100)
                  : feat.pstatus === 'done'
                  ? 100
                  : 0;

                return (
                  <React.Fragment key={feat.id}>
                    {/* Feature Row */}
                    <div
                      className="item-row"
                      onClick={() => onSelectItem(feat.id, 'feature')}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 110px 130px 110px',
                        alignItems: 'center',
                        padding: '9px 10px',
                        borderBottom: '1px solid #f1f0ec',
                        cursor: 'pointer',
                        borderLeft: isSelected ? '3px solid var(--pb-accent-blue)' : '3px solid transparent',
                        background: isSelected ? '#f6f8ff' : 'transparent',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--pb-row-hover)';
                        const gutter = e.currentTarget.querySelector('.row-gutter') as HTMLElement;
                        if (gutter) gutter.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                        const gutter = e.currentTarget.querySelector('.row-gutter') as HTMLElement;
                        if (gutter) gutter.style.opacity = '0';
                      }}
                    >
                      {/* Name body */}
                      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        <div
                          className="row-gutter"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: 38,
                            flexShrink: 0,
                            opacity: 0,
                            transition: 'opacity .12s',
                          }}
                        >
                          <span style={{ color: 'var(--pb-text-faint)', cursor: 'grab', display: 'flex' }}>
                            <PhosphorIcon name="dotsSixVertical" size={13} />
                          </span>
                          <input
                            type="checkbox"
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: 14, height: 14 }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            minWidth: 0,
                            flex: 1,
                            paddingLeft: 0,
                          }}
                        >
                          {hasTasks ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleExpand(feat.id);
                              }}
                              style={{
                                width: 14,
                                height: 14,
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--pb-text-faint)',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.12s',
                                cursor: 'pointer',
                              }}
                            >
                              <PhosphorIcon name="caretRight" size={11} />
                            </div>
                          ) : (
                            <div style={{ width: 14, height: 14, flexShrink: 0, visibility: 'hidden' }} />
                          )}

                          {hasTasks ? (
                            <ProgressRing pct={pct} color={meta.color} />
                          ) : (
                            <div
                              style={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: meta.color,
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: 13.5,
                              fontWeight: 500,
                              color: 'var(--pb-text)',
                            }}
                          >
                            {feat.title}
                          </span>

                          {(feat.tags || []).map((t) => (
                            <TagChip key={t} tag={t} />
                          ))}
                        </div>
                      </div>

                      {/* Assignee */}
                      <div>
                        <AssigneeStack assignees={feat.assignees} />
                      </div>

                      {/* Due Date */}
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          color: feat.endDate ? 'var(--pb-danger)' : 'var(--pb-text-faint)',
                        }}
                      >
                        {feat.endDate && <PhosphorIcon name="calendar" size={12} />}
                        <span>{feat.endDate || '—'}</span>
                      </div>

                      {/* Priority */}
                      <div>
                        <PriorityCell priority={feat.priority} />
                      </div>
                    </div>

                    {/* Nested Task Rows */}
                    {hasTasks &&
                      isExpanded &&
                      feat.tasks?.map((task) => {
                        const isTaskSelected = selectedItemId === task.id;
                        return (
                          <div
                            key={task.id}
                            className="item-row"
                            onClick={() => onSelectItem(task.id, 'task', feat.id)}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 110px 130px 110px',
                              alignItems: 'center',
                              padding: '9px 10px',
                              borderBottom: '1px solid #f1f0ec',
                              cursor: 'pointer',
                              borderLeft: isTaskSelected
                                ? '3px solid var(--pb-accent-blue)'
                                : '3px solid transparent',
                              background: isTaskSelected ? '#f6f8ff' : 'transparent',
                              transition: 'background 0.12s',
                            }}
                            onMouseEnter={(e) => {
                              if (!isTaskSelected) e.currentTarget.style.background = 'var(--pb-row-hover)';
                              const gutter = e.currentTarget.querySelector('.row-gutter') as HTMLElement;
                              if (gutter) gutter.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              if (!isTaskSelected) e.currentTarget.style.background = 'transparent';
                              const gutter = e.currentTarget.querySelector('.row-gutter') as HTMLElement;
                              if (gutter) gutter.style.opacity = '0';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                              <div
                                className="row-gutter"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  width: 38,
                                  flexShrink: 0,
                                  opacity: 0,
                                  transition: 'opacity .12s',
                                }}
                              >
                                <span style={{ color: 'var(--pb-text-faint)', cursor: 'grab', display: 'flex' }}>
                                  <PhosphorIcon name="dotsSixVertical" size={13} />
                                </span>
                                <input
                                  type="checkbox"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ width: 14, height: 14 }}
                                />
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  minWidth: 0,
                                  flex: 1,
                                  paddingLeft: 22,
                                }}
                              >
                                <div style={{ width: 14, height: 14, flexShrink: 0, visibility: 'hidden' }} />
                                <div
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: meta.color,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: 13.5,
                                    fontWeight: 500,
                                    color: 'var(--pb-text)',
                                  }}
                                >
                                  {task.title}
                                </span>
                                {task.category && <CategoryChip category={task.category} />}
                                {(task.tags || []).map((t) => (
                                  <TagChip key={t} tag={t} />
                                ))}
                              </div>
                            </div>

                            {/* Assignee */}
                            <div>
                              <AssigneeStack assignees={task.assignees} />
                            </div>

                            {/* Due Date */}
                            <div
                              style={{
                                fontSize: 12.5,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                color: task.endDate ? 'var(--pb-danger)' : 'var(--pb-text-faint)',
                              }}
                            >
                              {task.endDate && <PhosphorIcon name="calendar" size={12} />}
                              <span>{task.endDate || '—'}</span>
                            </div>

                            {/* Priority */}
                            <div>
                              <PriorityCell priority={task.priority} />
                            </div>
                          </div>
                        );
                      })}
                  </React.Fragment>
                );
              })}

              {/* Add feature inline row */}
              <div
                onClick={() => onAddFeatureToPhase(phaseKey)}
                style={{
                  padding: '10px 10px 10px 48px',
                  fontSize: 13,
                  color: 'var(--pb-text-faint)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pb-text-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pb-text-faint)')}
              >
                <PhosphorIcon name="plus" size={12} />
                <span>Add {meta.label} feature</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
