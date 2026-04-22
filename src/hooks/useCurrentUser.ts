import { useAppStore } from '@/store/useAppStore';

export function useCurrentUser() {
  const currentUserId = useAppStore((state) => state.currentUserId);
  const users = useAppStore((state) => state.users);
  return users.find((user) => user.id === currentUserId) ?? null;
}
