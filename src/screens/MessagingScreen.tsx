import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, TextArea } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { decryptMessage } from '@/services/encryption';
import { useAppStore } from '@/store/useAppStore';

export default function MessagingScreen() {
  const [params] = useSearchParams();
  const currentUser = useCurrentUser();
  const threads = useAppStore((state) => state.threads);
  const users = useAppStore((state) => state.users);
  const requestMessageConsent = useAppStore((state) => state.requestMessageConsent);
  const grantMessageConsent = useAppStore((state) => state.grantMessageConsent);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const muteThread = useAppStore((state) => state.muteThread);
  const blockUser = useAppStore((state) => state.blockUser);
  const createReport = useAppStore((state) => state.createReport);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Record<string, string>>({});

  const myThreads = useMemo(
    () =>
      threads.filter((thread) => currentUser && thread.participantIds.includes(currentUser.id)),
    [threads, currentUser]
  );

  useEffect(() => {
    setSelectedId(params.get('thread') ?? myThreads[0]?.id ?? '');
  }, [params, myThreads]);

  const selected = myThreads.find((thread) => thread.id === selectedId) ?? myThreads[0];

  useEffect(() => {
    async function run() {
      if (!selected) {
        return;
      }
      const next = await Promise.all(
        selected.messages.map(async (message) => [message.id, await decryptMessage(message.encryptedBody)] as const)
      );
      setMessages(Object.fromEntries(next));
    }
    void run();
  }, [selected]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Consent-first messaging"
      subtitle="Start with permission, keep aliases on if needed, and use quick boundary tools anytime."
      action={<Pill tone="mauve">{myThreads.length} threads</Pill>}
    >
      <div className="two-pane">
        <Panel eyebrow="Threads" title="Your conversations">
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
                  <p>{thread.consentGranted ? 'Consent granted' : 'Waiting for consent'}</p>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel eyebrow="Conversation" title="Selected thread">
          {selected ? (
            <>
              <div className="button-row">
                {!selected.consentGranted ? (
                  selected.consentRequestedBy === currentUser.id ? (
                    <Button tone="secondary" onClick={() => requestMessageConsent(selected.id)}>
                      Resend consent request
                    </Button>
                  ) : (
                    <Button onClick={() => grantMessageConsent(selected.id)}>Approve conversation</Button>
                  )
                ) : null}
                <Button tone="secondary" onClick={() => muteThread(selected.id)}>
                  Mute
                </Button>
                <Button
                  tone="danger"
                  onClick={() => {
                    const partner = selected.participantIds.find((id) => id !== currentUser.id);
                    if (partner) {
                      blockUser(partner);
                    }
                  }}
                >
                  Block
                </Button>
                <Button
                  tone="secondary"
                  onClick={() =>
                    createReport({
                      subjectType: 'message',
                      subjectId: selected.id,
                      category: 'Boundary issue',
                      details: 'Submitted from within the chat interface.'
                    })
                  }
                >
                  Report
                </Button>
              </div>

              <div className="message-list">
                {selected.messages.map((message) => (
                  <article className={`message-bubble ${message.senderId === currentUser.id ? 'mine' : ''}`} key={message.id}>
                    <p>{messages[message.id] ?? 'Decrypting...'}</p>
                    <small>{message.quickBoundary ? 'Boundary tool' : 'Encrypted message'}</small>
                  </article>
                ))}
              </div>

              <Panel eyebrow="Quick boundaries" title="One-tap responses">
                <div className="button-row">
                  {[
                    "I'm not comfortable with this topic.",
                    'Can we keep this beginner-paced?',
                    'Let’s move this to a public meetup plan.'
                  ].map((text) => (
                    <Button key={text} tone="secondary" onClick={() => void sendMessage(selected.id, text, true)}>
                      {text}
                    </Button>
                  ))}
                </div>
              </Panel>

              <Field
                hint={!selected.consentGranted ? 'Messages stay locked until both sides agree.' : 'Read receipts stay off by default.'}
                label="New message"
              >
                <TextArea value={draft} onChange={(event) => setDraft(event.target.value)} />
              </Field>
              <Button
                disabled={!selected.consentGranted}
                onClick={async () => {
                  await sendMessage(selected.id, draft);
                  setDraft('');
                }}
              >
                Send encrypted message
              </Button>
            </>
          ) : (
            <p>No threads yet. Start a conversation from Discover, Contracts, or Mentorship.</p>
          )}
        </Panel>
      </div>
    </Screen>
  );
}
