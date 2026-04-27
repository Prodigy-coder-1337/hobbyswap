import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, ModalSheet, Panel, Pill, ProgressBar, Screen, Segments } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, formatDateTime } from '@/utils/date';
import { dualPrice } from '@/utils/format';

type IntentFilter = 'All' | 'Swaps' | 'Teachers' | 'Workshops' | 'Items';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const listings = useAppStore((state) => state.listings);
  const contracts = useAppStore((state) => state.contracts);
  const challenges = useAppStore((state) => state.challenges);
  const threads = useAppStore((state) => state.threads);
  const users = useAppStore((state) => state.users);
  const startConversation = useAppStore((state) => state.startConversation);
  const [filter, setFilter] = useState<IntentFilter>('All');
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

  const recommendations = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return listings
      .filter((listing) => listing.ownerId !== currentUser.id)
      .filter((listing) => {
        if (filter === 'All') {
          return true;
        }

        if (filter === 'Swaps') {
          return listing.intent === 'swap';
        }

        if (filter === 'Teachers') {
          return listing.intent === 'teach';
        }

        if (filter === 'Workshops') {
          return listing.intent === 'workshop';
        }

        return listing.intent === 'item';
      })
      .slice(0, 4);
  }, [listings, currentUser, filter]);

  const recentThreads = useMemo(() => {
    if (!currentUser) {
      return [];
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
      })
      .slice(0, 2);
  }, [threads, currentUser]);

  const weeklyChallenge = challenges.find((challenge) => !challenge.archived);
  const challengeProgress = currentUser && weeklyChallenge ? weeklyChallenge.userProgress[currentUser.id] ?? 0 : 0;

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Home"
      subtitle="The fastest way to see your next move, a few strong matches, and the main actions."
      action={<Pill tone="teal">{currentUser.creditBalance} cr live</Pill>}
    >
      <button className="credit-card" data-tutorial-target="home" onClick={() => setShowCredits(true)} type="button">
        <div className="credit-card-copy">
          <p className="panel-eyebrow">Credit balance</p>
          <strong>{currentUser.creditBalance} credits</strong>
          <p>Pending earnings: {currentUser.pendingCredits} cr</p>
        </div>
        <div className="credit-card-meta">
          <span>Tap for the full credit guide</span>
          <small>Next payout: {formatDate(currentUser.nextPayoutDate)}</small>
        </div>
      </button>

      <Panel
        eyebrow="Next scheduled session"
        title={nextSession ? nextSession.contract.title : 'Nothing scheduled yet'}
        aside={nextSession ? <Pill tone="warm">{nextSession.contract.type.replace('-', ' ')}</Pill> : null}
      >
        {nextSession ? (
          <div className="stack-list">
            <p>{nextSession.contract.locationLabel}</p>
            <p>{formatDateTime(nextSession.session.date)} • {nextSession.contract.format}</p>
            <div className="button-row">
              <Button tone="secondary" onClick={() => navigate('/app/log')}>
                Open Swap Log
              </Button>
              <Button
                onClick={() => {
                  const partnerId =
                    nextSession.contract.teacherId === currentUser.id
                      ? nextSession.contract.learnerId
                      : nextSession.contract.teacherId;
                  const threadId = startConversation(partnerId, nextSession.contract.id);
                  navigate(`/app/messages?thread=${threadId}`);
                }}
              >
                Open chat
              </Button>
            </div>
          </div>
        ) : (
          <div className="button-row">
            <Button onClick={() => navigate('/app/new')}>Plan a swap</Button>
            <Button tone="secondary" onClick={() => navigate('/app/discover')}>
              Browse listings
            </Button>
          </div>
        )}
      </Panel>

      <Panel eyebrow="Inbox" title="Messages">
        {recentThreads.length ? (
          <div className="thread-list">
            {recentThreads.map((thread) => {
              const partner = users.find(
                (user) => thread.participantIds.includes(user.id) && user.id !== currentUser.id
              );
              const lastMessage = thread.messages.at(-1);
              const partnerLabel = thread.aliasMode ? partner?.anonymousAlias : partner?.displayName;

              return partner ? (
                <button
                  className="thread-row"
                  key={thread.id}
                  onClick={() => navigate(`/app/messages?thread=${thread.id}`)}
                  type="button"
                >
                  <Avatar color={partner.avatar} label={partnerLabel ?? partner.displayName} />
                  <div className="thread-row-main">
                    <div className="thread-row-meta">
                      <strong>{partnerLabel}</strong>
                      <span className="thread-row-time">
                        {lastMessage
                          ? new Intl.DateTimeFormat('en-PH', {
                              hour: 'numeric',
                              minute: '2-digit'
                            }).format(new Date(lastMessage.createdAt))
                          : 'New'}
                      </span>
                    </div>
                    <p className="thread-row-preview">
                      {lastMessage
                        ? lastMessage.imageUrl
                          ? lastMessage.body
                            ? `Photo • ${lastMessage.body}`
                            : 'Sent an image'
                          : lastMessage.body
                        : 'Tap to open the chat.'}
                    </p>
                  </div>
                </button>
              ) : null;
            })}
          </div>
        ) : (
          <p>Message sellers, teachers, and swap partners without leaving the app.</p>
        )}
        <div className="button-row">
          <Button onClick={() => navigate('/app/messages')}>Open messages</Button>
          <Button tone="secondary" onClick={() => navigate('/app/discover')}>
            Find people
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Recommendations" title="Personalized by intent">
        <Segments
          value={filter}
          options={['All', 'Swaps', 'Teachers', 'Workshops', 'Items']}
          onChange={(next) => setFilter(next as IntentFilter)}
        />
        <div className="stack-list">
          {recommendations.map((listing) => (
            <article className="list-card clean-card listing-card" key={listing.id}>
              <img alt={listing.title} className="listing-thumb" src={listing.photos[0]} />
              <div className="listing-card-copy">
                <span className="card-label">{listing.intent}</span>
                <strong>{listing.title}</strong>
                <p>{listing.description}</p>
                <small>
                  {listing.intent === 'item'
                    ? `${dualPrice(listing)} • ${listing.location.city}`
                    : `${listing.ratingAverage.toFixed(1)} rating • ${listing.completedSessions} completed sessions • ${dualPrice(listing)}`}
                </small>
              </div>
              <div className="button-column listing-card-actions">
                {listing.intent === 'item' ? (
                  <Button
                    onClick={() => {
                      const threadId = startConversation(listing.ownerId);
                      navigate(`/app/messages?thread=${threadId}`);
                    }}
                  >
                    Message seller
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      navigate('/app/new', {
                        state: {
                          mode: listing.intent === 'swap' ? 'Swap' : 'Book session',
                          listingId: listing.id
                        }
                      })
                    }
                  >
                    Review flow
                  </Button>
                )}
                <Button tone="secondary" onClick={() => navigate('/app/discover')}>
                  See details
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      {weeklyChallenge ? (
        <Panel
          eyebrow="Weekly challenge"
          title={weeklyChallenge.title}
          aside={<Pill tone="mauve">+{weeklyChallenge.creditReward} cr</Pill>}
        >
          <p>{weeklyChallenge.prompt}</p>
          <ProgressBar max={weeklyChallenge.progressGoal} value={challengeProgress} />
          <div className="metric-inline">
            <span>
              Progress {challengeProgress}/{weeklyChallenge.progressGoal}
            </span>
            <span>{weeklyChallenge.participantIds.length} participants</span>
          </div>
          <div className="button-row">
            <Button onClick={() => navigate('/app/challenges')}>Open challenges</Button>
            <Button tone="secondary" onClick={() => navigate('/app/log')}>
              Open ledger
            </Button>
          </div>
        </Panel>
      ) : null}

      <ModalSheet onClose={() => setShowCredits(false)} open={showCredits} title="Credits explained">
        <div className="stack-list">
          <Panel eyebrow="Why credits exist" title="Asynchronous value, not popularity">
            <p>
              Credits solve the mismatch problem in skill-sharing. You can teach today, earn credits,
              and spend them later on a totally different skill without needing a perfect direct swap.
            </p>
          </Panel>

          <Panel eyebrow="How you earn" title="Transparent earning rules">
            <div className="rule-list">
              <div>
                <strong>Teach a session</strong>
                <p>You earn the listed credits when the learner confirms completion.</p>
              </div>
              <div>
                <strong>Get a 5-star review</strong>
                <p>Bonus +5 credits for strong teaching quality.</p>
              </div>
              <div>
                <strong>Complete weekly challenges</strong>
                <p>Bonus +5 to +15 credits depending on the challenge.</p>
              </div>
              <div>
                <strong>Equal swaps</strong>
                <p>No credits move at all. Equal means equal.</p>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="How you spend" title="Booking with clarity">
            <div className="rule-list">
              <div>
                <strong>Book a teacher</strong>
                <p>Credits are deducted at booking and held until completion.</p>
              </div>
              <div>
                <strong>Book a workshop</strong>
                <p>Some workshops offer either a cash price or a credits price.</p>
              </div>
              <div>
                <strong>Cash and credits coexist</strong>
                <p>Credit transfers are fee-free. Cash bookings show the 9% platform fee explicitly.</p>
              </div>
            </div>
          </Panel>
        </div>
      </ModalSheet>
    </Screen>
  );
}
