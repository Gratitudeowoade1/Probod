import React, { useState } from 'react';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import {
  WorkspaceFeatureItem,
  WorkspaceTask,
  LayoutMode,
  PhaseKey,
  ProdBodStatus,
  UrgencyLevel,
  MoSCoWPriority,
  PHASE_META,
  PSTATUS_META,
  URGENCY_META,
  MOSCOW_META,
  CATEGORY_META,
  PHASE_ORDER,
} from '@/types/workspace';
import { CategoryChip, TagChip, AssigneeStack } from './Chips';

interface FeatureDetailPanelProps {
  feature: WorkspaceFeatureItem | null;
  selectedTaskId: string | null;
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onClose: () => void;
  onSelectTask: (taskId: string | null) => void;
  onUpdateFeature: (feature: Partial<WorkspaceFeatureItem> & { id: string }) => void;
  onUpdateTask: (task: Partial<WorkspaceTask> & { id: string; featureId: string }) => void;
  onAddTask: (featureId: string, title: string, category?: string) => void;
}

export function FeatureDetailPanel({
  feature,
  selectedTaskId,
  layoutMode,
  onLayoutModeChange,
  onClose,
  onSelectTask,
  onUpdateFeature,
  onUpdateTask,
  onAddTask,
}: FeatureDetailPanelProps) {
  const [layoutPopoverOpen, setLayoutPopoverOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTaskInput, setShowAddTaskInput] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [openLinkPreview, setOpenLinkPreview] = useState<string | null>(null);

  if (!feature) return null;

  const currentTask = selectedTaskId
    ? (feature.tasks || []).find((t) => t.id === selectedTaskId) || null
    : null;

  const isTaskView = !!currentTask;

  // Calculate progress pct based on tasks
  const tasks = feature.tasks || [];
  const completedTasks = tasks.filter((t) => t.pstatus === 'done').length;
  const progressPct =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : feature.pstatus === 'done'
      ? 100
      : 0;

  // Sprints rolled up from tasks
  const sprints = Array.from(new Set(tasks.map((t) => t.sprint).filter(Boolean))) as string[];

  // Outer container styling based on layoutMode
  const getPanelStyle = (): React.CSSProperties => {
    if (layoutMode === 'sidebar') {
      return {
        width: 660,
        minWidth: 660,
        borderLeft: '1px solid var(--pb-border)',
        background: '#ffffff',
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 40,
        position: 'relative',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.04)',
      };
    }
    if (layoutMode === 'fullscreen') {
      return {
        position: 'fixed',
        inset: 0,
        width: '100%',
        minWidth: '100%',
        height: '100vh',
        zIndex: 100,
        background: '#ffffff',
        overflowY: 'auto',
      };
    }
    // modal mode
    return {
      position: 'fixed',
      inset: 0,
      width: '100%',
      minWidth: '100%',
      height: '100vh',
      zIndex: 100,
      background: 'rgba(20,20,26,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    };
  };

  const getInnerStyle = (): React.CSSProperties => {
    if (layoutMode === 'fullscreen') {
      return {
        maxWidth: 900,
        margin: '0 auto',
        padding: '28px 32px 60px 32px',
        minHeight: '100%',
      };
    }
    if (layoutMode === 'modal') {
      return {
        width: 900,
        maxWidth: '92vw',
        maxHeight: '86vh',
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: 'var(--pb-shadow-lg)',
        padding: '26px 32px 44px 32px',
        overflowY: 'auto',
      };
    }
    // sidebar
    return {
      padding: '24px 30px 60px 30px',
      height: '100%',
      overflowY: 'auto',
    };
  };

  const renderLayoutSwatch = (mode: LayoutMode) => {
    if (mode === 'sidebar') {
      return (
        <div
          style={{
            width: 52,
            height: 38,
            borderRadius: 6,
            background: '#f3f2ef',
            border: '1px solid var(--pb-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '36%',
              background: 'var(--pb-accent-blue)',
              opacity: 0.85,
            }}
          />
        </div>
      );
    }
    if (mode === 'fullscreen') {
      return (
        <div
          style={{
            width: 52,
            height: 38,
            borderRadius: 6,
            background: '#f3f2ef',
            border: '1px solid var(--pb-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 3,
              background: 'var(--pb-accent-blue)',
              opacity: 0.85,
            }}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          width: 52,
          height: 38,
          borderRadius: 6,
          background: '#f3f2ef',
          border: '1px solid var(--pb-border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: 3,
            background: 'var(--pb-accent-blue)',
            opacity: 0.85,
          }}
        />
      </div>
    );
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newActivity = [
      ...(feature.activity || []),
      {
        id: 'act-' + Date.now(),
        type: 'comment' as const,
        who: 'Emmanuel A.',
        when: 'Just now',
        text: newCommentText.trim(),
      },
    ];
    onUpdateFeature({ id: feature.id, activity: newActivity });
    setNewCommentText('');
  };

  const handleToggleChecklist = (index: number) => {
    const list = isTaskView
      ? [...(currentTask?.checklist || [])]
      : [...(feature.checklist || [])];
    if (list[index]) {
      list[index] = { ...list[index], done: !list[index].done };
      if (isTaskView && currentTask) {
        onUpdateTask({ id: currentTask.id, featureId: feature.id, checklist: list });
      } else {
        onUpdateFeature({ id: feature.id, checklist: list });
      }
    }
  };

  const handleCreateChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const list = isTaskView
      ? [...(currentTask?.checklist || [])]
      : [...(feature.checklist || [])];
    list.push({ name: newChecklistText.trim(), done: false });
    if (isTaskView && currentTask) {
      onUpdateTask({ id: currentTask.id, featureId: feature.id, checklist: list });
    } else {
      onUpdateFeature({ id: feature.id, checklist: list });
    }
    setNewChecklistText('');
    setShowAddChecklist(false);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(feature.id, newTaskTitle.trim());
    setNewTaskTitle('');
    setShowAddTaskInput(false);
  };

  return (
    <aside style={getPanelStyle()} onClick={(e) => layoutMode === 'modal' && e.target === e.currentTarget && onClose()}>
      <div style={getInnerStyle()} onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 14,
            borderBottom: '1px solid var(--pb-border)',
            marginBottom: 18,
          }}
        >
          {/* Breadcrumbs */}
          <div
            style={{
              fontSize: 12.5,
              color: 'var(--pb-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isTaskView ? (
              <>
                <span
                  onClick={() => onSelectTask(null)}
                  style={{ color: 'var(--pb-accent-blue)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {feature.title}
                </span>
                <PhosphorIcon name="caretRight" size={10} />
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    background: '#f3f2ef',
                    color: 'var(--pb-text-muted)',
                    padding: '2px 7px',
                    borderRadius: 5,
                  }}
                >
                  {currentTask?.id}
                </span>
                <PhosphorIcon name="caretRight" size={10} />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--pb-text-faint)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                  }}
                >
                  Task
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    background: '#f3f2ef',
                    color: 'var(--pb-text-muted)',
                    padding: '2px 7px',
                    borderRadius: 5,
                  }}
                >
                  {feature.id}
                </span>
                <PhosphorIcon name="caretRight" size={10} />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--pb-text-faint)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                  }}
                >
                  Feature
                </span>
              </>
            )}
          </div>

          {/* Top Actions: Layout Switcher + Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <button
              onClick={() => setLayoutPopoverOpen((o) => !o)}
              title="Change layout mode"
              style={{
                border: '1px solid var(--pb-border)',
                background: '#fff',
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pb-text-muted)',
                cursor: 'pointer',
              }}
            >
              <PhosphorIcon name="sidebarSimple" size={16} />
            </button>

            {/* Layout Popover */}
            {layoutPopoverOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 38,
                  right: 0,
                  background: '#fff',
                  border: '1px solid var(--pb-border)',
                  borderRadius: 12,
                  boxShadow: 'var(--pb-shadow)',
                  padding: 12,
                  display: 'flex',
                  gap: 10,
                  zIndex: 120,
                }}
              >
                {(['modal', 'fullscreen', 'sidebar'] as LayoutMode[]).map((mode) => (
                  <div
                    key={mode}
                    onClick={() => {
                      onLayoutModeChange(mode);
                      setLayoutPopoverOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 10,
                      border:
                        layoutMode === mode
                          ? '1.5px solid var(--pb-accent-blue)'
                          : '1.5px solid transparent',
                      background: layoutMode === mode ? '#f2f6ff' : 'transparent',
                      width: 74,
                    }}
                  >
                    {renderLayoutSwatch(mode)}
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: layoutMode === mode ? 'var(--pb-text)' : 'var(--pb-text-muted)',
                      }}
                    >
                      {mode === 'modal' ? 'Modal' : mode === 'fullscreen' ? 'Full screen' : 'Sidebar'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              title="Close panel"
              style={{
                border: 'none',
                background: '#f3f2ef',
                width: 28,
                height: 28,
                borderRadius: 7,
                color: 'var(--pb-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <PhosphorIcon name="x" size={13} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: '14px 0 4px 0',
            lineHeight: 1.25,
            fontFamily: "'Syne', sans-serif",
            color: 'var(--pb-text)',
          }}
        >
          {isTaskView ? currentTask?.title : feature.title}
        </h2>

        {/* AI Hint */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#faf6ff',
            border: '1px solid #ece3fb',
            borderRadius: 12,
            padding: '11px 14px',
            fontSize: 12.5,
            color: 'var(--pb-text-muted)',
            margin: '16px 0',
          }}
        >
          <PhosphorIcon name="lightbulb" size={15} style={{ color: 'var(--pb-accent-purple)' }} />
          <span>
            Ask <b style={{ color: 'var(--pb-accent-purple)' }}>Brain²</b> for a presentation, document or prototype
          </span>
        </div>

        {/* Two-column Field Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            rowGap: 14,
            columnGap: 14,
            marginTop: 6,
          }}
        >
          {/* Phase */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="checkCircle" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Phase</span>
          </div>
          <div>
            <select
              value={isTaskView ? currentTask?.phase : feature.phase}
              onChange={(e) => {
                const newPhase = e.target.value as PhaseKey;
                if (isTaskView && currentTask) {
                  onUpdateTask({ id: currentTask.id, featureId: feature.id, phase: newPhase });
                } else {
                  onUpdateFeature({ id: feature.id, phase: newPhase });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                fontWeight: 600,
                padding: '5px 11px',
                borderRadius: 20,
                background: PHASE_META[isTaskView ? currentTask?.phase || 'idea' : feature.phase].bg,
                color: PHASE_META[isTaskView ? currentTask?.phase || 'idea' : feature.phase].color,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {PHASE_ORDER.map((pk) => (
                <option key={pk} value={pk}>
                  {PHASE_META[pk].label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="checkCircle" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Status</span>
          </div>
          <div>
            <select
              value={isTaskView ? currentTask?.pstatus : feature.pstatus}
              onChange={(e) => {
                const newStatus = e.target.value as ProdBodStatus;
                if (isTaskView && currentTask) {
                  onUpdateTask({ id: currentTask.id, featureId: feature.id, pstatus: newStatus });
                } else {
                  onUpdateFeature({ id: feature.id, pstatus: newStatus });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                fontWeight: 600,
                padding: '5px 11px',
                borderRadius: 20,
                background: PSTATUS_META[isTaskView ? currentTask?.pstatus || 'todo' : feature.pstatus].bg,
                color: PSTATUS_META[isTaskView ? currentTask?.pstatus || 'todo' : feature.pstatus].color,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Assignees */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="userCircle" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Assignees</span>
          </div>
          <div>
            <AssigneeStack assignees={isTaskView ? currentTask?.assignees || [] : feature.assignees || []} />
          </div>

          {/* Dates */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="calendar" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Dates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                border: '1px solid var(--pb-border)',
                borderRadius: 8,
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: 'var(--pb-text-muted)',
              }}
            >
              <PhosphorIcon name="calendar" size={13} />
              <span>{isTaskView ? currentTask?.startDate || 'Start date' : feature.startDate || 'Start date'}</span>
            </div>
            <span style={{ color: 'var(--pb-text-faint)' }}>→</span>
            <div
              style={{
                border: '1px solid var(--pb-border)',
                borderRadius: 8,
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: 'var(--pb-text-muted)',
              }}
            >
              <PhosphorIcon name="calendar" size={13} />
              <span>{isTaskView ? currentTask?.endDate || 'End date' : feature.endDate || 'End date'}</span>
            </div>
          </div>

          {/* Urgency */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="flag" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Urgency</span>
          </div>
          <div>
            <select
              value={isTaskView ? currentTask?.urgency || 'none' : feature.urgency || 'none'}
              onChange={(e) => {
                const newUrgency = e.target.value as UrgencyLevel;
                if (isTaskView && currentTask) {
                  onUpdateTask({ id: currentTask.id, featureId: feature.id, urgency: newUrgency });
                } else {
                  onUpdateFeature({ id: feature.id, urgency: newUrgency });
                }
              }}
              style={{
                border: '1px solid var(--pb-border)',
                background: '#fafaf9',
                color: 'var(--pb-text-muted)',
                fontSize: 12,
                fontWeight: 600,
                padding: '5px 10px',
                borderRadius: 20,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="none">— Clear</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Priority */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="flag" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Priority</span>
          </div>
          <div>
            <select
              value={isTaskView ? currentTask?.priority || 'none' : feature.priority || 'none'}
              onChange={(e) => {
                const newPriority = e.target.value as MoSCoWPriority;
                if (isTaskView && currentTask) {
                  onUpdateTask({ id: currentTask.id, featureId: feature.id, priority: newPriority });
                } else {
                  onUpdateFeature({ id: feature.id, priority: newPriority });
                }
              }}
              style={{
                border: '1px solid var(--pb-border)',
                background: '#fafaf9',
                color: 'var(--pb-text-muted)',
                fontSize: 12,
                fontWeight: 600,
                padding: '5px 10px',
                borderRadius: 20,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="none">— None</option>
              <option value="must">Must-Do</option>
              <option value="should">Should-Do</option>
              <option value="could">Could-Do</option>
              <option value="wont">Won't-Do</option>
            </select>
          </div>

          {/* Time Estimate */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="timer" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Time estimate</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--pb-text)', fontWeight: 500 }}>
            {isTaskView ? currentTask?.timeEstimate || 'Empty' : feature.timeEstimate || 'Empty'}
          </div>

          {/* Theme (if Feature) or Category (if Task) */}
          {isTaskView ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: 'var(--pb-text-muted)',
                  fontWeight: 500,
                  paddingTop: 3,
                }}
              >
                <PhosphorIcon name="stack" size={15} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Category</span>
              </div>
              <div>
                {currentTask?.category ? (
                  <CategoryChip category={currentTask.category} />
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--pb-text-faint)' }}>No category</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: 'var(--pb-text-muted)',
                  fontWeight: 500,
                  paddingTop: 3,
                }}
              >
                <PhosphorIcon name="stack" size={15} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Theme</span>
              </div>
              <div>
                {feature.theme ? (
                  <>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#f3ecff',
                        color: '#6b3fd6',
                        borderRadius: 20,
                        padding: '5px 11px 5px 8px',
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      <PhosphorIcon name="stack" size={12} />
                      <span>{feature.theme.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--pb-text-muted)', marginTop: 6, maxWidth: 360 }}>
                      {feature.theme.desc}
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>
                    No theme — this feature stands alone
                  </span>
                )}
              </div>
            </>
          )}

          {/* Objectives (if Feature) */}
          {!isTaskView && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: 'var(--pb-text-muted)',
                  fontWeight: 500,
                  paddingTop: 3,
                }}
              >
                <PhosphorIcon name="target" size={15} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Objectives</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(feature.objectives || []).length > 0 ? (
                  feature.objectives?.map((obj) => (
                    <div
                      key={obj.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#eaf6ff',
                        color: '#1a76b8',
                        borderRadius: 20,
                        padding: '5px 11px 5px 8px',
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      <PhosphorIcon name="target" size={12} />
                      <span>{obj.label}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>Not attached to an objective yet</span>
                )}
              </div>
            </>
          )}

          {/* Sprint */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="squaresFour" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Sprint</span>
          </div>
          <div>
            {isTaskView ? (
              currentTask?.sprint ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#f3f2ef',
                    border: '1px solid var(--pb-border)',
                    borderRadius: 8,
                    padding: '5px 10px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--pb-text)',
                  }}
                >
                  {currentTask.sprint}
                </div>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>Not in a sprint yet</span>
              )
            ) : sprints.length > 0 ? (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {sprints.map((sp) => (
                  <div
                    key={sp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#f3f2ef',
                      border: '1px solid var(--pb-border)',
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--pb-text)',
                    }}
                  >
                    {sp}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>No tasks assigned to a sprint yet</span>
            )}
          </div>

          {/* Sprint Points */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="target" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Sprint points</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--pb-text)', fontWeight: 500 }}>
            {isTaskView ? currentTask?.sprintPoints ?? 'Empty' : feature.sprintPoints ?? 'Empty'}
          </div>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--pb-text-muted)',
              fontWeight: 500,
              paddingTop: 3,
            }}
          >
            <PhosphorIcon name="link" size={15} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Tags</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {((isTaskView ? currentTask?.tags : feature.tags) || []).length > 0 ? (
              (isTaskView ? currentTask?.tags : feature.tags)?.map((t) => <TagChip key={t} tag={t} />)
            ) : (
              <span style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>No tags</span>
            )}
          </div>
        </div>

        {/* Section Divider */}
        <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 8 }}>Description</div>
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: 'var(--pb-text)',
            }}
          >
            {(isTaskView ? currentTask?.description : feature.description) || 'No description yet.'}
          </div>
        </div>

        {/* Progress Bar (Feature view only) */}
        {!isTaskView && (
          <>
            <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                Progress{' '}
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                  based on tasks completed
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 5,
                  background: '#f0efe9',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 5,
                    background: 'var(--pb-accent-green)',
                    width: `${progressPct}%`,
                    transition: 'width .3s ease',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--pb-text-muted)',
                  minWidth: 34,
                  textAlign: 'right',
                }}
              >
                {progressPct}%
              </div>
            </div>

            {/* Tasks section */}
            <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhosphorIcon name="listBullets" size={16} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Tasks</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                  {tasks.length} open
                </span>
              </div>
            </div>

            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  border: '1px solid var(--pb-border)',
                  borderRadius: 10,
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pb-row-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: PHASE_META[t.phase]?.color || '#8a8a92',
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {t.category && <CategoryChip category={t.category} />}
                  <AssigneeStack assignees={t.assignees} />
                </div>
              </div>
            ))}

            {showAddTaskInput ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--pb-border)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleCreateTask}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#17171c',
                    color: '#fff',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <div
                onClick={() => setShowAddTaskInput(true)}
                style={{
                  fontSize: 12.5,
                  color: 'var(--pb-text-faint)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '6px 2px',
                }}
              >
                <PhosphorIcon name="plus" size={13} />
                <span>Add task</span>
              </div>
            )}
          </>
        )}

        {/* Checklist */}
        <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
        {(() => {
          const list = isTaskView ? currentTask?.checklist || [] : feature.checklist || [];
          const doneCount = list.filter((c) => c.done).length;
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhosphorIcon name="checkCircle" size={16} style={{ color: 'var(--pb-text-faint)' }} />
                  <span>Checklist</span>
                  {list.length > 0 && (
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                      {doneCount}/{list.length}
                    </span>
                  )}
                </div>
              </div>

              {list.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 0',
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggleChecklist(idx)}
                    style={{ width: 15, height: 15, cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'var(--pb-text-faint)' : 'var(--pb-text)',
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              ))}

              {showAddChecklist ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    placeholder="Checklist item..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChecklistItem()}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--pb-border)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleCreateChecklistItem}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#17171c',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setShowAddChecklist(true)}
                  style={{
                    fontSize: 12.5,
                    color: 'var(--pb-text-faint)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    padding: '6px 2px',
                    marginTop: 4,
                  }}
                >
                  <PhosphorIcon name="plus" size={13} />
                  <span>Add checklist item</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Attachments */}
        <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
        {(() => {
          const files = isTaskView ? currentTask?.attachments || [] : feature.attachments || [];
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhosphorIcon name="paperclip" size={16} style={{ color: 'var(--pb-text-faint)' }} />
                  <span>Attachments</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                    {files.length}
                  </span>
                </div>
              </div>

              {files.map((f, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 10px',
                      border: '1px solid var(--pb-border)',
                      borderRadius: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#f3f2ef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--pb-text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      <PhosphorIcon
                        name={f.type === 'link' ? 'linkSimple' : f.type === 'image' ? 'imageSquare' : 'fileDoc'}
                        size={16}
                      />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--pb-text-faint)' }}>
                        {f.type.toUpperCase()}
                        {f.url ? ' · previewable link' : ''}
                      </div>
                    </div>
                    {f.url && (
                      <div
                        onClick={() => setOpenLinkPreview((prev) => (prev === f.name ? null : f.name))}
                        style={{
                          fontSize: 12,
                          color: 'var(--pb-accent-blue)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        Preview
                      </div>
                    )}
                  </div>
                  {f.url && openLinkPreview === f.name && (
                    <div
                      style={{
                        border: '1px solid var(--pb-border)',
                        borderRadius: 10,
                        padding: 10,
                        margin: '-4px 0 8px 0',
                        background: '#faf9f6',
                        fontSize: 12,
                        color: 'var(--pb-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <PhosphorIcon name="globe" size={12} />
                      <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pb-accent-blue)' }}>
                        {f.url}
                      </a>
                    </div>
                  )}
                </div>
              ))}

              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--pb-text-faint)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '6px 2px',
                }}
              >
                <PhosphorIcon name="plus" size={13} />
                <span>Attach file, image or link</span>
              </div>
            </div>
          );
        })()}

        {/* Test / QA (Feature view only) */}
        {!isTaskView && (
          <>
            <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhosphorIcon name="bug" size={16} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Test / QA</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                  {(feature.testCases || []).length} cases
                </span>
              </div>
            </div>

            {(feature.testCases || []).length > 0 ? (
              feature.testCases?.map((tc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    border: '1px solid var(--pb-border)',
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 20,
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      background:
                        tc.status === 'pass' ? '#e2f7ee' : tc.status === 'fail' ? '#fde8e5' : '#f3f2ef',
                      color:
                        tc.status === 'pass' ? '#0e8f5f' : tc.status === 'fail' ? '#e0503a' : '#8a8a92',
                    }}
                  >
                    {tc.status}
                  </span>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{tc.name}</div>
                  {tc.bug && (
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--pb-danger)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <PhosphorIcon name="bug" size={12} />
                      <span>{tc.bug}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>No test cases linked yet.</div>
            )}
          </>
        )}

        {/* Support Tickets (Feature view only) */}
        {!isTaskView && (
          <>
            <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhosphorIcon name="ticket" size={16} style={{ color: 'var(--pb-text-faint)' }} />
                <span>Support Tickets</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--pb-text-faint)' }}>
                  {(feature.tickets || []).length}
                </span>
              </div>
            </div>

            {(feature.tickets || []).length > 0 ? (
              feature.tickets?.map((tk, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    border: '1px solid var(--pb-border)',
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <PhosphorIcon name="ticket" size={16} style={{ color: 'var(--pb-accent-orange)', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{tk.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--pb-text-faint)', flexShrink: 0 }}>{tk.customer}</div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: 'var(--pb-text-muted)' }}>No customer tickets mapped to this feature.</div>
            )}
          </>
        )}

        {/* Related items */}
        <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <PhosphorIcon name="arrowsLeftRight" size={16} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Related items</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--pb-text-muted)', marginBottom: 10 }}>
            Link related Features, Tasks or Docs to keep dependencies traceable.
          </div>
          <button
            style={{
              border: '1px dashed var(--pb-border)',
              background: '#fff',
              color: 'var(--pb-text-faint)',
              fontSize: 12.5,
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              width: '100%',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="link" size={13} />
            <span>Relate a Feature, Task or Doc</span>
          </button>
        </div>

        {/* Activity & Comments */}
        <div style={{ height: 1, background: 'var(--pb-border)', margin: '24px 0' }} />
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <PhosphorIcon name="chatCircleText" size={16} style={{ color: 'var(--pb-text-faint)' }} />
            <span>Activity</span>
          </div>

          {(feature.activity || [
            { type: 'log', text: 'Feature created', who: 'Ayomide Osuntoye', when: '29 Sep 2025' },
          ]).map((act, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: act.type === 'comment' ? '#7c5cf0' : '#b7b6bd',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {(act.who || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--pb-text-faint)', marginBottom: 2 }}>
                  <b style={{ color: 'var(--pb-text)' }}>{act.who}</b> · {act.when}
                </div>
                {act.type === 'comment' ? (
                  <div
                    style={{
                      border: '1px solid var(--pb-border)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 13,
                      color: 'var(--pb-text)',
                      background: '#faf9f6',
                    }}
                  >
                    {act.text}
                  </div>
                ) : (
                  <div style={{ fontSize: 12.5, color: 'var(--pb-text-muted)' }}>{act.text}</div>
                )}
              </div>
            </div>
          ))}

          {/* Comment composer */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#b3245c',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              EA
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <textarea
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleAddComment();
                  }
                }}
                style={{
                  width: '100%',
                  border: '1px solid var(--pb-border)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 13,
                  resize: 'none',
                  height: 60,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {newCommentText.trim() && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleAddComment}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 7,
                      border: 'none',
                      background: '#17171c',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Post comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
