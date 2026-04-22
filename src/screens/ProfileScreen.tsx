import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Field, Panel, Pill, Screen, StatsGrid, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const reviews = useAppStore((state) => state.reviews);
  const resources = useAppStore((state) => state.resources);
  const videos = useAppStore((state) => state.videos);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [form, setForm] = useState({
    displayName: currentUser?.displayName ?? '',
    realName: currentUser?.realName ?? '',
    bio: currentUser?.bio ?? ''
  });

  const profileReviews = useMemo(
    () => reviews.filter((review) => review.targetUserId === currentUser?.id),
    [reviews, currentUser]
  );

  if (!currentUser) {
    return null;
  }

  const teaching = currentUser.hobbyProfiles
    .filter((profile) => ['Comfortable', 'Can Teach'].includes(profile.level))
    .map((profile) => hobbies.find((hobby) => hobby.id === profile.hobbyId)?.label ?? profile.hobbyId);
  const learning = currentUser.hobbyProfiles
    .filter((profile) => ['Beginner', 'Learning'].includes(profile.level))
    .map((profile) => hobbies.find((hobby) => hobby.id === profile.hobbyId)?.label ?? profile.hobbyId);

  return (
    <Screen
      title="Your profile"
      subtitle="Trust comes from completed swaps, community participation, and clear boundaries. Not followers."
      action={<Link to="/app/settings"><Button tone="secondary">Settings</Button></Link>}
    >
      <Panel eyebrow={currentUser.premium ? 'Premium member' : 'Community member'} title={currentUser.displayName}>
        <div className="profile-header">
          <Avatar color={currentUser.avatar} label={currentUser.displayName} />
          <div>
            <strong>{currentUser.displayName}</strong>
            <p>{currentUser.privacy.showRealName ? currentUser.realName : currentUser.anonymousAlias}</p>
            <p>{currentUser.location.city}</p>
          </div>
        </div>
        <p>{currentUser.bio}</p>
        <div className="chip-wrap">
          {currentUser.hobbyProfiles.map((profile) => {
            const hobby = hobbies.find((item) => item.id === profile.hobbyId);
            return (
              <span className="chip active" key={profile.hobbyId}>
                {hobby?.icon} {hobby?.label}
              </span>
            );
          })}
        </div>
      </Panel>

      <StatsGrid
        items={[
          { label: 'Trust score', value: currentUser.trustScore, tone: 'warm' },
          { label: 'Reviews', value: profileReviews.length, tone: 'teal' },
          { label: 'Resources shared', value: resources.filter((item) => item.ownerId === currentUser.id).length, tone: 'mauve' }
        ]}
      />

      <Panel eyebrow="Portfolio" title="What you teach and what you are learning">
        <div className="split-panels">
          <div className="mini-panel">
            <strong>Teaching</strong>
            <p>{teaching.length ? teaching.join(', ') : 'Still building confidence here.'}</p>
          </div>
          <div className="mini-panel">
            <strong>Learning</strong>
            <p>{learning.length ? learning.join(', ') : 'Currently not listed.'}</p>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Edit profile" title="Keep your intro current">
        <div className="form-stack">
          <Field label="Display name">
            <TextInput value={form.displayName} onChange={(event) => setForm((state) => ({ ...state, displayName: event.target.value }))} />
          </Field>
          <Field label="Real name">
            <TextInput value={form.realName} onChange={(event) => setForm((state) => ({ ...state, realName: event.target.value }))} />
          </Field>
          <Field label="Bio">
            <TextArea value={form.bio} onChange={(event) => setForm((state) => ({ ...state, bio: event.target.value }))} />
          </Field>
          <Button onClick={() => updateProfile(form)}>Save profile</Button>
        </div>
      </Panel>

      <Panel eyebrow="Partner feedback" title="Reviews from swap partners">
        <div className="stack-list">
          {profileReviews.map((review) => (
            <article className="list-card" key={review.id}>
              <div>
                <strong>{'★'.repeat(review.score)}</strong>
                <p>{review.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel eyebrow="Shared media" title="Resources and videos you are offering">
        <div className="stack-list">
          {resources
            .filter((resource) => resource.ownerId === currentUser.id)
            .map((resource) => (
              <article className="list-card" key={resource.id}>
                <div>
                  <strong>{resource.title}</strong>
                  <p>{resource.description}</p>
                </div>
              </article>
            ))}
          {videos
            .filter((video) => video.ownerId === currentUser.id)
            .map((video) => (
              <article className="list-card" key={video.id}>
                <div>
                  <strong>{video.title}</strong>
                  <p>{video.durationSeconds}s tutorial</p>
                </div>
              </article>
            ))}
        </div>
      </Panel>
    </Screen>
  );
}
