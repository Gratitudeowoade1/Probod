import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductRole } from '@/types';

export const isUuid = (str: string | null | undefined): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export function useProductRoles(productId: string | null) {
  const queryClient = useQueryClient();
  const isValidProductUuid = isUuid(productId);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product-roles-base', productId],
    enabled: !!productId && isValidProductUuid,
    queryFn: async () => {
      if (!isValidProductUuid) return { pm_user_id: null, lead_engineer_user_id: null };
      try {
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('id', productId!)
          .maybeSingle();

        if (error || !data) {
          return { pm_user_id: null, lead_engineer_user_id: null };
        }

        return {
          pm_user_id: data.pm_user_id || data.product_manager_id || null,
          lead_engineer_user_id: data.lead_engineer_user_id || null,
        };
      } catch (err) {
        return { pm_user_id: null, lead_engineer_user_id: null };
      }
    },
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['product-roles', productId, product?.pm_user_id, product?.lead_engineer_user_id],
    enabled: isValidProductUuid && (!!product?.pm_user_id || !!product?.lead_engineer_user_id),
    queryFn: async () => {
      const userIds = [product?.pm_user_id, product?.lead_engineer_user_id].filter(Boolean) as string[];
      if (userIds.length === 0) return { pm: null, leadEngineer: null };

      try {
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);
        if (error || !profiles) return { pm: null, leadEngineer: null };

        const profileMap = new Map(profiles.map((p) => [p.id, p]));

        const getRole = (userId: string | null | undefined): ProductRole | null => {
          if (!userId) return null;
          const profile = profileMap.get(userId);
          if (!profile) return null;
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
          const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const colors = ['#8B5CF6', '#3B82F6', '#F59E0B', '#EC4899', '#10B981', '#6B7280'];
          const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const avatarColor = colors[hash % colors.length];

          return { userId, name, initials, avatarColor };
        };

        return {
          pm: getRole(product?.pm_user_id),
          leadEngineer: getRole(product?.lead_engineer_user_id),
        };
      } catch (err) {
        return { pm: null, leadEngineer: null };
      }
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ role, userId }: { role: 'pm' | 'lead_engineer'; userId: string | null }) => {
      if (!productId || !isUuid(productId)) return;
      const column = role === 'pm' ? 'pm_user_id' : 'lead_engineer_user_id';
      try {
        await (supabase as any)
          .from('products')
          .update({ [column]: userId })
          .eq('id', productId);
      } catch (err) {
        console.warn('Could not save role assignment to products table:', err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-roles-base', productId] });
      queryClient.invalidateQueries({ queryKey: ['org-products'] });
    },
  });

  return {
    pm: roles?.pm || null,
    leadEngineer: roles?.leadEngineer || null,
    assignRole: (role: 'pm' | 'lead_engineer', userId: string | null) =>
      assignRole.mutate({ role, userId }),
    isLoading: (isValidProductUuid && productLoading) || rolesLoading,
  };
}
