import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Flame, Gift, MessageCircle, Sparkles, Ticket, Trophy, Zap } from 'lucide-react';
import { Avatar, Button, ModalSheet, Panel, Pill, ProgressBar, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/date';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const listings = useAppStore((state) => state.listings);
  const contracts = useAppStore((state) => state.contracts);
  const challenges = useAppStore((state) => state.challenges);
  const threads = useAppStore((state) => state.threads);
  const users = useAppStore((state) => state.users);
  const startConversation = useAppStore((state) => state.startConversation);
  const [showCredits, setShowCredits] = useState(false);

  const nextSession = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    return contracts
      .filter(
        (contract) =>
          [contract.teacherId, contract.learnerId].includes(currentUser.id) &&
          ['active', 'awaiting-review'].includes(contract.status)
      )
      .flatMap((contract) =>
        contract.sessionRecords
          .filter((session) => session.status === 'scheduled')
          .map((session) => ({ contract, session }))
      )
      .sort((a, b) => new Date(a.session.date).getTime() - new Date(b.session.date).getTime())[0];
  }, [contracts, currentUser]);

  const recentThread = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    return threads
      .filter((thread) => thread.participantIds.includes(currentUser.id))
      .sort((left, right) => {
        const leftTime = left.messages.at(-1)?.createdAt
          ? new Date(left.messages.at(-1)!.createdAt).getTime()
          : 0;
        const rightTime = right.messages.at(-1)?.createdAt
          ? new Date(right.messages.at(-1)!.createdAt).getTime()
          : 0;
        return rightTime - leftTime;
      })[0] ?? null;
  }, [threads, currentUser]);

  const weeklyChallenge = challenges.find((challenge) => !challenge.archived);
  const challengeProgress = currentUser && weeklyChallenge ? weeklyChallenge.userProgress[currentUser.id] ?? 0 : 0;
  const myListings = currentUser ? listings.filter((listing) => listing.ownerId === currentUser.id) : [];
  const missionItems = currentUser
    ? [
        {
          icon: Sparkles,
          title: 'Complete your profile',
          reward: '+10 cr',
          value: Math.min(currentUser.hobbyProfiles.length, 3),
          max: 3
        },
        {
          icon: Ticket,
          title: 'Join a workshop',
          reward: '+15 cr',
          value: contracts.some((contract) => contract.learnerId === currentUser.id && contract.intent === 'workshop') ? 1 : 0,
          max: 1
        },
        {
          icon: Zap,
          title: 'Teach a skill',
          reward: '+25 cr',
          value: myListings.some((listing) => listing.intent === 'teach') ? 1 : 0,
          max: 1
        },
        {
          icon: Gift,
          title: 'Invite a friend',
          reward: '+20 cr',
          value: 0,
          max: 1
        },
        {
          icon: Trophy,
          title: 'Hobby challenge',
          reward: weeklyChallenge ? `+${weeklyChallenge.creditReward} cr` : '+10 cr',
          value: challengeProgress,
          max: weeklyChallenge?.progressGoal ?? 1
        }
      ]
    : [];

  if (!currentUser) {
    return null;
  }

  const threadPartner = recentThread
    ? users.find((user) => recentThread.participantIds.includes(user.id) && user.id !== currentUser.id)
    : null;

  return (
    <Screen
      title="Today"
      subtitle="One good next move, no homework."
      action={<Pill tone="teal">{currentUser.creditBalance} cr</Pill>}
    >
      <section className="today-hero">
        <div>
          <p className="panel-eyebrow">Daily prompt</p>
          <h2>What hobby are you in the mood for?</h2>
          <p>Swipe a few cards, save one idea, or join something this weekend.</p>
        </div>
        <div className="today-stats">
          <span>
            <Flame size={16} />
            4 day streak
          </span>
          <span>
            <Bookmark size={16} />
            {currentUser.savedListingIds.length} saved
          </span>
        </div>
        <Button onClick={() => navigate('/app/discover')}>Swipe to discover</Button>
      </section>

      <Panel
        eyebrow="Next up"
        title={nextSession ? nextSession.contract.title : 'Find your first plan'}
        aside={<Pill tone={nextSession ? 'warm' : 'mauve'}>{nextSession ? 'Booked' : 'Open'}</Pill>}
      >
        {nextSession ? (
          <div className="simple-next-card">
            <strong>{formatDateTime(nextSession.session.date)}</strong>
            <p>{nextSession.contract.locationLabel}</p>
            <div className="button-row">
              <Button onClick={() => navigate('/app/log')}>View activity</Button>
              <Button
                tone="secondary"
                onClick={() => {
                  const partnerId =
                    nextSession.contract.teacherId === currentUser.id
                      ? nextSession.contract.learnerId
                      : nextSession.contract.teacherId;
                  const threadId = startConversation(partnerId, nextSession.contract.id);
                  navigate(`/app/messages?thread=${threadId}`);
                }}
              >
                Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="button-row">
            <Button onClick={() => navigate('/app/discover')}>Find your match</Button>
            <Button tone="secondary" onClick={() => navigate('/app/new', { state: { mode: 'Create listing' } })}>
              Teach what you know
            </Button>
          </div>
        )}
      </Panel>

      <div className="quick-lanes">
        <button onClick={() => navigate('/app/discover')} type="button">
          <Sparkles size={20} />
          <strong>People</strong>
          <span>Find hobby friends</span>
        </button>
        <button onClick={() => navigate('/app/discover')} type="button">
          <Ticket size={20} />
          <strong>Workshops</strong>
          <span>Join a group</span>
        </button>
        <button onClick={() => navigate('/app/discover')} type="button">
          <Bookmark size={20} />
          <strong>Gear</strong>
          <span>Save or swap</span>
        </button>
      </div>

      <button className="credit-card mission-credit-card" onClick={() => setShowCredits(true)} type="button">
        <div>
          <p className="panel-eyebrow">Credits</p>
          <strong>{currentUser.creditBalance} credits</strong>
          <p>{currentUser.pendingCredits} pending</p>
        </div>
        <Pill tone="warm">Earn more</Pill>
      </button>

      <Panel eyebrow="Missions" title="Earn credits">
        <div className="mission-list">
          {missionItems.map((mission) => {
            const Icon = mission.icon;
            return (
              <article className="mission-row" key={mission.title}>
                <span className="mission-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{mission.title}</strong>
                  <ProgressBar max={mission.max} value={mission.value} />
                </div>
                <Pill tone="teal">{mission.reward}</Pill>
              </article>
            );
          })}
        </div>
      </Panel>

      {threadPartner && recentThread ? (
        <Panel eyebrow="Latest chat" title="Keep the loop warm">
          <button
            className="thread-row"
            onClick={() => navigate(`/app/messages?thread=${recentThread.id}`)}
            type="button"
          >
            <Avatar color={threadPartner.avatar} label={threadPartner.displayName} />
            <div className="thread-row-main">
              <div className="thread-row-meta">
                <strong>{threadPartner.displayName}</strong>
                <MessageCircle size={16} />
              </div>
              <p className="thread-row-preview">{recentThread.messages.at(-1)?.body ?? 'Say hello.'}</p>
            </div>
          </button>
        </Panel>
      ) : null}

      <ModalSheet onClose={() => setShowCredits(false)} open={showCredits} title="Earn credits">
        <div className="mission-list">
          {missionItems.map((mission) => {
            const Icon = mission.icon;
            return (
              <article className="mission-row" key={mission.title}>
                <span className="mission-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{mission.title}</strong>
                  <p>{mission.reward}</p>
                </div>
                <ProgressBar max={mission.max} value={mission.value} />
              </article>
            );
          })}
        </div>
      </ModalSheet>
    </Screen>
  );
}
