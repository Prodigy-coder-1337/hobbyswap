import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { Button, Pill, Screen, Segments } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';
import { FormatPreference, Hobby, SkillLevel } from '@/types/models';

const quickAvailability = ['Weeknights', 'Saturday', 'Sunday', 'Online anytime'];
const preferredFormats: FormatPreference[] = ['In-person', 'Hybrid', 'Online'];
type ChoiceStyle = CSSProperties & { '--choice-color': string };

function uniqueItems(items: string[]) {
  return Array.from(new Set(items));
}

function HobbyTile({
  hobby,
  selected,
  onToggle
}: {
  hobby: Hobby;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`visual-choice-card ${selected ? 'active' : ''}`}
      onClick={onToggle}
      style={{ '--choice-color': hobby.color } as ChoiceStyle}
      type="button"
    >
      <span className="visual-choice-art">
        <span>{hobby.icon}</span>
      </span>
      <strong>{hobby.label}</strong>
      {selected ? <Check size={18} /> : null}
    </button>
  );
}

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const hobbies = useAppStore((state) => state.hobbies);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState(['Saturday']);
  const [format, setFormat] = useState<FormatPreference>('Hybrid');
  const [anonymousMode, setAnonymousMode] = useState(currentUser?.anonymousMode ?? true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const heroHobbies = useMemo(() => hobbies.slice(0, 18), [hobbies]);
  const selectedCount = selectedHobbies.length;

  if (!currentUser) {
    return null;
  }

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  function toggleHobby(hobbyId: string) {
    setSelectedHobbies((state) => toggle(state, hobbyId));
  }

  function submit() {
    if (!currentUser) {
      setStatus('error');
      return;
    }

    const userSnapshot = currentUser;

    if (selectedHobbies.length < 3) {
      setStep(1);
      return;
    }

    setStatus('loading');

    window.setTimeout(() => {
      try {
        const profileMap = new Map<string, SkillLevel>();

        selectedHobbies.forEach((hobbyId) => profileMap.set(hobbyId, 'Beginner'));
        learnSkills.forEach((hobbyId) => profileMap.set(hobbyId, profileMap.get(hobbyId) ?? 'Learning'));
        teachSkills.forEach((hobbyId) => profileMap.set(hobbyId, 'Can Teach'));

        completeOnboarding({
          displayName: anonymousMode ? userSnapshot.anonymousAlias : userSnapshot.displayName,
          hobbyProfiles: Array.from(profileMap.entries()).map(([hobbyId, level]) => ({
            hobbyId,
            level
          })),
          availability,
          preferredFormats: [format],
          anonymousMode
        });
        navigate('/app/discover');
      } catch {
        setStatus('error');
      }
    }, 900);
  }

  if (status === 'loading') {
    return (
      <div className="auth-shell">
        <section className="onboarding-status-card">
          <div className="loading-card-stack">
            <span />
            <span />
            <span />
          </div>
          <Loader2 className="spin" size={28} />
          <h1>Finding your first matches...</h1>
          <p>Building a discovery deck with people, workshops, and hobby gear near you.</p>
        </section>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="auth-shell">
        <section className="onboarding-status-card">
          <Sparkles size={32} />
          <h1>Something glitched.</h1>
          <p>Your picks are safe. Try building your dashboard again.</p>
          <Button onClick={submit}>Retry</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <Screen
        title={step === 0 ? 'Meet hobby people' : step === 1 ? 'Pick your hobbies' : step === 2 ? 'Show your skills' : step === 3 ? 'Learn next' : 'Set your vibe'}
        subtitle={
          step === 0
            ? 'Swipe into friends, teachers, workshops, and gear.'
            : step === 1
              ? 'Tap at least 3 cards.'
              : step === 2
                ? 'Choose what you can teach.'
                : step === 3
                  ? 'Choose what you want to learn.'
                  : 'One last tap, then discovery.'
        }
        action={<Pill tone="mauve">{step + 1}/5</Pill>}
      >
        <div className="onboarding-progress">
          {Array.from({ length: 5 }, (_, index) => (
            <span className={index <= step ? 'active' : ''} key={index} />
          ))}
        </div>

        {step === 0 ? (
          <section className="onboarding-hero-card">
            <div className="onboarding-orbit">
              <span>Meet</span>
              <span>Learn</span>
              <span>Teach</span>
              <span>Swap</span>
            </div>
            <h2>One app for every hobby mood.</h2>
            <p>Find a pottery buddy, join a guitar circle, message a teacher, or swap starter gear.</p>
            <Button onClick={() => setStep(1)}>Start discovering</Button>
          </section>
        ) : null}

        {step === 1 ? (
          <>
            <div className="choice-grid">
              {heroHobbies.map((hobby) => (
                <HobbyTile
                  hobby={hobby}
                  key={hobby.id}
                  selected={selectedHobbies.includes(hobby.id)}
                  onToggle={() => toggleHobby(hobby.id)}
                />
              ))}
            </div>
            <Button disabled={selectedCount < 3} onClick={() => setStep(2)}>
              {selectedCount < 3 ? `Pick ${3 - selectedCount} more` : 'Next'}
            </Button>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="choice-grid">
              {selectedHobbies.map((hobbyId) => {
                const hobby = hobbies.find((item) => item.id === hobbyId);
                return hobby ? (
                  <HobbyTile
                    hobby={hobby}
                    key={hobby.id}
                    selected={teachSkills.includes(hobby.id)}
                    onToggle={() => setTeachSkills((state) => toggle(state, hobby.id))}
                  />
                ) : null;
              })}
            </div>
            <div className="button-row">
              <Button tone="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="choice-grid">
              {selectedHobbies.map((hobbyId) => {
                const hobby = hobbies.find((item) => item.id === hobbyId);
                return hobby ? (
                  <HobbyTile
                    hobby={hobby}
                    key={hobby.id}
                    selected={learnSkills.includes(hobby.id)}
                    onToggle={() => setLearnSkills((state) => toggle(state, hobby.id))}
                  />
                ) : null;
              })}
            </div>
            <div className="button-row">
              <Button tone="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <section className="panel onboarding-final">
            <div className="chip-wrap">
              {quickAvailability.map((option) => (
                <button
                  className={`chip ${availability.includes(option) ? 'active' : ''}`}
                  key={option}
                  onClick={() => setAvailability((state) => uniqueItems(toggle(state, option)))}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>

            <Segments value={format} options={[...preferredFormats]} onChange={(next) => setFormat(next as FormatPreference)} />

            <button className="privacy-preview-card" onClick={() => setAnonymousMode((value) => !value)} type="button">
              <span className={`toggle ${anonymousMode ? 'is-on' : ''}`}>
                <span />
              </span>
              <div>
                <strong>{anonymousMode ? 'Browsing privately' : 'Visible in discovery'}</strong>
                <p>
                  {anonymousMode
                    ? 'Hidden until you Like, Join, Message, or Swap.'
                    : 'People can find your hobby card.'}
                </p>
              </div>
              <EyeOff size={18} />
            </button>

            <div className="button-row">
              <Button tone="secondary" onClick={() => setStep(3)}>
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button onClick={submit}>Build my dashboard</Button>
            </div>
          </section>
        ) : null}
      </Screen>
    </div>
  );
}
