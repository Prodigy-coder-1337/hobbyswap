import { useEffect, useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart, MessageCircle, Star, Ticket, X, Zap } from 'lucide-react';
import { Button, EmptyState, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { distanceKm } from '@/services/matchmaking';
import { useAppStore } from '@/store/useAppStore';
import { MarketplaceListing, User } from '@/types/models';
import { dualPrice } from '@/utils/format';

type DiscoverMode = 'people' | 'workshops' | 'items';

type DiscoveryCard =
  | {
      id: string;
      type: 'person';
      title: string;
      subtitle: string;
      hook: string;
      imageUrl: string;
      distance: number;
      chips: string[];
      user: User;
    }
  | {
      id: string;
      type: 'listing';
      title: string;
      subtitle: string;
      hook: string;
      imageUrl: string;
      distance: number;
      chips: string[];
      listing: MarketplaceListing;
    };

const modes: { id: DiscoverMode; label: string }[] = [
  { id: 'people', label: 'Individuals' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'items', label: 'Item listings' }
];

const personPhotos: Record<string, string> = {
  'user-2': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'user-3': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'user-4': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
};

function shortAvailability(slots: string[]) {
  return slots[0]?.replace(',', ' ·') ?? 'Flexible';
}

function listingMode(listing: MarketplaceListing): DiscoverMode | null {
  if (listing.intent === 'workshop') {
    return 'workshops';
  }

  if (listing.intent === 'item' || listing.intent === 'swap') {
    return 'items';
  }

  return null;
}

export default function DiscoverScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const users = useAppStore((state) => state.users);
  const listings = useAppStore((state) => state.listings);
  const saveListingForLater = useAppStore((state) => state.saveListingForLater);
  const startConversation = useAppStore((state) => state.startConversation);
  const [mode, setMode] = useState<DiscoverMode>('people');
  const [cardIndex, setCardIndex] = useState(0);
  const [flash, setFlash] = useState('');
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | null>(null);

  const cards = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const personCards: DiscoveryCard[] = users
      .filter((user) => user.id !== currentUser.id)
      .filter((user) => user.privacy.visibility !== 'Private')
      .filter((user) => !user.anonymousMode)
      .map((user) => {
        const profile = user.hobbyProfiles[0];
        const hobby = hobbies.find((item) => item.id === profile?.hobbyId) ?? hobbies[0];
        const teaches = user.hobbyProfiles.some((entry) => entry.level === 'Can Teach');
        const distance = distanceKm(
          currentUser.location.lat,
          currentUser.location.lng,
          user.location.lat,
          user.location.lng
        );

        return {
          id: `person-${user.id}`,
          type: 'person',
          title: user.displayName,
          subtitle: teaches ? `Can teach ${hobby.label}` : `Learning ${hobby.label}`,
          hook: teaches ? 'Ask for a quick lesson.' : 'Could be your next hobby buddy.',
          imageUrl:
            personPhotos[user.id] ??
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
          distance,
          chips: [
            hobby.label,
            profile?.level ?? 'Beginner',
            user.availability.some((slot) => /sat|sun/i.test(slot)) ? 'Weekend' : 'Flexible'
          ],
          user
        };
      });

    const listingCards: DiscoveryCard[] = listings
      .filter((listing) => listing.ownerId !== currentUser.id)
      .filter((listing) => listingMode(listing) !== null)
      .map((listing) => {
        const hobby = hobbies.find((item) => item.id === listing.hobbyId) ?? hobbies[0];
        const distance = distanceKm(
          currentUser.location.lat,
          currentUser.location.lng,
          listing.location.lat,
          listing.location.lng
        );

        return {
          id: `listing-${listing.id}`,
          type: 'listing',
          title: listing.title,
          subtitle:
            listing.intent === 'workshop'
              ? `${shortAvailability(listing.availability)} · ${listing.location.city}`
              : `${listing.condition} · ${dualPrice(listing)}`,
          hook:
            listing.intent === 'workshop'
              ? 'Save a seat with other hobby people.'
              : 'Like it, save it, or offer a swap.',
          imageUrl: listing.photos[0],
          distance,
          chips:
            listing.intent === 'workshop'
              ? [hobby.label, listing.level, `${listing.ratingAverage.toFixed(1)} host`]
              : [hobby.label, listing.condition, listing.location.city],
          listing
        };
      });

    return [...personCards, ...listingCards].sort((left, right) => left.distance - right.distance);
  }, [currentUser, hobbies, listings, users]);

  const filteredCards = useMemo(
    () =>
      cards.filter((card) =>
        card.type === 'person'
          ? mode === 'people'
          : listingMode(card.listing) === mode
      ),
    [cards, mode]
  );
  const activeCard = filteredCards[cardIndex] ?? null;
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

  useEffect(() => {
    setCardIndex(0);
  }, [mode]);

  function advance(label: string) {
    setFlash(label);
    window.setTimeout(() => setFlash(''), 650);
    setCardIndex((index) => Math.min(index + 1, filteredCards.length));
  }

  function handleSave(card: DiscoveryCard) {
    if (card.type === 'listing') {
      saveListingForLater(card.listing.id);
    }

    advance('Saved');
  }

  function handlePrimary(card: DiscoveryCard) {
    if (card.type === 'person') {
      const threadId = startConversation(card.user.id);
      navigate(`/app/messages?thread=${threadId}`);
      return;
    }

    if (card.listing.intent === 'item' || card.listing.intent === 'swap') {
      const threadId = startConversation(card.listing.ownerId);
      navigate(`/app/messages?thread=${threadId}`);
      return;
    }

    navigate('/app/new', {
      state: {
        mode: 'Book session',
        listingId: card.listing.id
      }
    });
  }

  function handleSwipeEnd(event: PointerEvent<HTMLElement>, card: DiscoveryCard) {
    if (!pointerStart) {
      return;
    }

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    setPointerStart(null);

    if (Math.abs(deltaX) < 56 && Math.abs(deltaY) < 56) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      advance(deltaX > 0 ? 'Liked' : 'Skipped');
      return;
    }

    if (deltaY < 0) {
      advance('Super liked');
      return;
    }

    handleSave(card);
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Screen title="Discover">
      <section className="single-discovery-stage" data-tutorial-target="swipeDeck">
        <div className="discover-filter-bar">
          <label className="discover-mode-select">
            <span>Swipe with</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as DiscoverMode)}>
              {modes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Pill tone="teal">
            {activeCard ? `${cardIndex + 1}/${filteredCards.length}` : '0'}
          </Pill>
        </div>

        {activeCard ? (
          <article
            aria-label={`${activeMode.label} card for ${activeCard.title}`}
            className="swipe-card single-card top-card"
            onPointerCancel={() => setPointerStart(null)}
            onPointerDown={(event) => setPointerStart({ x: event.clientX, y: event.clientY })}
            onPointerUp={(event) => handleSwipeEnd(event, activeCard)}
          >
            <img alt={activeCard.title} className="swipe-card-image" src={activeCard.imageUrl} />
            <div className="swipe-card-gradient" />
            <div className="swipe-card-copy compact-swipe-copy">
              <div className="swipe-card-topline">
                <Pill tone={activeCard.type === 'person' ? 'warm' : mode === 'workshops' ? 'teal' : 'mauve'}>
                  {activeMode.label}
                </Pill>
                <span>{activeCard.distance.toFixed(1)} km</span>
              </div>
              <h2>{activeCard.title}</h2>
              <p>{activeCard.subtitle}</p>
              <div className="chip-wrap">
                {activeCard.chips.slice(0, 3).map((chip) => (
                  <span className="chip" key={`${activeCard.id}-${chip}`}>
                    {chip}
                  </span>
                ))}
              </div>
              <strong className="swipe-one-liner">{activeCard.hook}</strong>
            </div>
            {flash ? <div className="swipe-flash">{flash}</div> : null}
          </article>
        ) : (
          <EmptyState
            title={`No ${activeMode.label.toLowerCase()} left`}
            body="Try another swipe mode or replay this list."
            action={<Button onClick={() => setCardIndex(0)}>Replay</Button>}
          />
        )}
      </section>

      {activeCard ? (
        <>
          <div className="swipe-actions compact-swipe-actions" aria-label="Swipe actions">
            <button className="round-action" onClick={() => advance('Skipped')} type="button">
              <X size={22} />
              <span>Skip</span>
            </button>
            <button className="round-action" onClick={() => handleSave(activeCard)} type="button">
              <Bookmark size={22} />
              <span>Save</span>
            </button>
            <button className="round-action super" onClick={() => advance('Super liked')} type="button">
              <Star size={22} />
              <span>Super</span>
            </button>
            <button className="round-action like" onClick={() => advance('Liked')} type="button">
              <Heart size={22} />
              <span>Like</span>
            </button>
          </div>

          <Button onClick={() => handlePrimary(activeCard)}>
            {activeCard.type === 'person' ? (
              <>
                <MessageCircle size={16} />
                Message
              </>
            ) : mode === 'workshops' ? (
              <>
                <Ticket size={16} />
                Join
              </>
            ) : (
              <>
                <Zap size={16} />
                Swap
              </>
            )}
          </Button>
        </>
      ) : null}
    </Screen>
  );
}
