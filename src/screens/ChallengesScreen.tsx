import { Button, Panel, Pill, ProgressBar, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

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
      title="Challenges"
      subtitle="Private weekly prompts that reward teaching, swapping, and sharing without a public feed."
      action={<Pill tone="mauve">{active.length} active</Pill>}
    >
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
                <span>
                  Progress {progress}/{challenge.progressGoal}
                </span>
                <span>{challenge.participantIds.length} participants</span>
              </div>
              <div className="button-row">
                <Button tone="secondary" onClick={() => joinChallenge(challenge.id)}>
                  {joined ? 'Joined' : 'Join challenge'}
                </Button>
                <Button disabled={rewarded} onClick={() => advanceChallenge(challenge.id)}>
                  {rewarded ? 'Reward claimed' : 'Log progress'}
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel eyebrow="Credit earning guide" title="How the rules work">
        <div className="rule-list">
          <div>
            <strong>Teach a session</strong>
            <p>+10 to +20 credits depending on the listing you set.</p>
          </div>
          <div>
            <strong>Get a 5-star review</strong>
            <p>+5 credits bonus for high-quality teaching.</p>
          </div>
          <div>
            <strong>Equal swaps</strong>
            <p>±0 credits. Equal means equal.</p>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Archive" title="Past challenges">
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
    </Screen>
  );
}
