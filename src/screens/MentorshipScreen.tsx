import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function MentorshipScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const users = useAppStore((state) => state.users);
  const hobbies = useAppStore((state) => state.hobbies);
  const startMentorship = useAppStore((state) => state.startMentorship);
  const startConversation = useAppStore((state) => state.startConversation);
  const [hobbyId, setHobbyId] = useState(currentUser?.hobbyProfiles[0]?.hobbyId ?? 'watercolor');

  const candidates = useMemo(
    () =>
      users.filter(
        (user) =>
          user.id !== currentUser?.id &&
          user.hobbyProfiles.some(
            (profile) => profile.hobbyId === hobbyId && ['Comfortable', 'Can Teach'].includes(profile.level)
          )
      ),
    [users, currentUser, hobbyId]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Peer mentorship matching"
      subtitle="Find someone who has simply been doing a hobby a bit longer and wants to share without hierarchy."
      action={<Pill tone="teal">{candidates.length} matches</Pill>}
    >
      <Panel eyebrow="Filter" title="Pick a hobby">
        <Field label="Hobby focus">
          <select className="text-input" value={hobbyId} onChange={(event) => setHobbyId(event.target.value)}>
            {hobbies.map((hobby) => (
              <option key={hobby.id} value={hobby.id}>
                {hobby.label}
              </option>
            ))}
          </select>
        </Field>
      </Panel>

      <div className="stack-list">
        {candidates.map((candidate) => (
          <Panel eyebrow={candidate.location.city} key={candidate.id} title={candidate.displayName}>
            <p>{candidate.bio}</p>
            <p>Availability: {candidate.availability.join(', ')}</p>
            <div className="button-row">
              <Button
                onClick={() => {
                  startMentorship(candidate.id, hobbyId);
                  navigate('/app/contracts');
                }}
              >
                Request peer mentorship
              </Button>
              <Button
                tone="secondary"
                onClick={() => {
                  const threadId = startConversation(candidate.id);
                  navigate(`/app/messages?thread=${threadId}`);
                }}
              >
                Start chat
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </Screen>
  );
}
