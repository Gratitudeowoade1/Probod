// ─────────────────────────────────────────────────────────────────────────────
// ProdBod Workspace & Prototype Types
// ─────────────────────────────────────────────────────────────────────────────

export type PhaseKey = 'idea' | 'discovery' | 'proto' | 'dev' | 'qa' | 'prodready' | 'live';
export type ProdBodStatus = 'todo' | 'inprogress' | 'inreview' | 'done';
export type UrgencyLevel = 'urgent' | 'high' | 'normal' | 'low' | 'none';
export type MoSCoWPriority = 'must' | 'should' | 'could' | 'wont' | 'none';
export type LayoutMode = 'sidebar' | 'fullscreen' | 'modal';

export type TaskCategory =
  | 'API'
  | 'UI'
  | 'Integration'
  | 'Prototype'
  | 'Design'
  | 'Document'
  | 'Marketing'
  | 'Analytics'
  | 'Discovery'
  | 'Research'
  | 'Collaboration'
  | 'Learning';

export interface PhaseMeta {
  key: PhaseKey;
  label: string;
  color: string;
  bg: string;
  icon: string;
}

export const PHASE_META: Record<PhaseKey, PhaseMeta> = {
  idea:      { key: 'idea',      label: 'Idea / Problem', color: '#7c5cf0', bg: '#efe9fe', icon: 'lightbulb' },
  discovery: { key: 'discovery', label: 'Discovery',      color: '#17b3c7', bg: '#e3f6f9', icon: 'magnifyingGlass' },
  proto:     { key: 'proto',     label: 'Prototyping',    color: '#f0923c', bg: '#fdece0', icon: 'flask' },
  dev:       { key: 'dev',       label: 'In Development', color: '#4c7df0', bg: '#e9eefd', icon: 'codeSimple' },
  qa:        { key: 'qa',        label: 'QA / In Testing',color: '#c0389a', bg: '#fbe6f4', icon: 'bug' },
  prodready: { key: 'prodready', label: 'Prod Ready',     color: '#0e8f5f', bg: '#e2f7ee', icon: 'checkCircle' },
  live:      { key: 'live',      label: 'Live',            color: '#2fa86b', bg: '#e2f7ee', icon: 'globe' },
};

export const PHASE_ORDER: PhaseKey[] = ['idea', 'discovery', 'proto', 'dev', 'qa', 'prodready', 'live'];

export interface PStatusMeta {
  label: string;
  color: string;
  bg: string;
}

export const PSTATUS_META: Record<ProdBodStatus, PStatusMeta> = {
  todo:       { label: 'Todo',        color: '#8a8a92', bg: '#f3f2ef' },
  inprogress: { label: 'In Progress', color: '#3a63e0', bg: '#e9eefd' },
  inreview:   { label: 'In Review',   color: '#d9971f', bg: '#fdf1de' },
  done:       { label: 'Done',        color: '#2fa86b', bg: '#e2f7ee' },
};

export interface UrgencyMeta {
  label: string;
  color: string | null;
}

export const URGENCY_META: Record<UrgencyLevel, UrgencyMeta> = {
  urgent: { label: 'Urgent', color: '#e0503a' },
  high:   { label: 'High',   color: '#d9971f' },
  normal: { label: 'Normal', color: '#3a63e0' },
  low:    { label: 'Low',    color: '#8a8a92' },
  none:   { label: '—',      color: null },
};

export interface MoSCoWMeta {
  label: string;
  color: string | null;
}

export const MOSCOW_META: Record<MoSCoWPriority, MoSCoWMeta> = {
  must:   { label: 'Must-Do',   color: '#e0503a' },
  should: { label: 'Should-Do', color: '#d9971f' },
  could:  { label: 'Could-Do',  color: '#3a63e0' },
  wont:   { label: "Won't-Do",  color: '#8a8a92' },
  none:   { label: '—',         color: null },
};

export const CATEGORY_META: Record<string, { color: string; bg: string }> = {
  API:           { color: '#5b3ec9', bg: '#efe9fe' },
  UI:            { color: '#c0389a', bg: '#fbe6f4' },
  Integration:   { color: '#1f6fd6', bg: '#e6f0ff' },
  Prototype:     { color: '#c85f1f', bg: '#fdece0' },
  Design:        { color: '#0e8fa3', bg: '#e3f6f9' },
  Document:      { color: '#8a6d10', bg: '#fdf1de' },
  Marketing:     { color: '#c9316b', bg: '#fde8f0' },
  Analytics:     { color: '#3a63e0', bg: '#e9eefd' },
  Discovery:     { color: '#17b3c7', bg: '#e3f6f9' },
  Research:      { color: '#2fa86b', bg: '#e2f7ee' },
  Collaboration: { color: '#5b8ac9', bg: '#eaf3ff' },
  Learning:      { color: '#7a9c2e', bg: '#f0f6e2' },
};

export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  audit:         { bg: '#e6f0ff', text: '#3a63e0' },
  ai:            { bg: '#e3f6f9', text: '#0e8fa3' },
  core:          { bg: '#efe9fe', text: '#7c5cf0' },
  enhancement:   { bg: '#fdf1de', text: '#b8790f' },
  alerts:        { bg: '#fde8e5', text: '#e0503a' },
  'high-impact': { bg: '#fdece0', text: '#c85f1f' },
};

export interface AssigneeUser {
  id: string;
  code: string;
  name: string;
  color: string;
  email?: string;
}

export interface ChecklistItem {
  id?: string;
  name: string;
  done: boolean;
  feature_id?: string;
  task_id?: string;
}

export interface AttachmentItem {
  id?: string;
  name: string;
  type: 'doc' | 'image' | 'link';
  url?: string;
  created_at?: string;
}

export interface TestCaseItem {
  id?: string;
  name: string;
  status: 'pass' | 'fail' | 'pending';
  bug?: string | null;
}

export interface SupportTicketItem {
  id?: string;
  ticket_id_code: string;
  title: string;
  customer: string;
  status: string;
}

export interface RelatedItem {
  id?: string;
  related_type: 'feature' | 'task' | 'doc';
  related_id?: string;
  related_title: string;
}

export interface ActivityItem {
  id?: string;
  type: 'log' | 'comment';
  who: string;
  when: string;
  text: string;
  avatarColor?: string;
}

export interface WorkspaceTask {
  id: string;
  featureId: string;
  kind: 'task';
  title: string;
  description?: string;
  category?: TaskCategory | string;
  phase: PhaseKey;
  pstatus: ProdBodStatus;
  urgency: UrgencyLevel;
  priority: MoSCoWPriority;
  assignees: string[]; // array of user IDs or codes
  startDate?: string | null;
  endDate?: string | null;
  timeEstimate?: string | null;
  sprint?: string | null;
  sprintPoints?: number | null;
  tags?: string[];
  checklist?: ChecklistItem[];
  attachments?: AttachmentItem[];
  relatedItems?: RelatedItem[];
  activity?: ActivityItem[];
  position?: number;
}

export interface WorkspaceFeatureItem {
  id: string;
  productId: string;
  kind: 'feature';
  title: string;
  description?: string;
  phase: PhaseKey;
  pstatus: ProdBodStatus;
  urgency: UrgencyLevel;
  priority: MoSCoWPriority;
  assignees: string[];
  startDate?: string | null;
  endDate?: string | null;
  timeEstimate?: string | null;
  sprintPoints?: number | null;
  themeId?: string | null;
  theme?: { id: string; label: string; desc: string } | null;
  objectives?: Array<{ id: string; label: string }>;
  tags?: string[];
  checklist?: ChecklistItem[];
  attachments?: AttachmentItem[];
  testCases?: TestCaseItem[];
  tickets?: SupportTicketItem[];
  relatedItems?: RelatedItem[];
  activity?: ActivityItem[];
  tasks?: WorkspaceTask[];
  isStarred?: boolean;
  position?: number;
}
