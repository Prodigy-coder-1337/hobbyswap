import { Suspense, lazy, type ReactNode } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import { LoadingState } from '@/components/ui';
import AppShell from '@/navigation/AppShell';
import { useAppStore } from '@/store/useAppStore';

const LandingScreen = lazy(() => import('@/screens/LandingScreen'));
const AuthScreen = lazy(() => import('@/screens/AuthScreen'));
const OnboardingScreen = lazy(() => import('@/screens/OnboardingScreen'));
const InfoScreen = lazy(() => import('@/screens/InfoScreen'));
const DashboardScreen = lazy(() => import('@/screens/DashboardScreen'));
const DiscoverScreen = lazy(() => import('@/screens/DiscoverScreen'));
const MarketplaceScreen = lazy(() => import('@/screens/MarketplaceScreen'));
const EventsScreen = lazy(() => import('@/screens/EventsScreen'));
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen'));
const ContractFlowScreen = lazy(() => import('@/screens/ContractFlowScreen'));
const SwapLogScreen = lazy(() => import('@/screens/SwapLogScreen'));
const ResourceLibraryScreen = lazy(() => import('@/screens/ResourceLibraryScreen'));
const ChallengesScreen = lazy(() => import('@/screens/ChallengesScreen'));
const MessagingScreen = lazy(() => import('@/screens/MessagingScreen'));
const NotificationsScreen = lazy(() => import('@/screens/NotificationsScreen'));
const SettingsScreen = lazy(() => import('@/screens/SettingsScreen'));
const GuideScreen = lazy(() => import('@/screens/GuideScreen'));
const ModerationScreen = lazy(() => import('@/screens/ModerationScreen'));
const MentorshipScreen = lazy(() => import('@/screens/MentorshipScreen'));
const ProjectsScreen = lazy(() => import('@/screens/ProjectsScreen'));
const VideoHubScreen = lazy(() => import('@/screens/VideoHubScreen'));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>;
}

function GuardedAppShell() {
  const currentUserId = useAppStore((state) => state.currentUserId);
  const users = useAppStore((state) => state.users);
  const location = useLocation();
  const currentUser = users.find((user) => user.id === currentUserId) ?? null;

  if (!currentUser) {
    return <Navigate replace state={{ from: location.pathname }} to="/auth" />;
  }

  if (!currentUser.onboardingComplete) {
    return <Navigate replace to="/onboarding" />;
  }

  if (!currentUser.guideCompleted && location.pathname !== '/app/guide') {
    return <Navigate replace to="/app/guide" />;
  }

  return <AppShell />;
}

function OnboardingGuard() {
  const currentUserId = useAppStore((state) => state.currentUserId);
  const users = useAppStore((state) => state.users);
  const currentUser = users.find((user) => user.id === currentUserId) ?? null;

  if (!currentUser) {
    return <Navigate replace to="/auth" />;
  }

  if (currentUser.onboardingComplete) {
    return <Navigate replace to={currentUser.guideCompleted ? '/app/home' : '/app/guide'} />;
  }

  return <OnboardingScreen />;
}

function AppRoutes() {
  return useRoutes([
    { path: '/', element: withSuspense(<LandingScreen />) },
    { path: '/auth', element: withSuspense(<AuthScreen />) },
    { path: '/onboarding', element: withSuspense(<OnboardingGuard />) },
    { path: '/info/:slug', element: withSuspense(<InfoScreen />) },
    {
      path: '/app',
      element: <GuardedAppShell />,
      children: [
        { index: true, element: <Navigate replace to="/app/home" /> },
        { path: 'home', element: withSuspense(<DashboardScreen />) },
        { path: 'discover', element: withSuspense(<DiscoverScreen />) },
        { path: 'swap', element: withSuspense(<MarketplaceScreen />) },
        { path: 'events', element: withSuspense(<EventsScreen />) },
        { path: 'profile', element: withSuspense(<ProfileScreen />) },
        { path: 'contracts', element: withSuspense(<ContractFlowScreen />) },
        { path: 'log', element: withSuspense(<SwapLogScreen />) },
        { path: 'resources', element: withSuspense(<ResourceLibraryScreen />) },
        { path: 'challenges', element: withSuspense(<ChallengesScreen />) },
        { path: 'messages', element: withSuspense(<MessagingScreen />) },
        { path: 'notifications', element: withSuspense(<NotificationsScreen />) },
        { path: 'settings', element: withSuspense(<SettingsScreen />) },
        { path: 'guide', element: withSuspense(<GuideScreen />) },
        { path: 'moderation', element: withSuspense(<ModerationScreen />) },
        { path: 'mentorship', element: withSuspense(<MentorshipScreen />) },
        { path: 'projects', element: withSuspense(<ProjectsScreen />) },
        { path: 'videos', element: withSuspense(<VideoHubScreen />) }
      ]
    },
    { path: '*', element: <Navigate replace to="/" /> }
  ]);
}

export function RouterProvider() {
  return <AppRoutes />;
}
