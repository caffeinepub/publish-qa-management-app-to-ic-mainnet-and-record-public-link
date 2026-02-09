import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Example query hook - customize based on your backend methods
export function useExampleQuery() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      if (!actor) return null;
      // Call your backend methods here
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

// Example mutation hook
export function useExampleMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      if (!actor) throw new Error('Actor not initialized');
      // Call your backend update methods here
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });
}
