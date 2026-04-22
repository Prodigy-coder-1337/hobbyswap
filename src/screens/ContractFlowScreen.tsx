import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, Segments, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ContractFlowScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const users = useAppStore((state) => state.users);
  const contracts = useAppStore((state) => state.contracts);
  const createContract = useAppStore((state) => state.createContract);
  const confirmContract = useAppStore((state) => state.confirmContract);
  const markSessionComplete = useAppStore((state) => state.markSessionComplete);
  const updateContractStatus = useAppStore((state) => state.updateContractStatus);
  const startConversation = useAppStore((state) => state.startConversation);
  const [tab, setTab] = useState<'Active' | 'Pending' | 'New'>('Active');
  const prefilledPartner = (location.state as { partnerId?: string } | null)?.partnerId;
  const [note, setNote] = useState('');
  const [form, setForm] = useState({
    partnerId: prefilledPartner ?? users.find((user) => user.id !== currentUser?.id)?.id ?? '',
    teachSkill: 'Journaling prompts',
    learnSkill: 'Watercolor basics',
    sessions: '2',
    durationMinutes: '90',
    format: 'Hybrid',
    meetingPoint: 'Cafe, library, or video call',
    videoLink: '',
    notes: 'Let’s keep this beginner-friendly and check in after each session.'
  });

  const visibleContracts = useMemo(() => {
    const mine = contracts.filter(
      (contract) => currentUser && [contract.initiatorId, contract.partnerId].includes(currentUser.id)
    );
    return mine.filter((contract) =>
      tab === 'Active'
        ? ['active', 'completed'].includes(contract.status)
        : tab === 'Pending'
          ? contract.status === 'pending'
          : true
    );
  }, [contracts, currentUser, tab]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Skill and time swaps"
      subtitle="Set clear expectations, confirm consent together, and log sessions without awkward ambiguity."
      action={<Pill tone="teal">{visibleContracts.length} shown</Pill>}
    >
      <Segments value={tab} options={['Active', 'Pending', 'New']} onChange={(next) => setTab(next as typeof tab)} />

      {tab === 'New' ? (
        <Panel eyebrow="New agreement" title="Draft a consent-first swap">
          <div className="form-stack">
            <Field label="Swap partner">
              <select className="text-input" value={form.partnerId} onChange={(event) => setForm((state) => ({ ...state, partnerId: event.target.value }))}>
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
              </select>
            </Field>
            <div className="split-fields">
              <Field label="I will teach">
                <TextInput value={form.teachSkill} onChange={(event) => setForm((state) => ({ ...state, teachSkill: event.target.value }))} />
              </Field>
              <Field label="I want to learn">
                <TextInput value={form.learnSkill} onChange={(event) => setForm((state) => ({ ...state, learnSkill: event.target.value }))} />
              </Field>
            </div>
            <div className="split-fields">
              <Field label="Sessions">
                <TextInput value={form.sessions} onChange={(event) => setForm((state) => ({ ...state, sessions: event.target.value }))} />
              </Field>
              <Field label="Duration minutes">
                <TextInput value={form.durationMinutes} onChange={(event) => setForm((state) => ({ ...state, durationMinutes: event.target.value }))} />
              </Field>
            </div>
            <div className="split-fields">
              <Field label="Format">
                <select className="text-input" value={form.format} onChange={(event) => setForm((state) => ({ ...state, format: event.target.value }))}>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online</option>
                </select>
              </Field>
              <Field label="Meeting point or venue">
                <TextInput value={form.meetingPoint} onChange={(event) => setForm((state) => ({ ...state, meetingPoint: event.target.value }))} />
              </Field>
            </div>
            <Field hint="Optional for hybrid or online swaps" label="Video link">
              <TextInput value={form.videoLink} onChange={(event) => setForm((state) => ({ ...state, videoLink: event.target.value }))} />
            </Field>
            <Field label="Shared notes">
              <TextArea value={form.notes} onChange={(event) => setForm((state) => ({ ...state, notes: event.target.value }))} />
            </Field>
            <Button
              onClick={() => {
                createContract({
                  partnerId: form.partnerId,
                  teachSkill: form.teachSkill,
                  learnSkill: form.learnSkill,
                  sessions: Number(form.sessions),
                  durationMinutes: Number(form.durationMinutes),
                  format: form.format as 'In-person' | 'Hybrid' | 'Online',
                  meetingPoint: form.meetingPoint,
                  videoLink: form.videoLink,
                  notes: form.notes
                });
                setTab('Pending');
              }}
            >
              Send contract for review
            </Button>
          </div>
        </Panel>
      ) : (
        <div className="stack-list">
          {visibleContracts.map((contract) => {
            const partnerId =
              contract.initiatorId === currentUser.id ? contract.partnerId : contract.initiatorId;
            const partner = users.find((user) => user.id === partnerId);
            return (
              <Panel eyebrow={contract.status} key={contract.id} title={`${contract.teachSkill} ↔ ${contract.learnSkill}`}>
                <p>Partner: {partner?.displayName}</p>
                <p>{contract.meetingPoint}</p>
                <div className="meta-row">
                  <Pill tone="teal">{contract.sessions} sessions</Pill>
                  <Pill tone="neutral">{contract.durationMinutes} mins each</Pill>
                  <Pill tone="warm">{contract.format}</Pill>
                </div>

                <div className="timeline-list">
                  {contract.sessionRecords.map((session) => (
                    <div className="timeline-row" key={session.id}>
                      <div>
                        <strong>{session.label}</strong>
                        <p>{session.date.slice(0, 10)}</p>
                      </div>
                      {session.status === 'completed' ? (
                        <Pill tone="teal">Completed</Pill>
                      ) : contract.status === 'active' ? (
                        <Button tone="secondary" onClick={() => markSessionComplete(contract.id, session.id)}>
                          Mark complete
                        </Button>
                      ) : (
                        <Pill tone="neutral">Scheduled</Pill>
                      )}
                    </div>
                  ))}
                </div>

                <div className="stack-list">
                  {contract.notes.map((entry) => (
                    <div className="note-box" key={entry}>
                      {entry}
                    </div>
                  ))}
                </div>

                <div className="button-row">
                  {!contract.confirmedBy.includes(currentUser.id) ? (
                    <Button onClick={() => confirmContract(contract.id)}>Confirm terms</Button>
                  ) : null}
                  <Button
                    tone="secondary"
                    onClick={() => {
                      const threadId = startConversation(partnerId, contract.id);
                      navigate(`/app/messages?thread=${threadId}`);
                    }}
                  >
                    Open chat
                  </Button>
                  <Button tone="secondary" onClick={() => updateContractStatus(contract.id, 'completed', 'Both sides confirmed the swap wrapped well.')}>
                    Complete
                  </Button>
                </div>

                <Field hint="Required before dispute or cancel." label="Resolution note">
                  <TextArea value={note} onChange={(event) => setNote(event.target.value)} />
                </Field>
                <div className="button-row">
                  <Button tone="danger" onClick={() => updateContractStatus(contract.id, 'disputed', note)}>
                    Raise dispute
                  </Button>
                  <Button tone="secondary" onClick={() => updateContractStatus(contract.id, 'cancelled', note)}>
                    Cancel swap
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
