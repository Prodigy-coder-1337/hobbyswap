import { useState } from 'react';
import { Button, Field, Panel, Pill, Screen, Segments, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function VideoHubScreen() {
  const currentUser = useCurrentUser();
  const videos = useAppStore((state) => state.videos);
  const hobbies = useAppStore((state) => state.hobbies);
  const createVideoPost = useAppStore((state) => state.createVideoPost);
  const addVideoComment = useAppStore((state) => state.addVideoComment);
  const createReport = useAppStore((state) => state.createReport);
  const [tab, setTab] = useState<'Browse' | 'Upload'>('Browse');
  const [comment, setComment] = useState('');
  const [form, setForm] = useState({
    title: '',
    url: '',
    thumbnail: '',
    hobbyId: hobbies[0]?.id ?? 'watercolor',
    skillLevel: 'Beginner',
    format: 'Hybrid',
    durationSeconds: '120'
  });

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Short hobby videos"
      subtitle="Share up to 3 minutes of demos or tutorials. Playback is always user-initiated."
      action={<Pill tone="mauve">{videos.length} videos</Pill>}
    >
      <Segments value={tab} options={['Browse', 'Upload']} onChange={(next) => setTab(next as typeof tab)} />

      {tab === 'Browse' ? (
        <div className="stack-list">
          {videos.map((video) => (
            <Panel eyebrow={video.skillLevel} key={video.id} title={video.title}>
              <video controls poster={video.thumbnail} src={video.url} />
              <p>{video.durationSeconds} seconds • {video.format}</p>
              <div className="stack-list">
                {video.comments.map((entry) => (
                  <div className="note-box" key={entry.id}>
                    {entry.body}
                  </div>
                ))}
              </div>
              <Field label="Add a moderated comment">
                <TextArea value={comment} onChange={(event) => setComment(event.target.value)} />
              </Field>
              <div className="button-row">
                <Button tone="secondary" onClick={() => addVideoComment(video.id, comment)}>
                  Comment
                </Button>
                <Button
                  tone="secondary"
                  onClick={() =>
                    createReport({
                      subjectType: 'video',
                      subjectId: video.id,
                      category: 'Boundary issue',
                      details: 'Reported from the video hub.'
                    })
                  }
                >
                  Report video
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel eyebrow="Upload" title="Share a short tutorial">
          <div className="form-stack">
            <Field label="Title">
              <TextInput value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
            </Field>
            <Field label="Video URL">
              <TextInput value={form.url} onChange={(event) => setForm((state) => ({ ...state, url: event.target.value }))} />
            </Field>
            <Field label="Thumbnail URL">
              <TextInput value={form.thumbnail} onChange={(event) => setForm((state) => ({ ...state, thumbnail: event.target.value }))} />
            </Field>
            <div className="split-fields">
              <Field label="Hobby">
                <select className="text-input" value={form.hobbyId} onChange={(event) => setForm((state) => ({ ...state, hobbyId: event.target.value }))}>
                  {hobbies.map((hobby) => (
                    <option key={hobby.id} value={hobby.id}>
                      {hobby.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Skill level">
                <select className="text-input" value={form.skillLevel} onChange={(event) => setForm((state) => ({ ...state, skillLevel: event.target.value }))}>
                  <option value="Beginner">Beginner</option>
                  <option value="Learning">Learning</option>
                  <option value="Comfortable">Comfortable</option>
                  <option value="Can Teach">Can Teach</option>
                </select>
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
              <Field label="Duration seconds">
                <TextInput value={form.durationSeconds} onChange={(event) => setForm((state) => ({ ...state, durationSeconds: event.target.value }))} />
              </Field>
            </div>
            <Button
              onClick={() =>
                createVideoPost({
                  title: form.title,
                  url: form.url,
                  thumbnail: form.thumbnail,
                  hobbyId: form.hobbyId,
                  skillLevel: form.skillLevel as 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach',
                  format: form.format as 'In-person' | 'Hybrid' | 'Online',
                  durationSeconds: Number(form.durationSeconds)
                })
              }
            >
              Publish video
            </Button>
          </div>
        </Panel>
      )}
    </Screen>
  );
}
