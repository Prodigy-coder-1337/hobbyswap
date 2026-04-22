import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, Segments, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils/date';

export default function EventsScreen() {
  const [params, setParams] = useSearchParams();
  const currentUser = useCurrentUser();
  const events = useAppStore((state) => state.events);
  const rsvpEvent = useAppStore((state) => state.rsvpEvent);
  const hostEvent = useAppStore((state) => state.hostEvent);
  const checkInEvent = useAppStore((state) => state.checkInEvent);
  const saveEventRecap = useAppStore((state) => state.saveEventRecap);
  const [tab, setTab] = useState<'Upcoming' | 'Host'>('Upcoming');
  const [recap, setRecap] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '2026-05-05T00:00:00.000Z',
    time: '4:00 PM',
    format: 'Hybrid',
    requiredSkill: 'Beginner',
    capacity: '12',
    barangay: currentUser?.location.barangay ?? 'Poblacion',
    city: currentUser?.location.city ?? 'Makati'
  });

  useEffect(() => {
    if (params.get('host') === '1') {
      setTab('Host');
      setParams({});
    }
  }, [params, setParams]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Events and meetups"
      subtitle="Browse local sessions, host beginner-friendly gatherings, and keep RSVP reminders useful instead of noisy."
      action={<Pill tone="teal">{events.length} meetups</Pill>}
    >
      <Segments value={tab} options={['Upcoming', 'Host']} onChange={(next) => setTab(next as typeof tab)} />

      {tab === 'Upcoming' ? (
        <>
          <Panel eyebrow="Availability sync" title="Your current open windows">
            <div className="chip-wrap">
              {currentUser.availability.map((slot) => (
                <span className="chip active" key={slot}>
                  {slot}
                </span>
              ))}
            </div>
          </Panel>
          <div className="stack-list">
            {events.map((event) => (
              <Panel eyebrow={event.moderationStatus} key={event.id} title={event.title}>
                <p>{event.description}</p>
                <p>
                  {formatDate(event.date)} • {event.time} • {event.location.barangay}, {event.location.city}
                </p>
                <p>
                  Capacity {event.attendeeIds.length}/{event.capacity} • {event.requiredSkill}
                </p>
                <div className="button-row">
                  <Button tone="secondary" onClick={() => rsvpEvent(event.id)}>
                    {event.attendeeIds.includes(currentUser.id) ? 'RSVP’d' : 'RSVP'}
                  </Button>
                  {event.attendeeIds.includes(currentUser.id) ? (
                    <Button onClick={() => checkInEvent(event.id)}>Check in</Button>
                  ) : null}
                </div>
                <Field hint="Optional host or attendee recap after the meetup" label="Post-event recap">
                  <TextArea value={recap} onChange={(entry) => setRecap(entry.target.value)} />
                </Field>
                <Button tone="secondary" onClick={() => saveEventRecap(event.id, recap)}>
                  Save recap
                </Button>
              </Panel>
            ))}
          </div>
        </>
      ) : (
        <Panel eyebrow="Host a meetup" title="Keep it clear, small, and beginner-safe">
          <div className="form-stack">
            <Field label="Event title">
              <TextInput value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
            </Field>
            <Field label="Description">
              <TextArea value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} />
            </Field>
            <div className="split-fields">
              <Field label="Date">
                <TextInput value={form.date} onChange={(event) => setForm((state) => ({ ...state, date: event.target.value }))} />
              </Field>
              <Field label="Time">
                <TextInput value={form.time} onChange={(event) => setForm((state) => ({ ...state, time: event.target.value }))} />
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
              <Field label="Required skill">
                <select className="text-input" value={form.requiredSkill} onChange={(event) => setForm((state) => ({ ...state, requiredSkill: event.target.value }))}>
                  <option value="Beginner">Beginner</option>
                  <option value="Learning">Learning</option>
                  <option value="Comfortable">Comfortable</option>
                  <option value="Can Teach">Can Teach</option>
                </select>
              </Field>
            </div>
            <div className="split-fields">
              <Field label="Barangay">
                <TextInput value={form.barangay} onChange={(event) => setForm((state) => ({ ...state, barangay: event.target.value }))} />
              </Field>
              <Field label="City">
                <TextInput value={form.city} onChange={(event) => setForm((state) => ({ ...state, city: event.target.value }))} />
              </Field>
            </div>
            <Field hint="HobbySwap requires you to confirm the event is consent-first, beginner-friendly, and suited to a safe venue." label="Capacity">
              <TextInput value={form.capacity} onChange={(event) => setForm((state) => ({ ...state, capacity: event.target.value }))} />
            </Field>
            <Button
              onClick={() =>
                hostEvent({
                  title: form.title,
                  description: form.description,
                  date: form.date,
                  time: form.time,
                  format: form.format as 'In-person' | 'Hybrid' | 'Online',
                  requiredSkill: form.requiredSkill as 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach',
                  capacity: Number(form.capacity),
                  location: {
                    barangay: form.barangay,
                    city: form.city,
                    lat: currentUser.location.lat,
                    lng: currentUser.location.lng
                  }
                })
              }
            >
              Submit for moderation review
            </Button>
          </div>
        </Panel>
      )}
    </Screen>
  );
}
