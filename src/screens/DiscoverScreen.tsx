import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  Star,
  Ticket,
  X,
  Zap
} from 'lucide-react';
import { Button, EmptyState, ModalSheet, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { distanceKm } from '@/services/matchmaking';
import { useAppStore } from '@/store/useAppStore';
import { MarketplaceListing, User } from '@/types/models';
import { dualPrice } from '@/utils/format';

type CategoryId =
  | 'learn'
  | 'teach'
  | 'workshops'
  | 'items'
  | 'nearby'
  | 'beginner'
  | 'trending'
  | 'weekend'
  | 'verified';

type CategoryStyle = CSSProperties & { '--category-color': string; '--category-image': string };
type StackStyle = CSSProperties & { '--stack-offset': string };

type DiscoveryCard =
  | {
      id: string;
      type: 'person';
      title: string;
      subtitle: string;
      hook: string;
      hobbyLabel: string;
      level: string;
      location: string;
      distance: number;
      tags: string[];
      photoUrl: string;
      user: User;
    }
  | {
      id: string;
      type: 'listing';
      title: string;
      subtitle: string;
      hook: string;
      hobbyLabel: string;
      level: string;
      location: string;
      distance: number;
      tags: string[];
      listing: MarketplaceListing;
    };

const categories: { id: CategoryId; title: string; label: string; tone: string; icon: string; image: string }[] = [
  {
    id: 'learn',
    title: 'Learn Today',
    label: 'Start fast',
    tone: '#ff5a5f',
    icon: 'Spark',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'teach',
    title: 'Teach a Skill',
    label: 'Share what you know',
    tone: '#35d0ba',
    icon: 'Teach',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'workshops',
    title: 'Join a Workshop',
    label: 'Group energy',
    tone: '#ffd166',
    icon: 'Seat',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'items',
    title: 'Swap Items',
    label: 'Gear and supplies',
    tone: '#7f6bd4',
    icon: 'Gear',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nearby',
    title: 'Nearby Hobbyists',
    label: 'Close to you',
    tone: '#ef8b5a',
    icon: 'Near',
    image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'beginner',
    title: 'Beginner Friendly',
    label: 'No pressure',
    tone: '#5a73c8',
    icon: 'Easy',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'trending',
    title: 'Trending Hobbies',
    label: 'Popular now',
    tone: '#cc5f8d',
    icon: 'Hot',
    image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'weekend',
    title: 'Free This Weekend',
    label: 'Open slots',
    tone: '#789e78',
    icon: 'Sat',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'verified',
    title: 'Verified Teachers',
    label: 'Trusted hosts',
    tone: '#d8a246',
    icon: 'Pro',
    image: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=800&q=80'
  }
];

const personPhotos: Record<string, string> = {
  'user-2': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'user-3': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'user-4': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
};

function matchesCategory(card: DiscoveryCard, category: CategoryId) {
  if (category === 'learn') {
    return true;
  }

  if (category === 'teach') {
    return card.type === 'person'
      ? card.user.hobbyProfiles.some((profile) => profile.level === 'Can Teach')
      : card.listing.intent === 'teach';
  }

  if (category === 'workshops') {
    return card.type === 'listing' && card.listing.intent === 'workshop';
  }

  if (category === 'items') {
    return card.type === 'listing' && (card.listing.intent === 'item' || card.listing.intent === 'swap');
  }

  if (category === 'nearby') {
    return card.distance <= 8;
  }

  if (category === 'beginner') {
    return card.level === 'Beginner' || card.tags.includes('Beginner Friendly');
  }

  if (category === 'trending') {
    return ['Film Photo', 'Guitar', 'Crochet', 'Watercolor', 'Journaling'].includes(card.hobbyLabel);
  }

  if (category === 'weekend') {
    return card.type === 'person'
      ? card.user.availability.some((slot) => /sat|sun|weekend/i.test(slot))
      : card.listing.availability.some((slot) => /sat|sun|weekend/i.test(slot));
  }

  return card.type === 'person'
    ? card.user.verifiedLocalId || card.user.verifiedPhone
    : card.tags.includes('Verified Teacher') || card.tags.includes('Workshop Host');
}

function cardKind(card: DiscoveryCard) {
  if (card.type === 'person') {
    return card.user.hobbyProfiles.some((profile) => profile.level === 'Can Teach') ? 'Teacher' : 'Hobbyist';
  }

  if (card.listing.intent === 'workshop') {
    return 'Workshop';
  }

  if (card.listing.intent === 'item') {
    return 'Item';
  }

  if (card.listing.intent === 'teach') {
    return 'Teacher';
  }

  return 'Swap';
}

function shortAvailability(slots: string[]) {
  return slots[0]?.replace(',', ' ·') ?? 'Flexible';
}

function hostRating(listing: MarketplaceListing) {
  return `${listing.ratingAverage.toFixed(1)} host`;
}

function cardMetaChips(card: DiscoveryCard) {
  if (card.type === 'person') {
    return [card.hobbyLabel, card.level, card.tags[1], card.location].filter(Boolean);
  }

  if (card.listing.intent === 'workshop') {
    return [
      shortAvailability(card.listing.availability),
      card.location,
      dualPrice(card.listing),
      hostRating(card.listing),
      card.level
    ];
  }

  if (card.listing.intent === 'item') {
    return [card.listing.category, card.listing.condition, dualPrice(card.listing), card.location];
  }

  return [card.hobbyLabel, card.level, card.location, dualPrice(card.listing)];
}

function cardSecondaryLine(card: DiscoveryCard) {
  if (card.type === 'person') {
    return card.tags.slice(0, 3).join(' · ');
  }

  if (card.listing.intent === 'workshop') {
    return `${shortAvailability(card.listing.availability)} · ${hostRating(card.listing)} · ${dualPrice(card.listing)}`;
  }

  if (card.listing.intent === 'item') {
    return `${card.listing.condition} · ${dualPrice(card.listing)} · ${card.location}`;
  }

  return `${card.listing.format} · ${dualPrice(card.listing)}`;
}

export default function DiscoverScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const users = useAppStore((state) => state.users);
  const listings = useAppStore((state) => state.listings);
  const saveListingForLater = useAppStore((state) => state.saveListingForLater);
  const startConversation = useAppStore((state) => state.startConversation);
  const [category, setCategory] = useState<CategoryId>('learn');
  const [cardIndex, setCardIndex] = useState(0);
  const [flash, setFlash] = useState('');
  const [detailCard, setDetailCard] = useState<DiscoveryCard | null>(null);
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
        const distance = distanceKm(
          currentUser.location.lat,
          currentUser.location.lng,
          user.location.lat,
          user.location.lng
        );
        const teaches = user.hobbyProfiles.some((entry) => entry.level === 'Can Teach');

        return {
          id: `person-${user.id}`,
          type: 'person',
          title: user.displayName,
          subtitle: teaches ? `Can teach ${hobby.label}` : `Wants to learn ${hobby.label}`,
          hook: teaches ? 'Ask for a quick lesson.' : 'Could be your next hobby buddy.',
          hobbyLabel: hobby.label,
          level: profile?.level ?? 'Beginner',
          location: user.privacy.showExactLocation ? `${user.location.barangay}, ${user.location.city}` : user.location.city,
          distance,
          tags: [
            profile?.level === 'Beginner' ? 'Beginner Friendly' : profile?.level ?? 'Learning',
            user.availability.some((slot) => /sat|sun/i.test(slot)) ? 'Available Weekend' : 'Flexible',
            teaches ? 'Workshop Host' : 'Nearby',
            user.verifiedLocalId || user.verifiedPhone ? 'Verified' : 'New'
          ],
          photoUrl:
            personPhotos[user.id] ??
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
          user
        };
      });

    const listingCards: DiscoveryCard[] = listings
      .filter((listing) => listing.ownerId !== currentUser.id)
      .map((listing) => {
        const hobby = hobbies.find((item) => item.id === listing.hobbyId) ?? hobbies[0];
        const owner = users.find((user) => user.id === listing.ownerId);
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
            listing.intent === 'item'
              ? `${listing.condition} ${hobby.label} gear`
              : `${listing.level} ${hobby.label}`,
          hook:
            listing.intent === 'workshop'
              ? 'Grab a seat with other beginners.'
              : listing.intent === 'item'
                ? 'Like it, save it, or offer a swap.'
                : listing.intent === 'teach'
                  ? 'Book a friendly teacher.'
                  : 'Trade skills without the pressure.',
          hobbyLabel: hobby.label,
          level: listing.level,
          location: listing.location.city,
          distance,
          tags: [
            listing.level === 'Beginner' ? 'Beginner Friendly' : listing.level,
            listing.intent === 'workshop' ? 'Workshop Host' : cardIntentLabel(listing.intent),
            listing.availability.some((slot) => /sat|sun/i.test(slot)) ? 'Available Weekend' : listing.format,
            owner?.verifiedLocalId || owner?.verifiedPhone ? 'Verified Teacher' : 'Community'
          ],
          listing
        };
      });

    return [...personCards, ...listingCards].sort((left, right) => left.distance - right.distance);
  }, [currentUser, hobbies, listings, users]);

  const visibleCards = useMemo(
    () => cards.filter((card) => matchesCategory(card, category)),
    [cards, category]
  );
  const deck = visibleCards.slice(cardIndex, cardIndex + 3);
  const activeCard = deck[0] ?? null;
  const activeCategory = categories.find((item) => item.id === category) ?? categories[0];

  useEffect(() => {
    setCardIndex(0);
  }, [category]);

  function advance(label: string) {
    setFlash(label);
    window.setTimeout(() => setFlash(''), 700);
    setCardIndex((index) => Math.min(index + 1, visibleCards.length));
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

  function messageCard(card: DiscoveryCard) {
    const partnerId = card.type === 'person' ? card.user.id : card.listing.ownerId;
    const threadId = startConversation(partnerId);
    navigate(`/app/messages?thread=${threadId}`);
  }

  function shareCard(card: DiscoveryCard) {
    const text = `${card.title} on HobbySwap: ${card.hook}`;
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      void shareNavigator.share({ title: card.title, text });
    } else {
      void navigator.clipboard?.writeText(text);
    }

    setFlash('Shared');
    window.setTimeout(() => setFlash(''), 700);
  }

  function handleSwipeEnd(event: PointerEvent<HTMLElement>, card: DiscoveryCard, isTop: boolean) {
    if (!isTop || !pointerStart) {
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
    <Screen
      title="Swipe to discover"
      subtitle="People, workshops, and hobby gear near you."
      action={<Pill tone="teal">{visibleCards.length} cards</Pill>}
    >
      <div className="category-carousel" aria-label="Discovery categories">
        {categories.map((item) => (
          <button
            className={`category-tile ${category === item.id ? 'active' : ''}`}
            key={item.id}
            onClick={() => setCategory(item.id)}
            style={{ '--category-color': item.tone, '--category-image': `url(${item.image})` } as CategoryStyle}
            type="button"
          >
            <span className="category-icon">{item.icon}</span>
            <span>{item.title}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>

      <section className="deck-stage">
        <div className="deck-header">
          <div>
            <p className="panel-eyebrow">{activeCategory.title}</p>
            <strong>{activeCategory.label}</strong>
          </div>
          <Pill tone="mauve">Swipe deck</Pill>
        </div>

        {activeCard ? (
          <div className="card-stack-area">
            {deck
              .slice()
              .reverse()
              .map((card, index) => {
                const isTop = index === deck.length - 1;

                return (
                  <article
                    aria-label={`${cardKind(card)} card for ${card.title}`}
                    className={`swipe-card ${isTop ? 'top-card' : ''}`}
                    key={card.id}
                    onPointerCancel={() => setPointerStart(null)}
                    onPointerDown={(event) => {
                      if (isTop) {
                        setPointerStart({ x: event.clientX, y: event.clientY });
                      }
                    }}
                    onPointerUp={(event) => handleSwipeEnd(event, card, isTop)}
                    style={{ '--stack-offset': `${(deck.length - 1 - index) * 10}px` } as StackStyle}
                  >
                    {card.type === 'listing' ? (
                      <img alt={card.title} className="swipe-card-image" src={card.listing.photos[0]} />
                    ) : (
                      <img alt={`${card.title} profile`} className="swipe-card-image" src={card.photoUrl} />
                    )}

                    <div className="swipe-card-gradient" />
                    <div className="swipe-card-copy">
                      <div className="swipe-card-topline">
                        <Pill tone={card.type === 'listing' && card.listing.intent === 'item' ? 'mauve' : 'warm'}>
                          {cardKind(card)}
                        </Pill>
                        <span>{card.distance.toFixed(1)} km</span>
                      </div>
                      <h2>{card.title}</h2>
                      <p>{card.subtitle}</p>
                      <div className="chip-wrap">
                        {cardMetaChips(card).slice(0, 5).map((chip, chipIndex) => (
                          <span className={`chip ${chipIndex === 0 ? 'active' : ''}`} key={`${card.id}-${chip}`}>
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div className="swipe-hook">
                        <strong>{card.hook}</strong>
                        <span>{cardSecondaryLine(card)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            {flash ? <div className="swipe-flash">{flash}</div> : null}
          </div>
        ) : (
          <EmptyState
            title="Deck finished"
            body="Try another discovery category or replay this stack."
            action={<Button onClick={() => setCardIndex(0)}>Replay deck</Button>}
          />
        )}
      </section>

      {activeCard ? (
        <>
          <div className="swipe-actions" aria-label="Swipe actions">
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

          <div className="button-row discovery-quick-actions">
            <Button onClick={() => handlePrimary(activeCard)}>
              {activeCard.type === 'listing' && activeCard.listing.intent === 'workshop' ? (
                <>
                  <Ticket size={16} />
                  Join
                </>
              ) : activeCard.type === 'listing' && ['item', 'swap'].includes(activeCard.listing.intent) ? (
                <>
                  <Zap size={16} />
                  Swap
                </>
              ) : activeCard.type === 'listing' ? (
                <>
                  <Ticket size={16} />
                  Book
                </>
              ) : (
                <>
                  <MessageCircle size={16} />
                  Message
                </>
              )}
            </Button>
            <Button tone="secondary" onClick={() => setDetailCard(activeCard)}>
              Details
            </Button>
            <Button tone="secondary" onClick={() => messageCard(activeCard)}>
              <Send size={16} />
              Chat
            </Button>
          </div>
        </>
      ) : null}

      <ModalSheet onClose={() => setDetailCard(null)} open={Boolean(detailCard)} title="Quick details">
        {detailCard ? (
          <div className="stack-list detail-sheet">
            <div className="detail-hero">
              {detailCard.type === 'listing' ? (
                <img alt={detailCard.title} src={detailCard.listing.photos[0]} />
              ) : (
                <img alt={`${detailCard.title} profile`} src={detailCard.photoUrl} />
              )}
            </div>
            <h3>{detailCard.title}</h3>
            <p>{detailCard.hook}</p>
            <div className="rule-list compact-rules">
              <div>
                <strong>Hobby</strong>
                <p>{detailCard.hobbyLabel}</p>
              </div>
              <div>
                <strong>Level</strong>
                <p>{detailCard.level}</p>
              </div>
              <div>
                <strong>Location</strong>
                <p>{detailCard.location}</p>
              </div>
              {detailCard.type === 'listing' ? (
                <div>
                  <strong>Price</strong>
                  <p>{dualPrice(detailCard.listing)}</p>
                </div>
              ) : null}
            </div>
            <div className="button-row">
              <Button onClick={() => handlePrimary(detailCard)}>
                {detailCard.type === 'listing' && detailCard.listing.intent === 'workshop'
                  ? 'Join'
                  : detailCard.type === 'listing' && ['item', 'swap'].includes(detailCard.listing.intent)
                    ? 'Swap'
                    : detailCard.type === 'listing'
                      ? 'Book'
                      : 'Message'}
              </Button>
              <Button
                tone="secondary"
                onClick={() => {
                  shareCard(detailCard);
                  setDetailCard(null);
                }}
              >
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>
        ) : null}
      </ModalSheet>
    </Screen>
  );
}

function cardIntentLabel(intent: MarketplaceListing['intent']) {
  if (intent === 'item') {
    return 'Item';
  }

  if (intent === 'workshop') {
    return 'Workshop';
  }

  if (intent === 'teach') {
    return 'Teacher';
  }

  return 'Swap';
}
