import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceFeatureItem, PhaseKey, ProdBodStatus, MoSCoWPriority, UrgencyLevel } from '@/types/workspace';

// Prototype reference fallback data for immediate rich initial experience if database is empty
export const PROTOTYPE_SEED_DATA: Record<string, WorkspaceFeatureItem[]> = {
  regcomply: [
    {
      id: 'FT-1001',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Risk Management',
      phase: 'idea',
      pstatus: 'inprogress',
      urgency: 'none',
      priority: 'must',
      assignees: ['CH'],
      startDate: '17/04/2026',
      endDate: '15/05/2026',
      timeEstimate: '5d',
      sprintPoints: 8,
      theme: {
        id: 'theme-1',
        label: 'Risk Framework Modernization',
        desc: 'Consolidating and modernizing how risk is assessed, scored and tracked across RegComply.',
      },
      objectives: [{ id: 'obj1', label: 'Reduce audit turnaround time by 30%' }],
      tags: ['core'],
      description: 'Central module for admins to manage the organisation-wide risk register: assess risk, assign owners, and track remediation across every RegComply workspace.',
      checklist: [
        { name: 'Define risk scoring model', done: true },
        { name: 'Wire risk register to audit findings', done: true },
        { name: 'Build reopen/close workflow', done: false },
        { name: 'QA sign-off', done: false },
      ],
      attachments: [
        { type: 'doc', name: 'Risk Scoring Model v2.docx' },
        { type: 'link', name: 'Figma — Risk Register flows', url: 'https://figma.com/file/risk-register' },
      ],
      testCases: [
        { name: 'Reopening a closed risk re-triggers alerts', status: 'pass' },
        { name: 'Risk owner reassignment persists across sessions', status: 'fail', bug: 'BUG-341' },
      ],
      tickets: [],
      tasks: [
        {
          id: 'TK-2101',
          featureId: 'FT-1001',
          kind: 'task',
          title: 'AI implementation for reopening closed risk and suggest new and effective control',
          category: 'AI',
          phase: 'idea',
          pstatus: 'inprogress',
          urgency: 'high',
          priority: 'should',
          assignees: ['GB'],
          startDate: '20/04/2026',
          endDate: '10/05/2026',
          timeEstimate: '3d',
          sprint: 'Sprint 12',
          sprintPoints: 5,
          tags: ['ai', 'high-impact'],
          description: 'Use the historical control library to suggest a replacement control whenever a previously-closed risk is reopened, instead of leaving the field blank.',
          checklist: [{ name: 'Prompt design', done: true }, { name: 'Suggest-control endpoint', done: false }],
          attachments: [],
        },
        {
          id: 'TK-2102',
          featureId: 'FT-1001',
          kind: 'task',
          title: 'Optimize bulk upload template',
          category: 'Document',
          phase: 'idea',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'could',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 2,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2103',
          featureId: 'FT-1001',
          kind: 'task',
          title: 'Bulk delete',
          category: 'UI',
          phase: 'idea',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'could',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 1,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2104',
          featureId: 'FT-1001',
          kind: 'task',
          title: 'Set up task management workflow for risk remediation',
          category: 'Integration',
          phase: 'idea',
          pstatus: 'todo',
          urgency: 'high',
          priority: 'should',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: 'Sprint 13',
          sprintPoints: 5,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
      ],
    },
    {
      id: 'FT-1002',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Critical risk alert from audit management',
      phase: 'idea',
      pstatus: 'todo',
      urgency: 'none',
      priority: 'none',
      assignees: [],
      startDate: null,
      endDate: null,
      timeEstimate: null,
      sprintPoints: 3,
      theme: null,
      objectives: [],
      tags: ['alerts'],
      description: 'Surface audit gaps directly as risks on the risk register and trigger critical alerts to affected users automatically.',
      checklist: [],
      attachments: [],
      testCases: [],
      tickets: [],
      tasks: [
        {
          id: 'TK-2105',
          featureId: 'FT-1002',
          kind: 'task',
          title: 'Populating gaps from audits as risks on the risk register and trigger critical alerts to users',
          category: 'Integration',
          phase: 'idea',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'none',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 3,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
      ],
    },
    {
      id: 'FT-1003',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Automated Auditing (Client & Auditor)',
      phase: 'discovery',
      pstatus: 'inprogress',
      urgency: 'high',
      priority: 'must',
      assignees: ['ST', 'CH'],
      startDate: '02/06/2026',
      endDate: '30/06/2026',
      timeEstimate: '8d',
      sprintPoints: 13,
      theme: {
        id: 'theme-2',
        label: 'Audit Experience',
        desc: 'Making the audit workflow feel guided rather than administrative for both client and auditor.',
      },
      objectives: [
        { id: 'obj1', label: 'Reduce audit turnaround time by 30%' },
        { id: 'obj2', label: 'Achieve SOC 2 Type II readiness' },
      ],
      tags: ['audit'],
      description: 'End-to-end automated audit workflow covering client responses, auditor review, and reporting — the flagship feature for this quarter\'s Audit Experience theme.',
      checklist: [
        { name: 'Map current manual audit steps', done: true },
        { name: 'Define automated questionnaire logic', done: true },
        { name: 'Prototype evidence validation', done: false },
      ],
      attachments: [
        { type: 'image', name: 'Audit-flow-wireframe.png' },
        { type: 'link', name: 'Client interview notes (Notion)', url: 'https://notion.so/audit-interviews' },
      ],
      testCases: [{ name: 'Questionnaire assignment matches selected standard', status: 'pending' }],
      tickets: [
        { ticket_id_code: 'TCK-881', title: 'Client cannot resume a partially completed audit questionnaire', customer: 'Zenith Bank', status: 'open' },
        { ticket_id_code: 'TCK-902', title: 'Requesting bulk evidence upload for audits', customer: 'Access Holdings', status: 'open' },
      ],
      tasks: [
        {
          id: 'TK-2106',
          featureId: 'FT-1003',
          kind: 'task',
          title: 'Automate audit workflow from initiation to completion, covering client responses, auditor review, and reporting.',
          category: 'Integration',
          phase: 'discovery',
          pstatus: 'inprogress',
          urgency: 'high',
          priority: 'must',
          assignees: ['ST'],
          startDate: '02/06/2026',
          endDate: '20/06/2026',
          timeEstimate: '6d',
          sprint: 'Sprint 14',
          sprintPoints: 8,
          tags: ['audit'],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2107',
          featureId: 'FT-1003',
          kind: 'task',
          title: 'Auto-generate audit questionnaires and assign them based on selected compliance standards.',
          category: 'API',
          phase: 'discovery',
          pstatus: 'todo',
          urgency: 'normal',
          priority: 'should',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: 'Sprint 14',
          sprintPoints: 5,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2108',
          featureId: 'FT-1003',
          kind: 'task',
          title: 'Enable automated validation of client submissions, including evidence checks and completeness verification.',
          category: 'Research',
          phase: 'discovery',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'should',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 5,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2109',
          featureId: 'FT-1003',
          kind: 'task',
          title: 'Provide automated alerts and notifications for missing responses, deadlines, and required evidence.',
          category: 'UI',
          phase: 'discovery',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'could',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 3,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
        {
          id: 'TK-2110',
          featureId: 'FT-1003',
          kind: 'task',
          title: 'Generate audit completion reports summarizing findings and resolved items.',
          category: 'Analytics',
          phase: 'discovery',
          pstatus: 'todo',
          urgency: 'none',
          priority: 'could',
          assignees: [],
          startDate: null,
          endDate: null,
          timeEstimate: null,
          sprint: null,
          sprintPoints: 3,
          tags: [],
          description: '',
          checklist: [],
          attachments: [],
        },
      ],
    },
    {
      id: 'FT-1004',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Evidence repository v2',
      phase: 'proto',
      pstatus: 'todo',
      urgency: 'normal',
      priority: 'should',
      assignees: [],
      sprintPoints: 5,
      tasks: [],
    },
    {
      id: 'FT-1005',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Control library import',
      phase: 'proto',
      pstatus: 'todo',
      urgency: 'none',
      priority: 'could',
      assignees: [],
      sprintPoints: 3,
      tasks: [],
    },
    {
      id: 'FT-1006',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Regulator submission packet',
      phase: 'proto',
      pstatus: 'todo',
      urgency: 'high',
      priority: 'must',
      assignees: [],
      sprintPoints: 8,
      objectives: [{ id: 'obj2', label: 'Achieve SOC 2 Type II readiness' }],
      tasks: [],
    },
    {
      id: 'FT-1007',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Compliance calendar sync',
      phase: 'dev',
      pstatus: 'inprogress',
      urgency: 'high',
      priority: 'must',
      assignees: ['CH'],
      sprintPoints: 8,
      tasks: [],
    },
    {
      id: 'FT-1008',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Risk heat-map visualization',
      phase: 'dev',
      pstatus: 'inprogress',
      urgency: 'normal',
      priority: 'should',
      assignees: ['GB'],
      sprintPoints: 5,
      tags: ['core'],
      tasks: [],
    },
    {
      id: 'FT-1009',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Multi-standard mapping engine',
      phase: 'dev',
      pstatus: 'todo',
      urgency: 'none',
      priority: 'should',
      assignees: [],
      sprintPoints: 8,
      tasks: [],
    },
    {
      id: 'FT-1010',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Bulk questionnaire assignment',
      phase: 'dev',
      pstatus: 'inreview',
      urgency: 'normal',
      priority: 'should',
      assignees: ['ST'],
      sprintPoints: 5,
      tags: ['audit'],
      tasks: [],
    },
    {
      id: 'FT-1011',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Audit trail export (PDF/CSV)',
      phase: 'dev',
      pstatus: 'todo',
      urgency: 'none',
      priority: 'could',
      assignees: [],
      sprintPoints: 3,
      tasks: [],
    },
    {
      id: 'FT-1012',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Role-based control visibility',
      phase: 'dev',
      pstatus: 'inprogress',
      urgency: 'high',
      priority: 'must',
      assignees: ['CH', 'GB', 'ST'],
      sprintPoints: 8,
      tasks: [],
    },
    {
      id: 'FT-1013',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Vendor risk questionnaire',
      phase: 'dev',
      pstatus: 'todo',
      urgency: 'low',
      priority: 'wont',
      assignees: [],
      sprintPoints: 3,
      tasks: [],
    },
    {
      id: 'FT-1014',
      productId: 'regcomply',
      kind: 'feature',
      title: 'Notification digest preferences',
      phase: 'dev',
      pstatus: 'inprogress',
      urgency: 'none',
      priority: 'could',
      assignees: ['GB'],
      sprintPoints: 2,
      tasks: [],
    },
  ],
  reglearn: [
    {
      id: 'FT-3001',
      productId: 'reglearn',
      kind: 'feature',
      title: 'Pre-Assessment',
      phase: 'idea',
      pstatus: 'todo',
      urgency: 'high',
      priority: 'must',
      assignees: [],
      startDate: '17/04/2026',
      endDate: '15/05/2026',
      sprintPoints: 5,
      description: "Pre-Assessment is an initial evaluation conducted before course enrollment to determine a learner's existing knowledge level. It helps identify competency gaps and ensures learners are placed on the most suitable learning path.",
      tasks: [],
    },
    {
      id: 'FT-3004',
      productId: 'reglearn',
      kind: 'feature',
      title: 'Admin redesign and restructure',
      phase: 'discovery',
      pstatus: 'todo',
      urgency: 'high',
      priority: 'should',
      assignees: [],
      endDate: '15/05/2026',
      sprintPoints: 3,
      tasks: [],
    },
    {
      id: 'FT-3005',
      productId: 'reglearn',
      kind: 'feature',
      title: 'Enterprise Learner',
      phase: 'proto',
      pstatus: 'todo',
      urgency: 'high',
      priority: 'should',
      assignees: [],
      endDate: '29/05/2026',
      sprintPoints: 5,
      tasks: [],
    },
    {
      id: 'FT-3008',
      productId: 'reglearn',
      kind: 'feature',
      title: 'Live / virtual training with facilitator scheduling',
      phase: 'dev',
      pstatus: 'inprogress',
      urgency: 'high',
      priority: 'must',
      assignees: [],
      endDate: '05/06/2026',
      sprintPoints: 8,
      tasks: [],
    },
  ],
};

const isUuid = (str: string | null | undefined): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export function useWorkspaceFeaturesRedesign(productId: string | null) {
  return useQuery({
    queryKey: ['workspace-features-redesign', productId],
    queryFn: async (): Promise<WorkspaceFeatureItem[]> => {
      if (!productId) return [];

      // If productId is a demo slug (e.g. 'regcomply', 'reglearn', 'regport'), immediately return prototype data
      if (!isUuid(productId)) {
        const seedKey = productId.toLowerCase().includes('learn')
          ? 'reglearn'
          : 'regcomply';
        return PROTOTYPE_SEED_DATA[seedKey] || PROTOTYPE_SEED_DATA.regcomply;
      }

      try {
        // Query workspace_features directly using select('*') to avoid schema join errors
        const { data, error } = await (supabase as any)
          .from('workspace_features')
          .select('*')
          .eq('product_id', productId)
          .order('position', { ascending: true });

        if (!error && data && data.length > 0) {
          // Fetch tasks for these features
          const featureIds = data.map((f: any) => f.id);
          let tasksData: any[] = [];
          try {
            const { data: tData } = await (supabase as any)
              .from('workspace_tasks')
              .select('*')
              .in('feature_id', featureIds)
              .order('position', { ascending: true });
            if (tData) tasksData = tData;
          } catch (tErr) {
            // ignore if tasks table isn't migrated yet
          }

          const tasksByFeature = new Map<string, any[]>();
          tasksData.forEach((t) => {
            if (!tasksByFeature.has(t.feature_id)) tasksByFeature.set(t.feature_id, []);
            tasksByFeature.get(t.feature_id)!.push(t);
          });

          return data.map((f: any) => {
            const phase = (f.phase || 'idea') as PhaseKey;
            const pstatus = (f.pstatus || 'todo') as ProdBodStatus;
            const urgency = (f.urgency || 'none') as UrgencyLevel;
            const priority = (f.priority || 'none') as MoSCoWPriority;
            const fTasks = tasksByFeature.get(f.id) || [];

            return {
              id: f.id,
              productId: f.product_id,
              kind: 'feature' as const,
              title: f.name || f.title,
              description: f.description || '',
              phase,
              pstatus,
              urgency,
              priority,
              assignees: f.assignees || [],
              startDate: f.start_date,
              endDate: f.due_date || f.end_date,
              timeEstimate: f.time_estimate,
              sprintPoints: f.sprint_points || f.story_points || 0,
              themeId: f.theme_id,
              tags: f.tags || [],
              checklist: f.checklist || [],
              attachments: f.attachments || [],
              testCases: f.test_cases || [],
              tickets: f.tickets || [],
              relatedItems: f.related_items || [],
              activity: f.activity || [
                {
                  id: 'act-1',
                  type: 'log',
                  who: 'Team Member',
                  when: new Date(f.created_at || Date.now()).toLocaleDateString(),
                  text: 'Feature created',
                },
              ],
              tasks: fTasks.map((t: any) => ({
                id: t.id,
                featureId: f.id,
                kind: 'task' as const,
                title: t.title,
                description: t.description || '',
                category: t.category || 'UI',
                phase: (t.phase || phase) as PhaseKey,
                pstatus: (t.pstatus || 'todo') as ProdBodStatus,
                urgency: (t.urgency || 'none') as UrgencyLevel,
                priority: (t.priority || 'none') as MoSCoWPriority,
                assignees: t.assignees || [],
                startDate: t.start_date,
                endDate: t.end_date,
                timeEstimate: t.time_estimate,
                sprint: t.sprint,
                sprintPoints: t.sprint_points,
                tags: t.tags || [],
                checklist: t.checklist || [],
                attachments: t.attachments || [],
                relatedItems: t.related_items || [],
                position: t.position || 0,
              })),
              isStarred: f.is_starred || false,
              position: f.position || 0,
            };
          });
        }
      } catch (err) {
        // Fallback to prototype dataset on any network / schema issue
      }

      // Check if prototype seed exists for slug or ID
      const seedKey = productId.toLowerCase().includes('learn')
        ? 'reglearn'
        : 'regcomply';
      return PROTOTYPE_SEED_DATA[seedKey] || PROTOTYPE_SEED_DATA.regcomply;
    },
    enabled: !!productId,
  });
}

export function useCreateFeatureRedesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feature: Partial<WorkspaceFeatureItem> & { productId: string; title: string; phase?: PhaseKey }) => {
      const { data, error } = await (supabase as any)
        .from('workspace_features')
        .insert({
          product_id: feature.productId,
          name: feature.title,
          description: feature.description || '',
          phase: feature.phase || 'idea',
          pstatus: feature.pstatus || 'todo',
          urgency: feature.urgency || 'none',
          priority: feature.priority || 'none',
          start_date: feature.startDate || null,
          end_date: feature.endDate || null,
          time_estimate: feature.timeEstimate || null,
          sprint_points: feature.sprintPoints || 0,
          tags: feature.tags || [],
        })
        .select()
        .single();

      if (error) {
        console.warn('Could not insert to workspace_features table directly:', error);
        return {
          id: 'FT-' + Math.floor(1000 + Math.random() * 9000),
          ...feature,
          tasks: [],
        };
      }
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-features-redesign', vars.productId] });
    },
  });
}

export function useUpdateFeatureRedesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feature: Partial<WorkspaceFeatureItem> & { id: string; productId?: string }) => {
      const updates: any = {};
      if (feature.title !== undefined) { updates.name = feature.title; updates.title = feature.title; }
      if (feature.description !== undefined) updates.description = feature.description;
      if (feature.phase !== undefined) updates.phase = feature.phase;
      if (feature.pstatus !== undefined) updates.pstatus = feature.pstatus;
      if (feature.urgency !== undefined) updates.urgency = feature.urgency;
      if (feature.priority !== undefined) updates.priority = feature.priority;
      if (feature.startDate !== undefined) updates.start_date = feature.startDate;
      if (feature.endDate !== undefined) { updates.end_date = feature.endDate; updates.due_date = feature.endDate; }
      if (feature.timeEstimate !== undefined) updates.time_estimate = feature.timeEstimate;
      if (feature.sprintPoints !== undefined) updates.sprint_points = feature.sprintPoints;
      if (feature.tags !== undefined) updates.tags = feature.tags;
      if (feature.isStarred !== undefined) updates.is_starred = feature.isStarred;

      const { data, error } = await (supabase as any)
        .from('workspace_features')
        .update(updates)
        .eq('id', feature.id)
        .select()
        .single();

      if (error) {
        console.warn('Could not update feature on supabase:', error);
        return feature;
      }
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-features-redesign'] });
    },
  });
}
