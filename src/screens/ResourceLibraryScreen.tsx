import { useMemo, useState } from 'react';
import { Button, EmptyState, Field, ModalSheet, Panel, Screen, SearchField, Toggle } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ResourceLibraryScreen() {
  const currentUser = useCurrentUser();
  const resources = useAppStore((state) => state.resources);
  const hobbies = useAppStore((state) => state.hobbies);
  const reserveResource = useAppStore((state) => state.reserveResource);
  const returnResource = useAppStore((state) => state.returnResource);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [hobbyId, setHobbyId] = useState('all');
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const hobbyMatch = hobbyId === 'all' || resource.hobbyId === hobbyId;
        const queryMatch =
          !query ||
          `${resource.title} ${resource.description} ${resource.location.city}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return hobbyMatch && queryMatch;
      }),
    [resources, hobbyId, query]
  );

  const selected = resources.find((resource) => resource.id === selectedId);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Resource Library"
      subtitle="Borrow equipment for a session, accept return terms clearly, and track what is still in your hands."
    >
      <Panel>
        <SearchField value={query} onChange={setQuery} placeholder="Search by item or city" />
        <Field label="Filter by hobby">
          <select className="text-input" value={hobbyId} onChange={(event) => setHobbyId(event.target.value)}>
            <option value="all">All hobbies</option>
            {hobbies.map((hobby) => (
              <option key={hobby.id} value={hobby.id}>
                {hobby.label}
              </option>
            ))}
          </select>
        </Field>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState title="No lendable resources match that filter" body="Try another hobby or city to widen the shared library." />
      ) : (
        <div className="stack-list">
          {filtered.map((resource) => (
            <article className="list-card" key={resource.id}>
              <div>
                <strong>{resource.title}</strong>
                <p>{resource.description}</p>
                <small>
                  {resource.location.barangay}, {resource.location.city} • {resource.availabilityWindow}
                </small>
              </div>
              <div className="button-column">
                <Button tone="secondary" onClick={() => setSelectedId(resource.id)}>
                  View policy
                </Button>
                {resource.reservation?.userId === currentUser.id ? (
                  <Button onClick={() => returnResource(resource.id)}>Return item</Button>
                ) : resource.reservation ? (
                  <Button disabled tone="secondary">
                    Reserved
                  </Button>
                ) : (
                  <Button onClick={() => setSelectedId(resource.id)}>Reserve</Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ModalSheet open={Boolean(selected)} onClose={() => setSelectedId('')} title={selected?.title ?? 'Resource'}>
        {selected ? (
          <div className="form-stack">
            <p>{selected.description}</p>
            <Panel eyebrow="Return policy" title="Please review before reserving">
              <p>{selected.damagePolicy}</p>
            </Panel>
            <Toggle
              checked={acceptPolicy}
              description="You understand replacement, cleaning, and return expectations."
              label="I accept the damage and return policy"
              onChange={setAcceptPolicy}
            />
            <Button
              onClick={() => {
                reserveResource(selected.id, acceptPolicy);
                setSelectedId('');
                setAcceptPolicy(false);
              }}
            >
              Confirm reservation
            </Button>
          </div>
        ) : null}
      </ModalSheet>
    </Screen>
  );
}
