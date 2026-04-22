import { useMemo, useState } from 'react';
import { Button, Field, Panel, Screen, TextArea, TextInput } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

export default function ProjectsScreen() {
  const currentUser = useCurrentUser();
  const projects = useAppStore((state) => state.projects);
  const users = useAppStore((state) => state.users);
  const hobbies = useAppStore((state) => state.hobbies);
  const createProject = useAppStore((state) => state.createProject);
  const addProjectTask = useAppStore((state) => state.addProjectTask);
  const moveProjectTask = useAppStore((state) => state.moveProjectTask);
  const addProjectFile = useAppStore((state) => state.addProjectFile);
  const markProjectCelebrationSeen = useAppStore((state) => state.markProjectCelebrationSeen);
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? '');
  const [task, setTask] = useState('');
  const [file, setFile] = useState({ name: '', url: '' });
  const [form, setForm] = useState({
    title: '',
    description: '',
    hobbyId: hobbies[0]?.id ?? 'journaling',
    collaboratorIds: [] as string[]
  });

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const completed = useMemo(
    () => selected && selected.tasks.todo.length === 0 && selected.tasks.inProgress.length === 0 && selected.tasks.done.length > 0,
    [selected]
  );

  if (!currentUser) {
    return null;
  }

  return (
    <Screen title="Shared project spaces" subtitle="Organize collaborative hobby projects with a lightweight kanban board and shared files.">
      <Panel eyebrow="Create a project" title="Start something communal">
        <div className="form-stack">
          <Field label="Project title">
            <TextInput value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
          </Field>
          <Field label="Description">
            <TextArea value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} />
          </Field>
          <Field label="Hobby">
            <select className="text-input" value={form.hobbyId} onChange={(event) => setForm((state) => ({ ...state, hobbyId: event.target.value }))}>
              {hobbies.map((hobby) => (
                <option key={hobby.id} value={hobby.id}>
                  {hobby.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Invite collaborators">
            <div className="chip-wrap">
              {users
                .filter((user) => user.id !== currentUser.id)
                .map((user) => (
                  <button
                    className={`chip ${form.collaboratorIds.includes(user.id) ? 'active' : ''}`}
                    key={user.id}
                    onClick={() =>
                      setForm((state) => ({
                        ...state,
                        collaboratorIds: state.collaboratorIds.includes(user.id)
                          ? state.collaboratorIds.filter((item) => item !== user.id)
                          : [...state.collaboratorIds, user.id]
                      }))
                    }
                    type="button"
                  >
                    {user.displayName}
                  </button>
                ))}
            </div>
          </Field>
          <Button onClick={() => createProject(form)}>Create project space</Button>
        </div>
      </Panel>

      <Panel eyebrow="Open boards" title="Current collaborations">
        <div className="chip-wrap">
          {projects.map((project) => (
            <button className={`chip ${project.id === selected?.id ? 'active' : ''}`} key={project.id} onClick={() => setSelectedId(project.id)} type="button">
              {project.title}
            </button>
          ))}
        </div>
      </Panel>

      {selected ? (
        <>
          {completed && !selected.celebrationSeen ? (
            <Panel eyebrow="Celebration" title={`${selected.title} is complete`}>
              <p>Your project board is clear. Time for a tiny celebration and maybe a community showcase.</p>
              <Button onClick={() => markProjectCelebrationSeen(selected.id)}>Mark celebration seen</Button>
            </Panel>
          ) : null}

          <Panel eyebrow="Kanban" title={selected.title}>
            <div className="board">
              {(['todo', 'inProgress', 'done'] as const).map((lane) => (
                <div className="board-lane" key={lane}>
                  <h4>{lane === 'todo' ? 'To Do' : lane === 'inProgress' ? 'In Progress' : 'Done'}</h4>
                  {selected.tasks[lane].map((entry) => (
                    <div className="board-card" key={entry.id}>
                      <strong>{entry.title}</strong>
                      <div className="button-row">
                        {lane !== 'todo' ? (
                          <Button tone="secondary" onClick={() => moveProjectTask(selected.id, entry.id, 'todo')}>
                            To Do
                          </Button>
                        ) : null}
                        {lane !== 'inProgress' ? (
                          <Button tone="secondary" onClick={() => moveProjectTask(selected.id, entry.id, 'inProgress')}>
                            Doing
                          </Button>
                        ) : null}
                        {lane !== 'done' ? (
                          <Button onClick={() => moveProjectTask(selected.id, entry.id, 'done')}>Done</Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="button-row">
              <TextInput placeholder="Add a task" value={task} onChange={(event) => setTask(event.target.value)} />
              <Button onClick={() => { addProjectTask(selected.id, task); setTask(''); }}>Add task</Button>
            </div>
          </Panel>

          <Panel eyebrow="Files" title="Shared files and images">
            <div className="form-stack">
              <Field label="File label">
                <TextInput value={file.name} onChange={(event) => setFile((state) => ({ ...state, name: event.target.value }))} />
              </Field>
              <Field label="File URL">
                <TextInput value={file.url} onChange={(event) => setFile((state) => ({ ...state, url: event.target.value }))} />
              </Field>
              <Button onClick={() => { addProjectFile(selected.id, file.name, file.url); setFile({ name: '', url: '' }); }}>
                Share file
              </Button>
            </div>
            <div className="stack-list">
              {selected.files.map((entry) => (
                <a className="list-card text-link" href={entry.url} key={entry.id} rel="noreferrer" target="_blank">
                  <strong>{entry.name}</strong>
                </a>
              ))}
            </div>
          </Panel>
        </>
      ) : null}
    </Screen>
  );
}
