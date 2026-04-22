import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPanel, { MapPoint } from '@/components/MapPanel';
import {
  Button,
  EmptyState,
  Pagination,
  Panel,
  Pill,
  Screen,
  SearchField,
  Segments
} from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { distanceKm } from '@/services/matchmaking';
import { paginate } from '@/utils/pagination';

export default function DiscoverScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const users = useAppStore((state) => state.users);
  const events = useAppStore((state) => state.events);
  const listings = useAppStore((state) => state.listings);
  const startConversation = useAppStore((state) => state.startConversation);
  const [view, setView] = useState<'Map' | 'List'>('Map');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    hobbyId: 'all',
    format: 'all',
    maxDistance: 15
  });

  const suggestions = useMemo(() => {
    const pool = [
      ...users.map((user) => user.displayName),
      ...events.map((event) => event.title),
      ...listings.map((listing) => listing.title)
    ];
    return pool.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [users, events, listings, query]);

  const results = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const matches = [
      ...users
        .filter((user) => user.id !== currentUser.id)
        .map((user) => ({
          id: `user-${user.id}`,
          kind: 'Person',
          title: user.displayName,
          summary: user.bio,
          hobbyId: user.hobbyProfiles[0]?.hobbyId ?? 'watercolor',
          format: user.preferredFormats[0] ?? 'Hybrid',
          lat: user.location.lat,
          lng: user.location.lng,
          distance: distanceKm(currentUser.location.lat, currentUser.location.lng, user.location.lat, user.location.lng),
          action: () => {
            const threadId = startConversation(user.id);
            navigate(`/app/messages?thread=${threadId}`);
          }
        })),
      ...events.map((event) => ({
        id: `event-${event.id}`,
        kind: 'Event',
        title: event.title,
        summary: event.description,
        hobbyId: 'watercolor',
        format: event.format,
        lat: event.location.lat,
        lng: event.location.lng,
        distance: distanceKm(currentUser.location.lat, currentUser.location.lng, event.location.lat, event.location.lng),
        action: () => navigate('/app/events')
      })),
      ...listings.map((listing) => ({
        id: `listing-${listing.id}`,
        kind: 'Swap',
        title: listing.title,
        summary: listing.description,
        hobbyId: listing.hobbyId,
        format: 'In-person' as const,
        lat: listing.location.lat,
        lng: listing.location.lng,
        distance: distanceKm(currentUser.location.lat, currentUser.location.lng, listing.location.lat, listing.location.lng),
        action: () => navigate('/app/swap')
      }))
    ];

    return matches.filter((result) => {
      const hobbyMatch = filters.hobbyId === 'all' || result.hobbyId === filters.hobbyId;
      const formatMatch = filters.format === 'all' || result.format === filters.format;
      const distanceMatch = result.distance <= filters.maxDistance;
      const queryMatch =
        !query ||
        `${result.title} ${result.summary}`.toLowerCase().includes(query.toLowerCase());
      return hobbyMatch && formatMatch && distanceMatch && queryMatch;
    });
  }, [currentUser, users, events, listings, filters, query, navigate, startConversation]);

  const paged = paginate(results, page, 5);
  const points: MapPoint[] = results.map((result) => ({
    id: result.id,
    lat: result.lat,
    lng: result.lng,
    label: result.title,
    kind: result.kind,
    summary: `${result.kind} • ${result.distance.toFixed(1)} km away`
  }));

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Find nearby hobby energy"
      subtitle="Browse people, swaps, and meetups with a map-first view and tight filters."
      action={<Pill tone="teal">{results.length} matches</Pill>}
    >
      <Panel>
        <SearchField value={query} onChange={setQuery} placeholder="Search hobbies, people, events, or items" />
        {query && suggestions.length ? (
          <div className="suggestion-list">
            {suggestions.map((item) => (
              <button className="suggestion" key={item} onClick={() => setQuery(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        ) : null}

        <div className="filter-row">
          <select
            className="text-input"
            value={filters.hobbyId}
            onChange={(event) => setFilters((state) => ({ ...state, hobbyId: event.target.value }))}
          >
            <option value="all">All hobbies</option>
            {hobbies.map((hobby) => (
              <option key={hobby.id} value={hobby.id}>
                {hobby.label}
              </option>
            ))}
          </select>

          <select
            className="text-input"
            value={filters.format}
            onChange={(event) => setFilters((state) => ({ ...state, format: event.target.value }))}
          >
            <option value="all">All formats</option>
            <option value="In-person">In-person</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Online">Online</option>
          </select>

          <select
            className="text-input"
            value={filters.maxDistance}
            onChange={(event) => setFilters((state) => ({ ...state, maxDistance: Number(event.target.value) }))}
          >
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={15}>Within 15 km</option>
            <option value={25}>Within 25 km</option>
          </select>
        </div>
      </Panel>

      <Segments value={view} options={['Map', 'List']} onChange={(next) => setView(next as 'Map' | 'List')} />

      {results.length === 0 ? (
        <EmptyState
          title="No matches yet"
          body="Try widening your distance or clearing a filter to see more people, events, and listings."
        />
      ) : view === 'Map' ? (
        <MapPanel points={points} />
      ) : (
        <Panel eyebrow="List view" title="Nearby opportunities">
          <div className="stack-list">
            {paged.items.map((result) => (
              <article className="list-card" key={result.id}>
                <div>
                  <span className="card-label">{result.kind}</span>
                  <strong>{result.title}</strong>
                  <p>{result.summary}</p>
                  <small>{result.distance.toFixed(1)} km away</small>
                </div>
                <Button onClick={result.action}>Open</Button>
              </article>
            ))}
          </div>
          <Pagination page={paged.page} totalPages={paged.totalPages} onChange={setPage} />
        </Panel>
      )}
    </Screen>
  );
}
