import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, TextArea } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function MessagingScreen() {
  const [params] = useSearchParams();
  const currentUser = useCurrentUser();
  const threads = useAppStore((state) => state.threads);
  const users = useAppStore((state) => state.users);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const muteThread = useAppStore((state) => state.muteThread);
  const blockUser = useAppStore((state) => state.blockUser);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState('');

  const myThreads = useMemo(
    () => threads.filter((thread) => currentUser && thread.participantIds.includes(currentUser.id)),
    [threads, currentUser]
  );

  useEffect(() => {
    setSelectedId(params.get('thread') ?? myThreads[0]?.id ?? '');
  }, [params, myThreads]);

  const selected = myThreads.find((thread) => thread.id === selectedId) ?? myThreads[0];

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Messages"
      subtitle="Plain-text messaging so the full interface stays easy to present, review, and understand."
      action={<Pill tone="teal">{myThreads.length} threads</Pill>}
    >
      <div className="two-pane">
        <Panel eyebrow="Threads" title="Recent conversations">
          <div className="stack-list">
            {myThreads.map((thread) => {
              const partner = users.find(
                (user) => thread.participantIds.includes(user.id) && user.id !== currentUser.id
              );
              return (
                <button
                  className={`thread-card ${thread.id === selected?.id ? 'active' : ''}`}
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  type="button"
                >
                  <strong>{thread.aliasMode ? partner?.anonymousAlias : partner?.displayName}</strong>
                  <p>{thread.messages.at(-1)?.body ?? 'No messages yet'}</p>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel eyebrow="Conversation" title="Selected thread">
          {selected ? (
            <>
              <div className="button-row">
                <Button tone="secondary" onClick={() => muteThread(selected.id)}>
                  Mute
                </Button>
                <Button
                  tone="danger"
                  onClick={() => {
                    const partnerId = selected.participantIds.find((id) => id !== currentUser.id);
                    if (partnerId) {
                      blockUser(partnerId);
                    }
                  }}
                >
                  Block
                </Button>
              </div>

              <div className="message-list">
                {selected.messages.map((message) => (
                  <article className={`message-bubble ${message.senderId === currentUser.id ? 'mine' : ''}`} key={message.id}>
                    <p>{message.body}</p>
                    <small>{message.quickBoundary ? 'Boundary tool' : 'Message'}</small>
                  </article>
                ))}
              </div>

              <Panel eyebrow="Quick responses" title="Useful boundaries">
                <div className="button-row">
                  {[
                    "I'm not comfortable with this topic.",
                    'Can we keep this beginner-paced?',
                    'Let’s move this into the confirmed session plan.'
                  ].map((text) => (
                    <Button key={text} tone="secondary" onClick={() => sendMessage(selected.id, text, true)}>
                      {text}
                    </Button>
                  ))}
                </div>
              </Panel>

              <Field hint="Read receipts stay off by default." label="New message">
                <TextArea value={draft} onChange={(event) => setDraft(event.target.value)} />
              </Field>
              <Button
                onClick={() => {
                  sendMessage(selected.id, draft);
                  setDraft('');
                }}
              >
                Send message
              </Button>
            </>
          ) : (
            <p>No threads yet. Start from Discover, Home, or the New flow.</p>
          )}
        </Panel>
      </div>
    </Screen>
  );
}
