import { Gift, Sparkles, Ticket, Trophy, UserPlus, Zap } from 'lucide-react';
import { Button, Panel, Pill, ProgressBar, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

const creditWays = [
  { title: 'Complete your profile', reward: '+10 cr', icon: Sparkles },
  { title: 'Join a workshop', reward: '+15 cr', icon: Ticket },
  { title: 'Teach a skill', reward: '+25 cr', icon: Zap },
  { title: 'Invite a friend', reward: '+20 cr', icon: UserPlus },
  { title: 'Complete a challenge', reward: '+10 cr', icon: Trophy }
];

export default function ChallengesScreen() {
  const currentUser = useCurrentUser();
  const challenges = useAppStore((state) => state.challenges);
  const joinChallenge = useAppStore((state) => state.joinChallenge);
  const advanceChallenge = useAppStore((state) => state.advanceChallenge);

  if (!currentUser) {
    return null;
  }

  const active = challenges.filter((challenge) => !challenge.archived);
  const archived = challenges.filter((challenge) => challenge.archived);

  return (
    <Screen
      title="Rewards"
      subtitle="Tiny missions. Real credits."
      action={<Pill tone="mauve">{active.length} live</Pill>}
    >
      <section className="reward-hero">
        <Gift size={24} />
        <h2>Earn credits by showing up.</h2>
        <p>Complete simple hobby actions, collect badges, and unlock more ways to learn.</p>
      </section>

      <Panel eyebrow="Earn credits" title="5 simple ways">
        <div className="credit-way-grid">
          {creditWays.map((way) => {
            const Icon = way.icon;
            return (
              <article className="credit-way-card" key={way.title}>
                <Icon size={20} />
                <strong>{way.title}</strong>
                <Pill tone="teal">{way.reward}</Pill>
              </article>
            );
          })}
        </div>
      </Panel>

      <div className="stack-list">
        {active.map((challenge) => {
          const progress = challenge.userProgress[currentUser.id] ?? 0;
          const joined = challenge.participantIds.includes(currentUser.id);
          const rewarded = challenge.rewardedUserIds.includes(currentUser.id);

          return (
            <Panel
              aside={<Pill tone="teal">+{challenge.creditReward} cr</Pill>}
              eyebrow={challenge.focus}
              key={challenge.id}
              title={challenge.title}
            >
              <p>{challenge.prompt}</p>
              <ProgressBar max={challenge.progressGoal} value={progress} />
              <div className="metric-inline">
                <span>{progress}/{challenge.progressGoal} done</span>
                <span>{challenge.participantIds.length} joined</span>
              </div>
              <div className="button-row">
                <Button tone="secondary" onClick={() => joinChallenge(challenge.id)}>
                  {joined ? 'Joined' : 'Join'}
                </Button>
                <Button disabled={rewarded} onClick={() => advanceChallenge(challenge.id)}>
                  {rewarded ? 'Reward claimed' : 'Log progress'}
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel eyebrow="Badges" title="Recent wins">
        <div className="badge-strip">
          <span>First Workshop</span>
          <span>Weekend Explorer</span>
          <span>Helpful Teacher</span>
        </div>
      </Panel>

      {archived.length ? (
        <Panel eyebrow="Past" title="Previous prompts">
          <div className="stack-list">
            {archived.map((challenge) => (
              <article className="list-card clean-card" key={challenge.id}>
                <div>
                  <strong>{challenge.title}</strong>
                  <p>{challenge.prompt}</p>
                  <small>Reward: +{challenge.creditReward} cr</small>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}
    </Screen>
  );
}
