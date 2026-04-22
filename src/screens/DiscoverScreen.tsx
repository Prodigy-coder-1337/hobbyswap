import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPanel, { MapPoint } from '@/components/MapPanel';
import {
  Button,
  EmptyState,
  Field,
  ModalSheet,
  Panel,
  Pill,
  Screen,
  SearchField,
  Segments,
  TextArea
} from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { distanceKm } from '@/services/matchmaking';
import { useAppStore } from '@/store/useAppStore';
import { dualPrice } from '@/utils/format';

const intentColors = {
  teach: '#d86c42',
  swap: '#789e78',
  workshop: '#d8a246'
};

type IntentFilter = 'All' | 'Swaps' | 'Teachers' | 'Workshops';

export default function DiscoverScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const listings = useAppStore((state) => state.listings);
  const saveListingForLater = useAppStore((state) => state.saveListingForLater);
  const [tab, setTab] = useState<IntentFilter>('All');
  const [view, setView] = useState<'Map' | 'List'>('Map');
  const [query, setQuery] = useState('');
  const [selectedSaveId, setSelectedSaveId] = useState('');
  const [saveNote, setSaveNote] = useState('');

  const visible = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return listings
      .filter((listing) => listing.ownerId !== currentUser.id)
      .filter((listing) => {
        if (tab === 'Swaps') {
          return listing.intent === 'swap';
        }
        if (tab === 'Teachers') {
          return listing.intent === 'teach';
        }
        if (tab === 'Workshops') {
          return listing.intent === 'workshop';
        }
        return true;
      })
      .filter((listing) => {
        if (!query.trim()) {
          return true;
        }

        return `${listing.title} ${listing.description} ${listing.location.city}`
          .toLowerCase()
          .includes(query.toLowerCase());
      })
      .map((listing) => ({
        listing,
        distance: distanceKm(
          currentUser.location.lat,
          currentUser.location.lng,
          listing.location.lat,
          listing.location.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [currentUser, listings, query, tab]);

  const points: MapPoint[] = visible.map(({ listing, distance }) => ({
    id: listing.id,
    lat: listing.location.lat,
    lng: listing.location.lng,
    label: listing.title,
    kind:
      listing.intent === 'teach'
        ? 'Teacher'
        : listing.intent === 'swap'
          ? 'Swap'
          : 'Workshop',
    summary: `${distance.toFixed(1)} km • ${dualPrice(listing)}`,
    color: intentColors[listing.intent]
  }));

  const saveTarget = visible.find(({ listing }) => listing.id === selectedSaveId)?.listing;

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Discover"
      subtitle="Explore swaps, teachers, and workshops with clear pricing, local context, and intent-first filtering."
      action={<Pill tone="teal">{visible.length} nearby</Pill>}
    >
      <Panel>
        <SearchField value={query} onChange={setQuery} placeholder="Search by skill, teacher, or city" />
        <Segments
          value={tab}
          options={['All', 'Swaps', 'Teachers', 'Workshops']}
          onChange={(next) => setTab(next as IntentFilter)}
        />
        <Segments value={view} options={['Map', 'List']} onChange={(next) => setView(next as 'Map' | 'List')} />
      </Panel>

      {visible.length === 0 ? (
        <EmptyState
          title="No matches yet"
          body="Try a broader search or switch back to All to widen the local pool."
        />
      ) : view === 'Map' ? (
        <MapPanel points={points} />
      ) : (
        <Panel eyebrow="Nearby options" title="List view">
          <div className="stack-list">
            {visible.map(({ listing, distance }) => (
              <article className="list-card clean-card" key={listing.id}>
                <div>
                  <span className="card-label" style={{ color: intentColors[listing.intent] }}>
                    {listing.intent === 'teach' ? 'Teacher' : listing.intent === 'swap' ? 'Swap' : 'Workshop'}
                  </span>
                  <strong>{listing.title}</strong>
                  <p>{listing.description}</p>
                  <small>
                    {listing.ratingAverage.toFixed(1)} rating • {distance.toFixed(1)} km • {dualPrice(listing)}
                  </small>
                </div>
                <div className="button-column">
                  <Button
                    onClick={() =>
                      navigate('/app/new', {
                        state: {
                          mode: listing.intent === 'swap' ? 'Swap' : 'Book session',
                          listingId: listing.id
                        }
                      })
                    }
                  >
                    Review flow
                  </Button>
                  <Button tone="secondary" onClick={() => setSelectedSaveId(listing.id)}>
                    Save for later
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}

      <div className="sticky-nudge">
        <div>
          <strong>Are you a teacher?</strong>
          <p>Create a listing and set free, credits, cash, or dual pricing.</p>
        </div>
        <Button onClick={() => navigate('/app/new', { state: { mode: 'Create listing' } })}>
          Create a listing
        </Button>
      </div>

      <ModalSheet onClose={() => setSelectedSaveId('')} open={Boolean(saveTarget)} title="Save to shortlist">
        {saveTarget ? (
          <div className="stack-list">
            <Panel eyebrow="Review before saving" title={saveTarget.title}>
              <p>{saveTarget.description}</p>
              <small>{dualPrice(saveTarget)}</small>
            </Panel>
            <Field hint="Optional reminder for future you" label="Short note">
              <TextArea value={saveNote} onChange={(event) => setSaveNote(event.target.value)} />
            </Field>
            <div className="button-row">
              <Button tone="secondary" onClick={() => setSelectedSaveId('')}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  saveListingForLater(saveTarget.id, saveNote);
                  setSaveNote('');
                  setSelectedSaveId('');
                }}
              >
                Confirm save
              </Button>
            </div>
          </div>
        ) : null}
      </ModalSheet>
    </Screen>
  );
}
