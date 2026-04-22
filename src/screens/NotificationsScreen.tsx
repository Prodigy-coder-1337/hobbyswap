import { useNavigate } from 'react-router-dom';
import { Button, Panel, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/date';

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const clearAllNotifications = useAppStore((state) => state.clearAllNotifications);

  if (!currentUser) {
    return null;
  }

  const mine = notifications.filter((item) => item.userId === currentUser.id);

  return (
    <Screen
      title="Notifications"
      subtitle="Only updates that help you act: swaps, reminders, messages, and contract changes."
      action={<Button tone="secondary" onClick={clearAllNotifications}>Clear all</Button>}
    >
      <div className="stack-list">
        {mine.map((item) => (
          <Panel eyebrow={item.type} key={item.id} title={item.title} aside={item.read ? <Pill tone="neutral">Read</Pill> : <Pill tone="warm">Unread</Pill>}>
            <p>{item.body}</p>
            <small>{formatDateTime(item.createdAt)}</small>
            <div className="button-row">
              <Button tone="secondary" onClick={() => markNotificationRead(item.id)}>
                Mark read
              </Button>
              <Button onClick={() => navigate(item.route)}>Open</Button>
            </div>
          </Panel>
        ))}
      </div>
    </Screen>
  );
}
