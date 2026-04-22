import { useState } from 'react';
import { Button, Field, Panel, Pill, Screen, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ChallengesScreen() {
  const currentUser = useCurrentUser();
  const users = useAppStore((state) => state.users);
  const challenges = useAppStore((state) => state.challenges);
  const joinChallenge = useAppStore((state) => state.joinChallenge);
  const submitChallengeEntry = useAppStore((state) => state.submitChallengeEntry);
  const voteChallengeEntry = useAppStore((state) => state.voteChallengeEntry);
  const [form, setForm] = useState({
    caption: '',
    mediaUrl: '',
    mediaType: 'text',
    partnerId: ''
  });

  if (!currentUser) {
    return null;
  }

  const active = challenges.find((challenge) => !challenge.archived);
  const archive = challenges.filter((challenge) => challenge.archived);

  return (
    <Screen
      title="Weekly collaborative challenges"
      subtitle="Small, local, anonymous-friendly prompts that reward participation and team-up energy."
      action={<Pill tone="mauve">New every Monday</Pill>}
    >
      {active ? (
        <Panel eyebrow="This week" title={active.title}>
          <p>{active.prompt}</p>
          <div className="button-row">
            <Button tone="secondary" onClick={() => joinChallenge(active.id)}>
              Join challenge
            </Button>
            <Pill tone="teal">{active.participantIds.length} participants</Pill>
          </div>

          <div className="form-stack">
            <Field label="Entry type">
              <select className="text-input" value={form.mediaType} onChange={(event) => setForm((state) => ({ ...state, mediaType: event.target.value }))}>
                <option value="text">Text reflection</option>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </Field>
            <Field label="Caption or reflection">
              <TextArea value={form.caption} onChange={(event) => setForm((state) => ({ ...state, caption: event.target.value }))} />
            </Field>
            <Field hint="Optional URL for a photo or video submission" label="Media URL">
              <TextInput value={form.mediaUrl} onChange={(event) => setForm((state) => ({ ...state, mediaUrl: event.target.value }))} />
            </Field>
            <Field hint="Optional collaboration nearby" label="Team up with">
              <select className="text-input" value={form.partnerId} onChange={(event) => setForm((state) => ({ ...state, partnerId: event.target.value }))}>
                <option value="">Solo entry</option>
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
              </select>
            </Field>
            <Button
              onClick={() =>
                submitChallengeEntry(
                  active.id,
                  form.mediaType as 'photo' | 'video' | 'text',
                  form.caption,
                  form.mediaUrl || undefined,
                  form.partnerId || undefined
                )
              }
            >
              Submit entry
            </Button>
          </div>

          <div className="stack-list">
            {active.entries.map((entry) => {
              const owner = users.find((user) => user.id === entry.userId);
              return (
                <article className="list-card" key={entry.id}>
                  <div>
                    <strong>{owner?.displayName ?? 'Member'} shared an entry</strong>
                    <p>{entry.caption}</p>
                    {entry.mediaUrl ? (
                      <a className="text-link" href={entry.mediaUrl} rel="noreferrer" target="_blank">
                        Open submission
                      </a>
                    ) : null}
                  </div>
                  <Button tone="secondary" onClick={() => voteChallengeEntry(active.id, entry.id)}>
                    {entry.voters.includes(currentUser.id) ? 'Voted' : 'Vote anonymously'}
                  </Button>
                </article>
              );
            })}
          </div>
        </Panel>
      ) : null}

      <Panel eyebrow="Archive" title="Past prompts">
        <div className="stack-list">
          {archive.map((challenge) => (
            <article className="list-card" key={challenge.id}>
              <div>
                <strong>{challenge.title}</strong>
                <p>{challenge.prompt}</p>
              </div>
              <Pill tone="neutral">Archived</Pill>
            </article>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
