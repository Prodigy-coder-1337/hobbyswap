import { Outlet } from 'react-router-dom';
import { BottomNav, ToastStack, TopBar } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function AppShell() {
  const toasts = useAppStore((state) => state.toasts);
  const dismissToast = useAppStore((state) => state.dismissToast);
  const currentUser = useCurrentUser();

  return (
    <div className="app-shell">
      <div
        className={`phone-shell ${currentUser?.accessibility.highContrast ? 'high-contrast' : ''} ${currentUser?.accessibility.reduceMotion ? 'reduce-motion' : ''}`}
        data-font-scale={currentUser?.accessibility.fontScale ?? 'Default'}
      >
        <TopBar />
        <main className="app-main">
          <Outlet />
        </main>
        <BottomNav />
        <ToastStack items={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}
