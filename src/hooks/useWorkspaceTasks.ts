import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceTask } from '@/types/workspace';

export function useWorkspaceTasks(featureId: string | null) {
  return useQuery({
    queryKey: ['workspace-tasks', featureId],
    queryFn: async (): Promise<WorkspaceTask[]> => {
      if (!featureId) return [];
      const { data, error } = await (supabase as any)
        .from('workspace_tasks')
        .select(`
          *,
          workspace_task_assignees (
            user_id
          ),
          workspace_feature_checklists (
            id,
            title,
            is_completed
          ),
          workspace_feature_attachments (
            id,
            name,
            type,
            url,
            created_at
          ),
          workspace_feature_related_items (
            id,
            related_type,
            related_id,
            related_title
          )
        `)
        .eq('feature_id', featureId)
        .order('position', { ascending: true });

      if (error) {
        console.warn('Error loading workspace tasks:', error);
        return [];
      }

      return (data || []).map((t: any) => ({
        id: t.id,
        featureId: t.feature_id,
        kind: 'task',
        title: t.title,
        description: t.description || '',
        category: t.category || 'UI',
        phase: t.phase || 'idea',
        pstatus: t.pstatus || 'todo',
        urgency: t.urgency || 'none',
        priority: t.priority || 'none',
        assignees: (t.workspace_task_assignees || []).map((a: any) => a.user_id),
        startDate: t.start_date,
        endDate: t.end_date,
        timeEstimate: t.time_estimate,
        sprint: t.sprint,
        sprintPoints: t.sprint_points,
        tags: t.tags || [],
        checklist: (t.workspace_feature_checklists || []).map((c: any) => ({
          id: c.id,
          name: c.title,
          done: c.is_completed,
        })),
        attachments: t.workspace_feature_attachments || [],
        relatedItems: t.workspace_feature_related_items || [],
        position: t.position || 0,
      }));
    },
    enabled: !!featureId,
  });
}

export function useCreateWorkspaceTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Partial<WorkspaceTask> & { featureId: string; title: string }) => {
      const { data, error } = await (supabase as any)
        .from('workspace_tasks')
        .insert({
          feature_id: task.featureId,
          title: task.title,
          description: task.description || '',
          category: task.category || 'UI',
          phase: task.phase || 'idea',
          pstatus: task.pstatus || 'todo',
          urgency: task.urgency || 'none',
          priority: task.priority || 'none',
          start_date: task.startDate || null,
          end_date: task.endDate || null,
          time_estimate: task.timeEstimate || null,
          sprint: task.sprint || null,
          sprint_points: task.sprintPoints || 0,
          tags: task.tags || [],
          position: task.position || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks', vars.featureId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-features-redesign'] });
    },
  });
}

export function useUpdateWorkspaceTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Partial<WorkspaceTask> & { id: string; featureId?: string }) => {
      const updates: any = {};
      if (task.title !== undefined) updates.title = task.title;
      if (task.description !== undefined) updates.description = task.description;
      if (task.category !== undefined) updates.category = task.category;
      if (task.phase !== undefined) updates.phase = task.phase;
      if (task.pstatus !== undefined) updates.pstatus = task.pstatus;
      if (task.urgency !== undefined) updates.urgency = task.urgency;
      if (task.priority !== undefined) updates.priority = task.priority;
      if (task.startDate !== undefined) updates.start_date = task.startDate;
      if (task.endDate !== undefined) updates.end_date = task.endDate;
      if (task.timeEstimate !== undefined) updates.time_estimate = task.timeEstimate;
      if (task.sprint !== undefined) updates.sprint = task.sprint;
      if (task.sprintPoints !== undefined) updates.sprint_points = task.sprintPoints;
      if (task.tags !== undefined) updates.tags = task.tags;
      if (task.position !== undefined) updates.position = task.position;

      const { data, error } = await (supabase as any)
        .from('workspace_tasks')
        .update(updates)
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.feature_id) {
        queryClient.invalidateQueries({ queryKey: ['workspace-tasks', data.feature_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['workspace-features-redesign'] });
    },
  });
}

export function useDeleteWorkspaceTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, featureId }: { taskId: string; featureId: string }) => {
      const { error } = await (supabase as any)
        .from('workspace_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return { taskId, featureId };
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks', vars.featureId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-features-redesign'] });
    },
  });
}
