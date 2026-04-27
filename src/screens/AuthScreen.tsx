import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Field, Panel, Pill, Screen, Segments, TextInput } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { validateEmailOrPhone, validateName, validatePassword } from '@/utils/validators';
import { detectNearestGeoPoint } from '@/utils/location';

const ageGroups = ['18-24', '25-34', '35-44', '45+'] as const;

export default function AuthScreen() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode') === 'signup' ? 'Sign Up' : 'Log In';
  const login = useAppStore((state) => state.login);
  const loginWithProvider = useAppStore((state) => state.loginWithProvider);
  const signUp = useAppStore((state) => state.signUp);

  const [form, setForm] = useState({
    name: '',
    identifier: '',
    password: '',
    ageGroup: '25-34',
    anonymousMode: false
  });
  const [locationState, setLocationState] = useState<{
    loading: boolean;
    error: string;
    label: string;
    geoPoint: Awaited<ReturnType<typeof detectNearestGeoPoint>> | null;
  }>({
    loading: false,
    error: '',
    label: 'Waiting for GPS permission',
    geoPoint: null
  });

  const errors = useMemo(
    () => ({
      name: mode === 'Sign Up' && !form.anonymousMode ? validateName(form.name) : '',
      identifier: validateEmailOrPhone(form.identifier),
      password: validatePassword(form.password)
    }),
    [form, mode]
  );

  useEffect(() => {
    if (mode !== 'Sign Up' || locationState.loading || locationState.geoPoint) {
      return;
    }

    void requestLocation();
  }, [locationState.geoPoint, locationState.loading, mode]);

  async function requestLocation() {
    setLocationState((state) => ({
      ...state,
      loading: true,
      error: '',
      label: 'Detecting your location...'
    }));

    try {
      const geoPoint = await detectNearestGeoPoint();
      setLocationState({
        loading: false,
        error: '',
        label: `${geoPoint.barangay}, ${geoPoint.city}`,
        geoPoint
      });
    } catch {
      setLocationState({
        loading: false,
        error: 'Location permission was not available, so we will keep a gentle Metro Manila default.',
        label: 'Approximate Metro Manila location',
        geoPoint: {
          barangay: 'Poblacion',
          city: 'Makati',
          lat: 14.5656,
          lng: 121.0292
        }
      });
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (mode === 'Log In') {
      const result = login(form.identifier, form.password);
      if (result.ok) {
        const user = useAppStore.getState().users.find(
          (entry) => entry.id === useAppStore.getState().currentUserId
        );
        navigate(user?.onboardingComplete ? '/app/home' : '/onboarding');
      }
      return;
    }

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    const result = signUp({
      realName: form.name,
      identifier: form.identifier,
      password: form.password,
      anonymousMode: form.anonymousMode,
      location: locationState.geoPoint,
      ageGroup: form.ageGroup as (typeof ageGroups)[number]
    });

    if (result.ok) {
      navigate('/onboarding');
    }
  }

  return (
    <div className="auth-shell">
      <Screen
        title={mode === 'Sign Up' ? 'Start your first swap week' : 'Welcome back'}
        subtitle={
          mode === 'Sign Up'
            ? 'Short setup, GPS location, then you are inside.'
            : 'Use `mika@hobbyswap.app` / `HobbySwap9` if you want to explore fast.'
        }
        action={mode === 'Sign Up' ? <Pill tone="warm">Mobile-first setup</Pill> : null}
      >
        <Panel eyebrow="What you can do" title="Swap, list items, or join workshops">
          <div className="auth-visual-grid">
            <img alt="People trading creative supplies" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80" />
            <img alt="Creative hobby tools and notebooks" src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80" />
          </div>
        </Panel>

        <Panel>
          <Segments
            value={mode}
            options={['Log In', 'Sign Up']}
            onChange={(next) => setParams({ mode: next === 'Sign Up' ? 'signup' : 'login' })}
          />

          <form className="form-stack" onSubmit={onSubmit}>
            {mode === 'Sign Up' ? (
              <>
                <Field hint="Turn this on if you want to start with an alias instead." label="Anonymous mode">
                  <Segments
                    value={form.anonymousMode ? 'On' : 'Off'}
                    options={['Off', 'On']}
                    onChange={(next) =>
                      setForm((state) => ({
                        ...state,
                        anonymousMode: next === 'On'
                      }))
                    }
                  />
                </Field>
                {!form.anonymousMode ? (
                  <Field error={errors.name} label="Full name">
                    <TextInput
                      placeholder="Mikaela Santos"
                      value={form.name}
                      onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                    />
                  </Field>
                ) : null}
              </>
            ) : null}

            <Field
              error={errors.identifier}
              hint="Email or Philippine mobile number"
              label="Email or phone"
            >
              <TextInput
                placeholder="mika@hobbyswap.app"
                value={form.identifier}
                onChange={(event) => setForm((state) => ({ ...state, identifier: event.target.value }))}
              />
            </Field>

            <Field error={errors.password} label="Password">
              <TextInput
                placeholder="At least 8 characters"
                type="password"
                value={form.password}
                onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))}
              />
            </Field>

            {mode === 'Sign Up' ? (
              <>
                <Panel eyebrow="Location" title="GPS autofill">
                  <div className="button-row">
                    <Pill tone="teal">{locationState.label}</Pill>
                    <Button tone="secondary" onClick={() => void requestLocation()}>
                      Refresh GPS
                    </Button>
                  </div>
                  {locationState.error ? <p className="field-hint">{locationState.error}</p> : null}
                </Panel>
                <Field label="Age group">
                  <select
                    className="text-input"
                    value={form.ageGroup}
                    onChange={(event) => setForm((state) => ({ ...state, ageGroup: event.target.value }))}
                  >
                    {ageGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            ) : null}

            <Button type="submit">{mode === 'Sign Up' ? 'Create Account' : 'Log In'}</Button>
          </form>

          <div className="social-row">
            <Button
              tone="secondary"
              onClick={() => {
                loginWithProvider('Google');
                navigate('/onboarding');
              }}
            >
              Continue with Google
            </Button>
            <Button
              tone="secondary"
              onClick={() => {
                loginWithProvider('Facebook');
                navigate('/onboarding');
              }}
            >
              Continue with Facebook
            </Button>
          </div>

          <p className="muted-copy">
            By continuing, you agree to our <Link to="/info/terms">Terms</Link> and <Link to="/info/privacy">Privacy Policy</Link>.
          </p>
        </Panel>
      </Screen>
    </div>
  );
}
