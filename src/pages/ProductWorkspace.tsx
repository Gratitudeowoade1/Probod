import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhosphorIcon from '@/components/icons/PhosphorIcons';
import { useApp } from '@/contexts/AppContext';
import { useMyOrgs } from '@/hooks/useProdbodOrgs';
import { useOrgProducts } from '@/hooks/useProdbodProducts';
import {
  useWorkspaceFeaturesRedesign,
  useCreateFeatureRedesign,
  useUpdateFeatureRedesign,
} from '@/hooks/useWorkspaceFeaturesRedesign';
import {
  useCreateWorkspaceTask,
  useUpdateWorkspaceTask,
} from '@/hooks/useWorkspaceTasks';
import { ListView } from '@/components/workspace/ListView';
import { BoardView } from '@/components/workspace/BoardView';
import { FeatureDetailPanel } from '@/components/workspace/FeatureDetailPanel';
import { PhaseKey, LayoutMode, WorkspaceFeatureItem, WorkspaceTask } from '@/types/workspace';

export default function ProductWorkspace() {
  const { productId = 'regcomply' } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { currentOrgId } = useApp();
  const { data: orgs = [] } = useMyOrgs();
  const { data: products = [] } = useOrgProducts(currentOrgId);

  const { data: features = [], isLoading: featuresLoading } = useWorkspaceFeaturesRedesign(productId);
  const createFeatureMutation = useCreateFeatureRedesign();
  const updateFeatureMutation = useUpdateFeatureRedesign();
  const createTaskMutation = useCreateWorkspaceTask();
  const updateTaskMutation = useUpdateWorkspaceTask();

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [isStarred, setIsStarred] = useState(false);
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(
    new Set(['FT-1001', 'FT-1002', 'FT-1003'])
  );

  // Selected item for detail panel
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('sidebar');

  // New Feature modal/dialog
  const [showNewFeatureModal, setShowNewFeatureModal] = useState(false);
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeaturePhase, setNewFeaturePhase] = useState<PhaseKey>('idea');

  const currentOrg = orgs.find((o) => o.id === currentOrgId) || { name: 'RegTech365' };
  const currentProduct = products.find((p) => p.id === productId) || {
    name: productId.toLowerCase().includes('learn')
      ? 'RegLearn'
      : productId.toLowerCase().includes('port')
      ? 'RegPort'
      : 'RegComply',
  };

  const handleToggleExpand = (featureId: string) => {
    setExpandedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) next.delete(featureId);
      else next.add(featureId);
      return next;
    });
  };

  const handleSelectItem = (id: string, kind: 'feature' | 'task', parentFeatureId?: string) => {
    if (kind === 'feature') {
      setSelectedFeatureId(id);
      setSelectedTaskId(null);
    } else {
      setSelectedFeatureId(parentFeatureId || null);
      setSelectedTaskId(id);
    }
  };

  const handleOpenAddFeature = (phase: PhaseKey = 'idea') => {
    setNewFeaturePhase(phase);
    setNewFeatureTitle('');
    setShowNewFeatureModal(true);
  };

  const handleCreateFeatureSubmit = async () => {
    if (!newFeatureTitle.trim()) return;
    await createFeatureMutation.mutateAsync({
      productId,
      title: newFeatureTitle.trim(),
      phase: newFeaturePhase,
      pstatus: 'todo',
    });
    setShowNewFeatureModal(false);
    setNewFeatureTitle('');
  };

  const handleAddTask = async (featureId: string, title: string, category: string = 'UI') => {
    await createTaskMutation.mutateAsync({
      featureId,
      title,
      category,
      phase: 'idea',
      pstatus: 'todo',
    });
  };

  const activeFeature = features.find((f) => f.id === selectedFeatureId) || null;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--pb-bg-surface)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Main Backlog / Board Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          minWidth: 0,
          background: 'var(--pb-bg-surface)',
        }}
      >
        {/* Header Top Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 30px 10px 30px',
            background: 'var(--pb-bg-surface)',
          }}
        >
          {/* Breadcrumb + Star */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 14, color: 'var(--pb-text-muted)' }}>
              <span>{currentOrg.name}</span>
              <span style={{ margin: '0 6px', color: 'var(--pb-text-faint)' }}>/</span>
              <span>{currentProduct.name}</span>
              <span style={{ margin: '0 6px', color: 'var(--pb-text-faint)' }}>/</span>
              <b style={{ color: 'var(--pb-text)', fontWeight: 700 }}>Backlog</b>
            </div>

            <button
              onClick={() => setIsStarred((prev) => !prev)}
              title="Star product"
              style={{
                border: 'none',
                background: 'transparent',
                color: isStarred ? 'var(--pb-priority-medium)' : 'var(--pb-text-faint)',
                display: 'flex',
                padding: 4,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isStarred) e.currentTarget.style.color = 'var(--pb-priority-medium)';
              }}
              onMouseLeave={(e) => {
                if (!isStarred) e.currentTarget.style.color = 'var(--pb-text-faint)';
              }}
            >
              <PhosphorIcon name="star" size={15} />
            </button>
          </div>

          {/* Share button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              style={{
                border: '1px solid var(--pb-border)',
                background: '#fff',
                color: 'var(--pb-text)',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '7px 13px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <PhosphorIcon name="userCircle" size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* View Tabs Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '0 30px',
            background: 'var(--pb-bg-surface)',
            borderBottom: '1px solid var(--pb-border)',
          }}
        >
          <button
            onClick={() => setViewMode('list')}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: viewMode === 'list' ? 'var(--pb-text)' : 'var(--pb-text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              borderBottom: viewMode === 'list' ? '2px solid #17171c' : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="listBullets" size={14} />
            <span>List</span>
          </button>

          <button
            onClick={() => setViewMode('board')}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: viewMode === 'board' ? 'var(--pb-text)' : 'var(--pb-text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              borderBottom: viewMode === 'board' ? '2px solid #17171c' : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="squaresFour" size={14} />
            <span>Board</span>
          </button>

          <button
            disabled
            title="Coming soon"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--pb-text-faint)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'default',
            }}
          >
            <PhosphorIcon name="trendUp" size={14} />
            <span>Weekly Delivery</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: '#f3f2ef',
                color: 'var(--pb-text-faint)',
                padding: '2px 6px',
                borderRadius: 8,
                letterSpacing: '.03em',
              }}
            >
              Soon
            </span>
          </button>

          <button
            disabled
            title="Coming soon"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--pb-text-faint)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'default',
            }}
          >
            <PhosphorIcon name="mapTrifold" size={14} />
            <span>Roadmap</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: '#f3f2ef',
                color: 'var(--pb-text-faint)',
                padding: '2px 6px',
                borderRadius: 8,
                letterSpacing: '.03em',
              }}
            >
              Soon
            </span>
          </button>

          <button
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 10px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--pb-text-faint)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="plus" size={13} />
            <span>View</span>
          </button>
        </div>

        {/* Toolbar Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            background: 'var(--pb-bg-surface)',
            borderBottom: '1px solid var(--pb-border)',
          }}
        >
          <button
            style={{
              border: '1px solid var(--pb-border)',
              background: '#fafaf9',
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--pb-text-muted)',
              padding: '6px 12px',
              borderRadius: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <PhosphorIcon name="squaresFour" size={13} />
            <span>Grouped by Phase</span>
            <PhosphorIcon name="caretDown" size={11} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              title="Search"
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
              <PhosphorIcon name="magnifyingGlass" size={15} />
            </button>
            <button
              title="Filter"
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
              <PhosphorIcon name="funnel" size={15} />
            </button>
            <button
              title="Settings"
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
              <PhosphorIcon name="gearSix" size={15} />
            </button>
            <button
              onClick={() => handleOpenAddFeature('idea')}
              style={{
                background: '#17171c',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
              }}
            >
              <span style={{ color: 'var(--pb-accent-yellow)' }}>
                <PhosphorIcon name="plus" size={14} />
              </span>
              <span>Feature</span>
            </button>
          </div>
        </div>

        {/* View Mode content */}
        {viewMode === 'list' ? (
          <ListView
            features={features}
            expandedFeatureIds={expandedFeatureIds}
            selectedItemId={selectedTaskId || selectedFeatureId}
            onToggleExpand={handleToggleExpand}
            onSelectItem={handleSelectItem}
            onAddFeatureToPhase={handleOpenAddFeature}
          />
        ) : (
          <BoardView
            features={features}
            selectedItemId={selectedTaskId || selectedFeatureId}
            onSelectItem={handleSelectItem}
          />
        )}
      </div>

      {/* 3-Mode Detail Panel */}
      {selectedFeatureId && activeFeature && (
        <FeatureDetailPanel
          feature={activeFeature}
          selectedTaskId={selectedTaskId}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
          onClose={() => {
            setSelectedFeatureId(null);
            setSelectedTaskId(null);
          }}
          onSelectTask={setSelectedTaskId}
          onUpdateFeature={(feat) => updateFeatureMutation.mutate({ ...feat, productId })}
          onUpdateTask={(task) => updateTaskMutation.mutate(task)}
          onAddTask={handleAddTask}
        />
      )}

      {/* Create Feature Modal */}
      {showNewFeatureModal && (
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
          onClick={(e) => e.target === e.currentTarget && setShowNewFeatureModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--pb-border)',
              borderRadius: 'var(--pb-radius-lg)',
              width: '100%',
              maxWidth: 480,
              boxShadow: 'var(--pb-shadow-lg)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "'Syne', sans-serif" }}>
                Add New Feature
              </h3>
              <button
                onClick={() => setShowNewFeatureModal(false)}
                style={{
                  border: 'none',
                  background: '#f3f2ef',
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pb-text-muted)',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--pb-text-muted)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  Feature Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Risk Management Module"
                  value={newFeatureTitle}
                  onChange={(e) => setNewFeatureTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFeatureSubmit()}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--pb-border)',
                    fontSize: 13.5,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
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
                    textTransform: 'uppercase',
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  Lifecycle Phase
                </label>
                <select
                  value={newFeaturePhase}
                  onChange={(e) => setNewFeaturePhase(e.target.value as PhaseKey)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--pb-border)',
                    fontSize: 13,
                    outline: 'none',
                    background: '#fff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="idea">Idea / Problem</option>
                  <option value="discovery">Discovery</option>
                  <option value="proto">Prototyping</option>
                  <option value="dev">In Development</option>
                  <option value="qa">QA / In Testing</option>
                  <option value="prodready">Prod Ready</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button
                onClick={() => setShowNewFeatureModal(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--pb-border)',
                  background: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--pb-text-muted)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFeatureSubmit}
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#17171c',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Create Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
