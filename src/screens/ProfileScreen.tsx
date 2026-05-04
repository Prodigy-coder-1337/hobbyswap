import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, Settings, Sparkles, Star } from 'lucide-react';
import { Button, Field, Panel, Pill, Screen, StatsGrid, TextArea, TextInput, Toggle } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const listings = useAppStore((state) => state.listings);
  const reviews = useAppStore((state) => state.reviews);
  const contracts = useAppStore((state) => state.contracts);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const updatePrivacy = useAppStore((state) => state.updatePrivacy);
  const [form, setForm] = useState({
    displayName: currentUser?.displayName ?? '',
    bio: currentUser?.bio ?? ''
  });

  const myListings = listings.filter((listing) => listing.ownerId === currentUser?.id);
  const myReviews = reviews.filter((review) => review.targetUserId === currentUser?.id);
  const myContracts = contracts.filter((contract) =>
    currentUser ? [contract.teacherId, contract.learnerId].includes(currentUser.id) : false
  );

  const reliability = Math.min(98, 68 + myContracts.filter((contract) => contract.status === 'completed').length * 7);
  const responsiveness = Math.min(97, 66 + myReviews.length * 6);
  const visibility = currentUser?.premium ? 'Boosted' : 'Normal';

  const skillTags = useMemo(() => {
    const fromListings = myListings.map((listing) => ({
      label: hobbies.find((hobby) => hobby.id === listing.hobbyId)?.label ?? listing.hobbyId,
      intent: listing.intent === 'teach' ? 'Teach' : listing.intent === 'workshop' ? 'Host' : listing.intent === 'item' ? 'Gear' : 'Swap'
    }));

    if (fromListings.length) {
      return fromListings;
    }

    return currentUser?.hobbyProfiles.map((profile) => ({
      label: hobbies.find((hobby) => hobby.id === profile.hobbyId)?.label ?? profile.hobbyId,
      intent: profile.level === 'Can Teach' ? 'Teach' : 'Learn'
    })) ?? [];
  }, [myListings, hobbies, currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Me"
      subtitle="Your social hobby card."
      action={
        <Link to="/app/settings">
          <Button tone="secondary">
            <Settings size={16} />
            Settings
          </Button>
        </Link>
      }
    >
      <section className="profile-hero-card">
        <div className="profile-photo-stage" style={{ background: currentUser.avatar }}>
          <span>{currentUser.displayName.slice(0, 1)}</span>
        </div>
        <div className="profile-hero-copy">
          <div>
            <Pill tone={currentUser.premium ? 'warm' : 'teal'}>
              {currentUser.premium ? 'Premium' : 'Community'}
            </Pill>
            {currentUser.anonymousMode ? <Pill tone="mauve">Anonymous</Pill> : null}
          </div>
          <h2>{currentUser.displayName}</h2>
          <p>{currentUser.location.city} - {visibility} visibility</p>
          <div className="chip-wrap">
            {skillTags.slice(0, 4).map((tag) => (
              <span className="chip active" key={`${tag.label}-${tag.intent}`}>
                {tag.label} - {tag.intent}
              </span>
            ))}
          </div>
        </div>
      </section>

      <StatsGrid
        items={[
          { label: 'Trust', value: `${currentUser.trustScore}%`, tone: 'warm' },
          { label: 'Replies', value: `${responsiveness}%`, tone: 'teal' },
          { label: 'Shows up', value: `${reliability}%`, tone: 'mauve' }
        ]}
      />

      <Panel eyebrow="Edit card" title="Keep it short">
        <Field label="Display name">
          <TextInput
            value={form.displayName}
            onChange={(event) => setForm((state) => ({ ...state, displayName: event.target.value }))}
          />
        </Field>
        <Field label="Short bio">
          <TextArea value={form.bio} onChange={(event) => setForm((state) => ({ ...state, bio: event.target.value }))} />
        </Field>
        <Button onClick={() => updateProfile({ displayName: form.displayName, bio: form.bio })}>Save card</Button>
      </Panel>

      <Panel eyebrow="Badges" title="What people see first">
        <div className="badge-strip">
          <span>
            <Sparkles size={14} />
            Beginner Friendly
          </span>
          <span>
            <Star size={14} />
            {myReviews.length ? `${myReviews.length} reviews` : 'New reviews'}
          </span>
          <span>
            <EyeOff size={14} />
            {currentUser.anonymousMode ? 'Private browsing' : 'Visible'}
          </span>
        </div>
      </Panel>

      <Panel eyebrow="Listings" title="Your offers">
        <div className="stack-list">
          {myListings.slice(0, 3).map((listing) => (
            <article className="list-card clean-card listing-card" key={listing.id}>
              <img alt={listing.title} className="listing-thumb" src={listing.photos[0]} />
              <div className="listing-card-copy">
                <span className="card-label">{listing.intent}</span>
                <strong>{listing.title}</strong>
                <p>{listing.level} - {listing.location.city}</p>
              </div>
            </article>
          ))}
        </div>
        <Link to="/app/new" state={{ mode: 'Create listing' }}>
          <Button>Show your skills</Button>
        </Link>
      </Panel>

      <Panel eyebrow="Privacy" title="Quick controls">
        <Toggle
          checked={currentUser.anonymousMode}
          description="Hide your card until you Like, Join, Message, or Swap."
          label="Anonymous Mode"
          onChange={(value) => updateProfile({ anonymousMode: value })}
        />
        <Toggle
          checked={currentUser.privacy.showOnMap}
          description="Let nearby hobbyists discover you."
          label="Show me nearby"
          onChange={(value) => updatePrivacy({ showOnMap: value })}
        />
      </Panel>
    </Screen>
  );
}
