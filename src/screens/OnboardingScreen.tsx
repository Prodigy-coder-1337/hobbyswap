import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, Toggle } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { SkillLevel } from '@/types/models';
import { validateRequired, validateSelection } from '@/utils/validators';

const levels: SkillLevel[] = ['Beginner', 'Learning', 'Comfortable', 'Can Teach'];
const availabilityOptions = [
  'Mon evening',
  'Tue evening',
  'Wed evening',
  'Thu evening',
  'Fri evening',
  'Sat morning',
  'Sat afternoon',
  'Sun morning',
  'Sun afternoon'
];
const formats = ['In-person', 'Hybrid', 'Online'] as const;

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '');
  const [selectedHobbies, setSelectedHobbies] = useState<Record<string, SkillLevel>>({});
  const [availability, setAvailability] = useState<string[]>([]);
  const [preferredFormats, setPreferredFormats] = useState<string[]>(['Hybrid']);
  const [anonymousMode, setAnonymousMode] = useState(true);

  const errors = useMemo(
    () => ({
      displayName: validateRequired(displayName, 'Display name'),
      hobbies: validateSelection(Object.keys(selectedHobbies), 'Hobby'),
      availability: validateSelection(availability, 'Availability'),
      formats: validateSelection(preferredFormats, 'Format')
    }),
    [displayName, selectedHobbies, availability, preferredFormats]
  );

  if (!currentUser) {
    return null;
  }

  function toggleHobby(hobbyId: string) {
    setSelectedHobbies((state) => {
      if (state[hobbyId]) {
        const next = { ...state };
        delete next[hobbyId];
        return next;
      }

      return { ...state, [hobbyId]: 'Beginner' };
    });
  }

  function submit() {
    if (Object.values(errors).some(Boolean)) {
      return;
    }

    completeOnboarding({
      displayName,
      hobbyProfiles: Object.entries(selectedHobbies).map(([hobbyId, level]) => ({
        hobbyId,
        level
      })),
      availability,
      preferredFormats: preferredFormats as ('In-person' | 'Hybrid' | 'Online')[],
      anonymousMode
    });
    navigate('/app/guide');
  }

  return (
    <div className="auth-shell">
      <Screen
        title="Tune your first week"
        subtitle="Tell HobbySwap what you want to explore so we can build a calmer, more relevant dashboard from day one."
        action={<Pill tone="mauve">Step 2 of 2</Pill>}
      >
        <Panel eyebrow="Identity" title="How should we introduce you?">
          <Field error={errors.displayName} label="Display name">
            <input
              className="text-input"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Mika"
            />
          </Field>
          <Toggle
            checked={anonymousMode}
            description="Use your alias during early messages and first meetup planning."
            label="Start in anonymous mode"
            onChange={setAnonymousMode}
          />
        </Panel>

        <Panel eyebrow="Hobbies" title="Pick your interests">
          <p className="field-hint">Choose as many as you like. Each one gets its own skill level.</p>
          <div className="hobby-grid">
            {hobbies.map((hobby) => (
              <button
                className={`hobby-card ${selectedHobbies[hobby.id] ? 'active' : ''}`}
                key={hobby.id}
                onClick={() => toggleHobby(hobby.id)}
                style={{ '--accent': hobby.color } as React.CSSProperties}
                type="button"
              >
                <span>{hobby.icon}</span>
                <strong>{hobby.label}</strong>
              </button>
            ))}
          </div>
          {errors.hobbies ? <p className="field-error">{errors.hobbies}</p> : null}

          {Object.keys(selectedHobbies).length ? (
            <div className="skill-level-list">
              {Object.entries(selectedHobbies).map(([hobbyId, level]) => {
                const hobby = hobbies.find((item) => item.id === hobbyId);
                return (
                  <Field key={hobbyId} label={`${hobby?.label ?? hobbyId} skill level`}>
                    <select
                      className="text-input"
                      value={level}
                      onChange={(event) =>
                        setSelectedHobbies((state) => ({
                          ...state,
                          [hobbyId]: event.target.value as SkillLevel
                        }))
                      }
                    >
                      {levels.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                );
              })}
            </div>
          ) : null}
        </Panel>

        <Panel eyebrow="Availability" title="When are you usually open?">
          <div className="chip-wrap">
            {availabilityOptions.map((option) => (
              <button
                className={`chip ${availability.includes(option) ? 'active' : ''}`}
                key={option}
                onClick={() =>
                  setAvailability((state) =>
                    state.includes(option)
                      ? state.filter((item) => item !== option)
                      : [...state, option]
                  )
                }
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          {errors.availability ? <p className="field-error">{errors.availability}</p> : null}
        </Panel>

        <Panel eyebrow="Format" title="How would you like to connect?">
          <div className="chip-wrap">
            {formats.map((format) => (
              <button
                className={`chip ${preferredFormats.includes(format) ? 'active' : ''}`}
                key={format}
                onClick={() =>
                  setPreferredFormats((state) =>
                    state.includes(format)
                      ? state.filter((item) => item !== format)
                      : [...state, format]
                  )
                }
                type="button"
              >
                {format}
              </button>
            ))}
          </div>
          {errors.formats ? <p className="field-error">{errors.formats}</p> : null}
        </Panel>

        <Button onClick={submit}>Create My Dashboard</Button>
      </Screen>
    </div>
  );
}
