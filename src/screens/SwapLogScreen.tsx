import { Button, Panel, Screen, StatsGrid } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { exportSwapSummaryPdf } from '@/services/export';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils/date';

export default function SwapLogScreen() {
  const currentUser = useCurrentUser();
  const swapLog = useAppStore((state) => state.swapLog);
  const contracts = useAppStore((state) => state.contracts);

  if (!currentUser) {
    return null;
  }

  const entries = swapLog.filter((entry) => entry.userId === currentUser.id);
  const learned = entries.filter((entry) => entry.type === 'learned').reduce((sum, entry) => sum + entry.hours, 0);
  const taught = entries.filter((entry) => entry.type === 'taught').reduce((sum, entry) => sum + entry.hours, 0);
  const hours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const badges = entries.filter((entry) => entry.badge).length;

  return (
    <Screen
      title="Swap log and progress"
      subtitle="Track what you learned, what you taught, and the participation-based badges you unlocked by showing up."
      action={
        <Button tone="secondary" onClick={() => exportSwapSummaryPdf(currentUser, entries)}>
          Export PDF
        </Button>
      }
    >
      <StatsGrid
        items={[
          { label: 'Hours learned', value: learned, tone: 'warm' },
          { label: 'Hours taught', value: taught, tone: 'teal' },
          { label: 'Badges earned', value: badges, tone: 'mauve' }
        ]}
      />

      <Panel eyebrow="Live status" title="Contracts still in motion">
        <div className="stack-list">
          {contracts
            .filter((contract) => [contract.initiatorId, contract.partnerId].includes(currentUser.id))
            .map((contract) => (
              <article className="list-card" key={contract.id}>
                <div>
                  <strong>{contract.teachSkill} ↔ {contract.learnSkill}</strong>
                  <p>{contract.status}</p>
                </div>
                <span>
                  {contract.sessionRecords.filter((session) => session.status === 'completed').length}/
                  {contract.sessionRecords.length}
                </span>
              </article>
            ))}
        </div>
      </Panel>

      <Panel eyebrow="Timeline" title="Every meaningful step so far">
        <div className="timeline-list">
          {entries.map((entry) => (
            <div className="timeline-row" key={entry.id}>
              <div>
                <strong>{entry.title}</strong>
                <p>
                  {entry.type} • {entry.hours}h • {formatDate(entry.happenedAt)}
                </p>
              </div>
              {entry.badge ? <span className="badge">{entry.badge}</span> : null}
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
