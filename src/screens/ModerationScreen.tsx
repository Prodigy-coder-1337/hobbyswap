import { useMemo, useState } from 'react';
import { Button, Field, Panel, Screen, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ModerationScreen() {
  const currentUser = useCurrentUser();
  const users = useAppStore((state) => state.users);
  const reports = useAppStore((state) => state.reports);
  const createReport = useAppStore((state) => state.createReport);
  const [form, setForm] = useState({
    subjectType: 'user',
    subjectId: users.find((user) => user.id !== currentUser?.id)?.id ?? '',
    category: 'Safety concern',
    details: ''
  });

  const blocked = useMemo(
    () => users.filter((user) => currentUser?.blockedUserIds.includes(user.id)),
    [users, currentUser]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Moderation and safety"
      subtitle="Use reporting, verification, and boundary tools to keep the community calm, local, and respectful."
    >
      <Panel eyebrow="Report something" title="Multi-step report intake">
        <div className="form-stack">
          <Field label="Subject type">
            <select className="text-input" value={form.subjectType} onChange={(event) => setForm((state) => ({ ...state, subjectType: event.target.value }))}>
              <option value="user">User</option>
              <option value="listing">Listing</option>
              <option value="video">Video</option>
              <option value="message">Message</option>
              <option value="event">Event</option>
            </select>
          </Field>
          <Field label="Subject ID">
            <TextInput value={form.subjectId} onChange={(event) => setForm((state) => ({ ...state, subjectId: event.target.value }))} />
          </Field>
          <Field label="Category">
            <select className="text-input" value={form.category} onChange={(event) => setForm((state) => ({ ...state, category: event.target.value }))}>
              <option value="Safety concern">Safety concern</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Misleading listing">Misleading listing</option>
              <option value="Boundary issue">Boundary issue</option>
              <option value="Copyright">Copyright</option>
            </select>
          </Field>
          <Field label="Details">
            <TextArea value={form.details} onChange={(event) => setForm((state) => ({ ...state, details: event.target.value }))} />
          </Field>
          <Button
            onClick={() =>
              createReport({
                subjectType: form.subjectType as 'user' | 'listing' | 'video' | 'message' | 'event',
                subjectId: form.subjectId,
                category: form.category as 'Safety concern' | 'Spam' | 'Harassment' | 'Misleading listing' | 'Boundary issue' | 'Copyright',
                details: form.details
              })
            }
          >
            Submit report
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Boundary tools" title="Quick scripts you can copy into chats">
        <div className="stack-list">
          {[
            "I'm not comfortable meeting in a private place.",
            'I need to keep this conversation focused on the hobby exchange.',
            'Let’s pause and revisit the agreement before continuing.'
          ].map((line) => (
            <div className="note-box" key={line}>
              {line}
            </div>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Blocked users" title="People you have blocked">
        <div className="stack-list">
          {blocked.length ? blocked.map((user) => <div className="list-card" key={user.id}><strong>{user.displayName}</strong></div>) : <p>No blocked users right now.</p>}
        </div>
      </Panel>

      <Panel eyebrow="Moderator queue" title="Simulated admin review">
        <div className="stack-list">
          {reports.map((report) => (
            <article className="list-card" key={report.id}>
              <div>
                <strong>{report.category}</strong>
                <p>{report.details}</p>
                <small>{report.status}</small>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Guidelines" title="Always accessible community rules">
        <p>Respect consent, avoid coercion, keep listings honest, prefer public meeting points for early interactions, and use the in-app tools when something feels off.</p>
      </Panel>
    </Screen>
  );
}
