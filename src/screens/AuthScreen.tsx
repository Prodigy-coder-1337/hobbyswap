import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Field, Panel, Screen, Segments, TextInput } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';
import { validateEmailOrPhone, validateName, validatePassword, validateRequired } from '@/utils/validators';

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
    barangay: '',
    city: 'Makati',
    ageGroup: '25-34'
  });

  const errors = useMemo(
    () => ({
      name: mode === 'Sign Up' ? validateName(form.name) : '',
      identifier: validateEmailOrPhone(form.identifier),
      password: validatePassword(form.password),
      barangay: mode === 'Sign Up' ? validateRequired(form.barangay, 'Barangay') : '',
      city: mode === 'Sign Up' ? validateRequired(form.city, 'City') : ''
    }),
    [form, mode]
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (mode === 'Log In') {
      const result = login(form.identifier, form.password);
      if (result.ok) {
        const user = useAppStore.getState().users.find(
          (entry) => entry.id === useAppStore.getState().currentUserId
        );
        navigate(user?.onboardingComplete ? (user.guideCompleted ? '/app/home' : '/app/guide') : '/onboarding');
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
      barangay: form.barangay,
      city: form.city,
      ageGroup: form.ageGroup as (typeof ageGroups)[number]
    });

    if (result.ok) {
      navigate('/onboarding');
    }
  }

  return (
    <div className="auth-shell">
      <Screen
        title={mode === 'Sign Up' ? 'Start your first swap week' : 'Welcome back to your hobby circle'}
        subtitle={
          mode === 'Sign Up'
            ? 'Create an account, then we will build your personalized dashboard through a quick onboarding quiz.'
            : 'Use the demo account `mika@hobbyswap.app` / `HobbySwap9` if you want to explore immediately.'
        }
      >
        <Panel>
          <Segments
            value={mode}
            options={['Log In', 'Sign Up']}
            onChange={(next) => setParams({ mode: next === 'Sign Up' ? 'signup' : 'login' })}
          />

          <form className="form-stack" onSubmit={onSubmit}>
            {mode === 'Sign Up' ? (
              <Field error={errors.name} label="Full name">
                <TextInput
                  placeholder="Mikaela Santos"
                  value={form.name}
                  onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                />
              </Field>
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
                <div className="split-fields">
                  <Field error={errors.barangay} label="Barangay">
                    <TextInput
                      placeholder="Poblacion"
                      value={form.barangay}
                      onChange={(event) => setForm((state) => ({ ...state, barangay: event.target.value }))}
                    />
                  </Field>
                  <Field error={errors.city} label="City">
                    <TextInput
                      placeholder="Makati"
                      value={form.city}
                      onChange={(event) => setForm((state) => ({ ...state, city: event.target.value }))}
                    />
                  </Field>
                </div>

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
