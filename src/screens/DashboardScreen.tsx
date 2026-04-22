import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button, Panel, Pill, Screen, StatsGrid } from '@/components/ui';
import { useDelayedReady } from '@/hooks/useDelayedReady';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils/date';
import { locationLabel } from '@/utils/format';

export default function DashboardScreen() {
  const ready = useDelayedReady();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const events = useAppStore((state) => state.events);
  const challenges = useAppStore((state) => state.challenges);
  const contracts = useAppStore((state) => state.contracts);
  const projects = useAppStore((state) => state.projects);
  const quickMatches = useAppStore((state) => state.quickMatches);
  const quickMatch = useAppStore((state) => state.quickMatch);
  const startConversation = useAppStore((state) => state.startConversation);
  const swapLog = useAppStore((state) => state.swapLog);

  if (!ready || !currentUser) {
    return <div className="screen">Loading your dashboard…</div>;
  }

  const activeChallenge = challenges.find((challenge) => !challenge.archived);
  const upcomingEvents = events.slice(0, 3);
  const activeContracts = contracts.filter(
    (contract) =>
      [contract.initiatorId, contract.partnerId].includes(currentUser.id) &&
      ['active', 'pending'].includes(contract.status)
  );
  const hours = swapLog
    .filter((entry) => entry.userId === currentUser.id)
    .reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <Screen
      title={`Hey ${currentUser.displayName}, here is your next gentle nudge.`}
      subtitle="A finite set of relevant actions for this week. No infinite feed, just clear progress."
      action={
        <Button
          onClick={() => {
            quickMatch();
          }}
        >
          <Sparkles size={16} /> Quick Match
        </Button>
      }
    >
      <StatsGrid
        items={[
          { label: 'Trust score', value: `${currentUser.trustScore}/100`, tone: 'warm' },
          { label: 'Hours shared', value: hours, tone: 'teal' },
          { label: 'Active swaps', value: activeContracts.length, tone: 'mauve' }
        ]}
      />

      {activeChallenge ? (
        <Panel
          eyebrow="Weekly challenge"
          title={activeChallenge.title}
          aside={<Pill tone="teal">Ends this week</Pill>}
        >
          <p>{activeChallenge.prompt}</p>
          <div className="button-row">
            <Link to="/app/challenges">
              <Button>Join challenge</Button>
            </Link>
            <Link to="/app/challenges">
              <Button tone="secondary">See archive</Button>
            </Link>
          </div>
        </Panel>
      ) : null}

      <Panel eyebrow="Quick actions" title="Move your week forward">
        <div className="quick-grid">
          <Link className="action-card" to="/app/contracts">
            <strong>Start a swap contract</strong>
            <p>Create a fair teach-and-learn agreement.</p>
          </Link>
          <Link className="action-card" to="/app/resources">
            <strong>Borrow a resource</strong>
            <p>Check who is lending hobby gear nearby.</p>
          </Link>
          <Link className="action-card" to="/app/projects">
            <strong>Open project spaces</strong>
            <p>Keep shared work moving with a simple kanban board.</p>
          </Link>
          <Link className="action-card" to="/app/mentorship">
            <strong>Find peer guidance</strong>
            <p>Match with someone a few steps ahead of you.</p>
          </Link>
        </div>
      </Panel>

      <Panel eyebrow="Nearby people and opportunities" title="Fresh matches">
        <div className="stack-list">
          {quickMatches.map((match) => {
            const user = useAppStore.getState().users.find((entry) => entry.id === match.matchUserId);
            const hobby = hobbies.find((item) => item.id === match.hobbyId);
            if (!user) {
              return null;
            }
            return (
              <article className="list-card" key={match.id}>
                <div>
                  <strong>{user.displayName}</strong>
                  <p>{match.reason}</p>
                  <small>
                    {hobby?.icon} {hobby?.label} • {locationLabel(user.location, currentUser.privacy.showExactLocation)}
                  </small>
                </div>
                <div className="button-column">
                  <Button
                    tone="secondary"
                    onClick={() => {
                      const threadId = startConversation(user.id);
                      navigate(`/app/messages?thread=${threadId}`);
                    }}
                  >
                    Request chat
                  </Button>
                  <Button
                    onClick={() =>
                      navigate('/app/contracts', {
                        state: { partnerId: user.id, hobbyId: hobby?.id }
                      })
                    }
                  >
                    Draft swap
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel eyebrow="Upcoming" title="Events near your schedule">
        <div className="stack-list">
          {upcomingEvents.map((event) => (
            <article className="list-card" key={event.id}>
              <div>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
                <small>
                  {formatDate(event.date)} • {event.time} • {locationLabel(event.location, false)}
                </small>
              </div>
              <Link to="/app/events">
                <Button tone="secondary">Open event</Button>
              </Link>
            </article>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Shared work" title="Project spaces">
        <div className="stack-list">
          {projects.map((project) => (
            <article className="list-card" key={project.id}>
              <div>
                <strong>{project.title}</strong>
                <p>{project.description}</p>
                <small>{project.collaboratorIds.length + 1} collaborators active</small>
              </div>
              <Link to="/app/projects">
                <Button tone="secondary">Open board</Button>
              </Link>
            </article>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Swaps in motion" title="Contracts and progress">
        <div className="stack-list">
          {activeContracts.map((contract) => (
            <article className="list-card" key={contract.id}>
              <div>
                <strong>
                  Teach: {contract.teachSkill} / Learn: {contract.learnSkill}
                </strong>
                <p>{contract.meetingPoint}</p>
                <small>
                  {contract.status} • {contract.sessionRecords.filter((session) => session.status === 'completed').length}/
                  {contract.sessionRecords.length} sessions complete
                </small>
              </div>
              <Link to="/app/contracts">
                <Button tone="secondary">Track</Button>
              </Link>
            </article>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
