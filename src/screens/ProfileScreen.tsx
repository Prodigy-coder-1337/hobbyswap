import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Field, Panel, Pill, Screen, StatsGrid, TextArea, TextInput, Toggle } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const listings = useAppStore((state) => state.listings);
  const resources = useAppStore((state) => state.resources);
  const reviews = useAppStore((state) => state.reviews);
  const contracts = useAppStore((state) => state.contracts);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const updatePrivacy = useAppStore((state) => state.updatePrivacy);
  const addResourceItem = useAppStore((state) => state.addResourceItem);
  const [form, setForm] = useState({
    displayName: currentUser?.displayName ?? '',
    bio: currentUser?.bio ?? '',
    resourceTitle: '',
    resourceDescription: ''
  });

  const myListings = listings.filter((listing) => listing.ownerId === currentUser?.id);
  const myResources = resources.filter((resource) => resource.ownerId === currentUser?.id);
  const myReviews = reviews.filter((review) => review.targetUserId === currentUser?.id);
  const myContracts = contracts.filter((contract) =>
    currentUser ? [contract.teacherId, contract.learnerId].includes(currentUser.id) : false
  );

  const reliability = Math.min(98, 68 + myContracts.filter((contract) => contract.status === 'completed').length * 7);
  const responsiveness = Math.min(97, 66 + myReviews.length * 6);
  const followThrough = Math.min(
    99,
    64 + myContracts.filter((contract) => ['active', 'awaiting-review', 'completed'].includes(contract.status)).length * 6
  );

  const skillTags = useMemo(() => {
    const fromListings = myListings.map((listing) => ({
      label: hobbies.find((hobby) => hobby.id === listing.hobbyId)?.label ?? listing.hobbyId,
      intent: listing.intent
    }));

    if (fromListings.length) {
      return fromListings;
    }

    return currentUser?.hobbyProfiles.map((profile) => ({
      label: hobbies.find((hobby) => hobby.id === profile.hobbyId)?.label ?? profile.hobbyId,
      intent: profile.level === 'Can Teach' ? 'teach' : 'swap'
    })) ?? [];
  }, [myListings, hobbies, currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Me"
      subtitle="Trust here is behavioral. Reliability, responsiveness, and follow-through come from participation."
      action={<Link to="/app/settings"><Button tone="secondary">Settings</Button></Link>}
    >
      <Panel eyebrow={currentUser.premium ? 'Premium member' : 'Community member'} title={currentUser.displayName}>
        <div className="profile-header">
          <Avatar color={currentUser.avatar} label={currentUser.displayName} />
          <div className="profile-copy">
            <strong>{currentUser.displayName}</strong>
            <p>{currentUser.privacy.showRealName ? currentUser.realName : currentUser.anonymousAlias}</p>
            <p>{currentUser.location.city}</p>
          </div>
        </div>
        <Field label="Display name">
          <TextInput
            value={form.displayName}
            onChange={(event) => setForm((state) => ({ ...state, displayName: event.target.value }))}
          />
        </Field>
        <Field label="Bio">
          <TextArea value={form.bio} onChange={(event) => setForm((state) => ({ ...state, bio: event.target.value }))} />
        </Field>
        <Button onClick={() => updateProfile({ displayName: form.displayName, bio: form.bio })}>Save profile</Button>
      </Panel>

      <StatsGrid
        items={[
          { label: 'Reliability', value: `${reliability}%`, tone: 'warm' },
          { label: 'Responsiveness', value: `${responsiveness}%`, tone: 'teal' },
          { label: 'Follow-through', value: `${followThrough}%`, tone: 'mauve' }
        ]}
      />

      <Panel eyebrow="Skills" title="Tagged by intent">
        <div className="chip-wrap">
          {skillTags.map((tag) => (
            <span className="chip active" key={`${tag.label}-${tag.intent}`}>
              {tag.label} • {tag.intent}
            </span>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Resource library" title="Share equipment with swap partners">
        <div className="stack-list">
          {myResources.map((resource) => (
            <article className="list-card clean-card" key={resource.id}>
              <div>
                <strong>{resource.title}</strong>
                <p>{resource.description}</p>
                <small>{resource.availabilityWindow}</small>
              </div>
            </article>
          ))}
        </div>
        <div className="form-stack resource-form">
          <Field label="Item name">
            <TextInput
              value={form.resourceTitle}
              onChange={(event) => setForm((state) => ({ ...state, resourceTitle: event.target.value }))}
            />
          </Field>
          <Field label="How can partners use it?">
            <TextArea
              value={form.resourceDescription}
              onChange={(event) => setForm((state) => ({ ...state, resourceDescription: event.target.value }))}
            />
          </Field>
          <Button
            onClick={() =>
              addResourceItem({
                title: form.resourceTitle,
                description: form.resourceDescription,
                hobbyId: currentUser.hobbyProfiles[0]?.hobbyId ?? hobbies[0].id,
                availabilityWindow: 'Share during confirmed swap sessions',
                damagePolicy: 'Return in the same condition and flag any issues immediately.'
              })
            }
          >
            Add resource
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Recent reviews" title="Participation signals from partners">
        <div className="stack-list">
          {myReviews.map((review) => (
            <article className="list-card clean-card" key={review.id}>
              <div>
                <strong>{'★'.repeat(review.score)}</strong>
                <p>{review.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Privacy" title="Anonymity and map visibility">
        <Toggle
          checked={currentUser.anonymousMode}
          description="Use your alias during early planning and first-time interactions."
          label="Anonymous mode"
          onChange={(value) => updateProfile({ anonymousMode: value })}
        />
        <Toggle
          checked={currentUser.privacy.showOnMap}
          description="Hide yourself from map discovery while keeping existing sessions intact."
          label="Visible on map"
          onChange={(value) => updatePrivacy({ showOnMap: value })}
        />
        <Toggle
          checked={currentUser.privacy.showExactLocation}
          description="Only turn this on if you want barangay-level visibility on your public card."
          label="Show barangay on profile"
          onChange={(value) => updatePrivacy({ showExactLocation: value })}
        />
      </Panel>
    </Screen>
  );
}
