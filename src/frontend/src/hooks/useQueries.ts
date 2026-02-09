import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Website, TestCase, Bug, CornerCase, Severity, UserProfile } from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Website Testing Data
export function useGetWebsitesByUser() {
  const { actor, isFetching } = useActor();

  return useQuery<Website[]>({
    queryKey: ['websites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWebsitesByUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWebsite(websiteId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Website | null>({
    queryKey: ['website', websiteId?.toString()],
    queryFn: async () => {
      if (!actor || !websiteId) return null;
      return actor.getWebsite(websiteId);
    },
    enabled: !!actor && !isFetching && websiteId !== null,
  });
}

export function useGenerateWebsiteTestingData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, title }: { url: string; title: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateWebsiteTestingData(url, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

// Test Case mutations
export function useAddTestCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, description, steps }: { websiteId: bigint; description: string; steps: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTestCase(websiteId, description, steps);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useUpdateTestCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, testCaseId, description, steps }: { websiteId: bigint; testCaseId: bigint; description: string; steps: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTestCase(websiteId, testCaseId, description, steps);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useDeleteTestCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, testCaseId }: { websiteId: bigint; testCaseId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTestCase(websiteId, testCaseId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

// Bug mutations
export function useAddBug() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, description, severity }: { websiteId: bigint; description: string; severity: Severity }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBug(websiteId, description, severity);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useUpdateBug() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, bugId, description, severity }: { websiteId: bigint; bugId: bigint; description: string; severity: Severity }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBug(websiteId, bugId, description, severity);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useDeleteBug() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, bugId }: { websiteId: bigint; bugId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteBug(websiteId, bugId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

// Corner Case mutations
export function useAddCornerCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, description, scenario }: { websiteId: bigint; description: string; scenario: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCornerCase(websiteId, description, scenario);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useUpdateCornerCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, cornerCaseId, description, scenario }: { websiteId: bigint; cornerCaseId: bigint; description: string; scenario: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateCornerCase(websiteId, cornerCaseId, description, scenario);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}

export function useDeleteCornerCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ websiteId, cornerCaseId }: { websiteId: bigint; cornerCaseId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteCornerCase(websiteId, cornerCaseId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', variables.websiteId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}
