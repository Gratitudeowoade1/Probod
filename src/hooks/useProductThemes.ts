import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductTheme {
  id: string;
  productId: string;
  name: string;
  description: string;
}

export function useProductThemes(productId: string | null) {
  return useQuery({
    queryKey: ['product-themes', productId],
    queryFn: async (): Promise<ProductTheme[]> => {
      if (!productId) return [];
      const { data, error } = await (supabase as any)
        .from('product_themes')
        .select('*')
        .eq('product_id', productId)
        .order('name');

      if (error) {
        console.warn('Error fetching product themes:', error);
        return [];
      }

      return (data || []).map((t: any) => ({
        id: t.id,
        productId: t.product_id,
        name: t.name,
        description: t.description || '',
      }));
    },
    enabled: !!productId,
  });
}

export function useCreateProductTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, name, description }: { productId: string; name: string; description?: string }) => {
      const { data, error } = await (supabase as any)
        .from('product_themes')
        .insert({
          product_id: productId,
          name,
          description: description || '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['product-themes', vars.productId] });
    },
  });
}
