import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, ChevronLeft, ImagePlus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, EmptyState, Panel, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

const shortTimeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: 'numeric',
  minute: '2-digit'
});

function previewForMessage(message?: { body: string; imageUrl?: string }) {
  if (!message) {
    return 'No messages yet';
  }

  if (message.imageUrl) {
    return message.body ? `Photo • ${message.body}` : 'Sent an image';
  }

  return message.body;
}

export default function MessagingScreen() {
  const [params, setParams] = useSearchParams();
  const currentUser = useCurrentUser();
  const threads = useAppStore((state) => state.threads);
  const users = useAppStore((state) => state.users);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const muteThread = useAppStore((state) => state.muteThread);
  const blockUser = useAppStore((state) => state.blockUser);
  const [draft, setDraft] = useState('');
  const [imageDraft, setImageDraft] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myThreads = useMemo(
    () =>
      threads
        .filter((thread) => currentUser && thread.participantIds.includes(currentUser.id))
        .sort((left, right) => {
          const leftTime = left.messages.at(-1)?.createdAt
            ? new Date(left.messages.at(-1)!.createdAt).getTime()
            : 0;
          const rightTime = right.messages.at(-1)?.createdAt
            ? new Date(right.messages.at(-1)!.createdAt).getTime()
            : 0;
          return rightTime - leftTime;
        }),
    [threads, currentUser]
  );

  const selectedId = params.get('thread') ?? '';
  const selected = myThreads.find((thread) => thread.id === selectedId) ?? null;
  const selectedPartner = selected
    ? users.find((user) => selected.participantIds.includes(user.id) && user.id !== currentUser?.id)
    : null;
  const selectedPartnerLabel = selectedPartner
    ? selected?.aliasMode
      ? selectedPartner.anonymousAlias
      : selectedPartner.displayName
    : '';

  useEffect(() => {
    setDraft('');
    setImageDraft(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedId]);

  if (!currentUser) {
    return null;
  }

  function openThread(threadId: string) {
    setParams({ thread: threadId });
  }

  function closeThread() {
    setParams({});
  }

  function onPickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageDraft(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function submitMessage() {
    if (!selected) {
      return;
    }

    sendMessage(selected.id, draft, false, imageDraft ?? undefined);
    setDraft('');
    setImageDraft(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <Screen
      title="Messages"
      subtitle={
        selected
          ? 'Send a quick note, share an image, and keep the exchange clear.'
          : 'Open a thread to chat with sellers, teachers, and swap partners.'
      }
      action={<Pill tone="teal">{myThreads.length} threads</Pill>}
    >
      {selected && selectedPartner ? (
        <Panel eyebrow={selected.contractId ? 'Session chat' : 'Direct chat'} title={selectedPartnerLabel}>
          <div className="message-thread-header">
            <button className="thread-back-link" onClick={closeThread} type="button">
              <ChevronLeft size={16} />
              <span>All messages</span>
            </button>
            <div className="message-thread-profile">
              <Avatar color={selectedPartner.avatar} label={selectedPartnerLabel} />
              <div className="message-thread-meta">
                <strong>{selectedPartnerLabel}</strong>
                <p>{selectedPartner.location.city}</p>
              </div>
            </div>
            <div className="message-thread-tools">
              <button className="thread-tool" onClick={() => muteThread(selected.id)} type="button">
                {currentUser.mutedThreadIds.includes(selected.id) ? 'Unmute' : 'Mute'}
              </button>
              <button
                className="thread-tool danger"
                onClick={() => blockUser(selectedPartner.id)}
                type="button"
              >
                Block
              </button>
            </div>
          </div>

          <div className="message-list chatbox">
            {selected.messages.length ? (
              selected.messages.map((message) => (
                <article
                  className={`message-bubble ${message.senderId === currentUser.id ? 'mine' : ''}`}
                  key={message.id}
                >
                  {message.imageUrl ? (
                    <img alt="Shared attachment" className="message-image" src={message.imageUrl} />
                  ) : null}
                  {message.body ? <p>{message.body}</p> : null}
                  <div className="message-meta">
                    <small>
                      {message.quickBoundary ? 'Boundary tool' : shortTimeFormatter.format(new Date(message.createdAt))}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="mini-panel">
                <strong>Start the conversation</strong>
                <p>Ask about the item, swap details, or workshop logistics here.</p>
              </div>
            )}
          </div>

          <div className="quick-boundary-list">
            {[
              "I'm interested in this item. Is it still available?",
              'Can we keep this beginner-paced?',
              'Let’s move this into the confirmed session plan.'
            ].map((text) => (
              <button
                className="chip"
                key={text}
                onClick={() => sendMessage(selected.id, text, true)}
                type="button"
              >
                {text}
              </button>
            ))}
          </div>

          {imageDraft ? (
            <div className="image-preview-card">
              <img alt="Selected upload preview" src={imageDraft} />
              <button className="thread-tool" onClick={() => setImageDraft(null)} type="button">
                Remove image
              </button>
            </div>
          ) : null}

          <div className="message-composer">
            <input
              accept="image/*"
              className="composer-file-input"
              onChange={onPickImage}
              ref={fileInputRef}
              type="file"
            />
            <button
              className="composer-attach"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <ImagePlus size={18} />
            </button>
            <textarea
              className="composer-input"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message"
              rows={1}
              value={draft}
            />
            <button
              className="composer-send"
              disabled={!draft.trim() && !imageDraft}
              onClick={submitMessage}
              type="button"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </Panel>
      ) : (
        <Panel eyebrow="Inbox" title="Recent conversations">
          {myThreads.length ? (
            <div className="thread-list">
              {myThreads.map((thread) => {
                const partner = users.find(
                  (user) => thread.participantIds.includes(user.id) && user.id !== currentUser.id
                );
                const partnerLabel = thread.aliasMode ? partner?.anonymousAlias : partner?.displayName;
                const lastMessage = thread.messages.at(-1);

                return partner ? (
                  <button
                    className="thread-row"
                    key={thread.id}
                    onClick={() => openThread(thread.id)}
                    type="button"
                  >
                    <Avatar color={partner.avatar} label={partnerLabel ?? partner.displayName} />
                    <div className="thread-row-main">
                      <div className="thread-row-meta">
                        <strong>{partnerLabel}</strong>
                        <span className="thread-row-time">
                          {lastMessage ? shortTimeFormatter.format(new Date(lastMessage.createdAt)) : 'New'}
                        </span>
                      </div>
                      <p className="thread-row-preview">{previewForMessage(lastMessage)}</p>
                    </div>
                  </button>
                ) : null;
              })}
            </div>
          ) : (
            <EmptyState
              title="No chats yet"
              body="Open a seller, teacher, or swap partner profile and the chat will appear here."
            />
          )}
        </Panel>
      )}
    </Screen>
  );
}
