import { useNavigate } from 'react-router-dom';
import { Button, Panel, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { NotificationItem } from '@/types/models';
import { ACTION_HISTORY_ROUTE } from '@/utils/routes';
import { formatDateTime } from '@/utils/date';

function supportsHistory(item: NotificationItem) {
  return item.type !== 'message' && item.type !== 'safety';
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const clearAllNotifications = useAppStore((state) => state.clearAllNotifications);

  if (!currentUser) {
    return null;
  }

  const mine = notifications.filter((entry) => entry.userId === currentUser.id);

  return (
    <Screen
      title="Notifications"
      subtitle="Action alerts stay readable here, and transaction-related updates can jump straight into your full history."
      action={<Button tone="secondary" onClick={clearAllNotifications}>Clear all</Button>}
    >
      <div className="stack-list">
        {mine.map((item) => (
          <Panel
            aside={item.read ? <Pill tone="neutral">Read</Pill> : <Pill tone="warm">Unread</Pill>}
            eyebrow={item.type}
            key={item.id}
            title={item.title}
          >
            <p>{item.body}</p>
            <small>{formatDateTime(item.createdAt)}</small>
            <div className="button-row">
              <Button tone="secondary" onClick={() => markNotificationRead(item.id)}>
                Mark read
              </Button>
              {supportsHistory(item) ? (
                <Button
                  tone="secondary"
                  onClick={() => {
                    markNotificationRead(item.id);
                    navigate(ACTION_HISTORY_ROUTE);
                  }}
                >
                  View history
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  markNotificationRead(item.id);
                  navigate(item.route);
                }}
              >
                Open
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </Screen>
  );
}
