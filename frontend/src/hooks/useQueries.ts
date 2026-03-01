import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Score, UserProfile, Discipline } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetScores() {
  const { actor, isFetching } = useActor();

  return useQuery<Score[]>({
    queryKey: ['scores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScore() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      shooterName: string;
      discipline: Discipline;
      distance: bigint;
      scoreValue: bigint;
      date: string;
    }) => {
      if (isFetching) throw new Error('Backend connection is initializing. Please wait a moment and try again.');
      if (!actor) throw new Error('Backend connection not available. Please refresh the page or try again.');
      await actor.addScore(
        params.id,
        params.shooterName,
        params.discipline,
        params.distance,
        params.scoreValue,
        params.date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
    },
  });
}

export function useDeleteScore() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isFetching) throw new Error('Backend connection is initializing. Please wait a moment and try again.');
      if (!actor) throw new Error('Backend connection not available. Please refresh the page or try again.');
      await actor.deleteScore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
    },
  });
}

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
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGrantAdminRole() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (principalId: string) => {
      if (isFetching) throw new Error('Backend connection is initializing. Please wait a moment and try again.');
      if (!actor) throw new Error('Backend connection not available. Please refresh the page or try again.');
      let target: Principal;
      try {
        target = Principal.fromText(principalId.trim());
      } catch {
        throw new Error('Invalid principal ID format. Please enter a valid Internet Identity principal.');
      }
      await actor.grantAdminRole(target);
    },
  });
}
