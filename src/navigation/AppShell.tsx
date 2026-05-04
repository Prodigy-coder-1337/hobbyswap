import { Outlet } from 'react-router-dom';
import { useRef } from 'react';
import { BottomNav, ToastStack, TopBar } from '@/components/ui';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function AppShell() {
  const toasts = useAppStore((state) => state.toasts);
  const dismissToast = useAppStore((state) => state.dismissToast);
  const currentUser = useCurrentUser();
  const shellRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app-shell">
      <div
        ref={shellRef}
        className={`phone-shell ${currentUser?.accessibility.theme === 'Dark' ? 'theme-dark' : ''} ${currentUser?.accessibility.highContrast ? 'high-contrast' : ''} ${currentUser?.accessibility.reduceMotion ? 'reduce-motion' : ''}`}
        data-font-scale={currentUser?.accessibility.fontScale ?? 'Default'}
      >
        <TopBar />
        <main className="app-main">
          <Outlet />
        </main>
        <BottomNav />
        <ToastStack items={toasts} onDismiss={dismissToast} />
        <TutorialOverlay shellRef={shellRef} />
      </div>
    </div>
  );
}
