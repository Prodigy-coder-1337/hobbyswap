import { useNavigate } from 'react-router-dom';
import { EyeOff, Lock, Moon, Sparkles } from 'lucide-react';
import { Button, Field, Panel, Pill, Screen, Segments, Toggle } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { exportDataJson } from '@/services/export';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const updateProfile = useAppStore((state) => state.updateProfile);
  const updatePrivacy = useAppStore((state) => state.updatePrivacy);
  const updateNotificationPrefs = useAppStore((state) => state.updateNotificationPrefs);
  const updateAccessibility = useAppStore((state) => state.updateAccessibility);
  const requestVerification = useAppStore((state) => state.requestVerification);
  const restartGuide = useAppStore((state) => state.restartGuide);
  const deleteAccount = useAppStore((state) => state.deleteAccount);
  const resetDemoData = useAppStore((state) => state.resetDemoData);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen title="Settings" subtitle="Privacy, premium, and app feel." action={<Pill tone="teal">Simple mode</Pill>}>
      <Panel eyebrow="Premium" title="Unlock better discovery">
        <div className="settings-promo-card">
          <span>
            <Sparkles size={20} />
          </span>
          <div>
            <strong>{currentUser.premium ? 'Premium is active' : 'Choose your visibility boost'}</strong>
            <p>Compare Hobbyist, Teacher, and Premium+ in one clear table.</p>
          </div>
        </div>
        <Button onClick={() => navigate('/app/premium')}>View premium plans</Button>
      </Panel>

      <Panel eyebrow="Anonymous Mode" title="Browse privately">
        <button
          className="anonymous-control-card"
          onClick={() =>
            updateProfile({
              anonymousMode: !currentUser.anonymousMode,
              displayName: !currentUser.anonymousMode
                ? currentUser.anonymousAlias
                : currentUser.realName.split(' ')[0] || currentUser.realName || currentUser.displayName
            })
          }
          type="button"
        >
          <span className={`toggle ${currentUser.anonymousMode ? 'is-on' : ''}`}>
            <span />
          </span>
          <div>
            <strong>{currentUser.anonymousMode ? 'Browsing privately' : 'Visible in discovery'}</strong>
            <p>
              {currentUser.anonymousMode
                ? 'Your card is hidden until you interact.'
                : 'People can find your profile card.'}
            </p>
          </div>
          <EyeOff size={20} />
        </button>

        <div className="privacy-preview-grid">
          <article>
            <Lock size={18} />
            <strong>Hidden</strong>
            <p>Profile views, online status, last active, and your card in discovery.</p>
          </article>
          <article>
            <Sparkles size={18} />
            <strong>Shown when you act</strong>
            <p>Your profile appears if you Like, Join, Message, or Swap.</p>
          </article>
        </div>

        <div className="privacy-preview-card">
          <span className="avatar mini-avatar" style={{ background: currentUser.avatar }}>
            {currentUser.displayName.slice(0, 1)}
          </span>
          <div>
            <strong>Preview</strong>
            <p>
              {currentUser.anonymousMode
                ? `${currentUser.anonymousAlias} - no activity shown`
                : `${currentUser.displayName} - ${currentUser.location.city}`}
            </p>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Visibility" title="Who can find you">
        <Toggle
          checked={currentUser.privacy.showRealName}
          label="Show real name"
          onChange={(value) => updatePrivacy({ showRealName: value })}
        />
        <Toggle
          checked={currentUser.privacy.showOnMap}
          label="Show me nearby"
          onChange={(value) => updatePrivacy({ showOnMap: value })}
        />
        <Toggle
          checked={currentUser.privacy.showExactLocation}
          label="Show barangay"
          onChange={(value) => updatePrivacy({ showExactLocation: value })}
        />
        <Field label="Profile visibility">
          <select
            className="text-input"
            value={currentUser.privacy.visibility}
            onChange={(event) =>
              updatePrivacy({ visibility: event.target.value as 'Community' | 'Matches Only' | 'Private' })
            }
          >
            <option value="Community">Community</option>
            <option value="Matches Only">Matches only</option>
            <option value="Private">Private</option>
          </select>
        </Field>
      </Panel>

      <Panel eyebrow="App feel" title="Readable anywhere">
        <div className="settings-promo-card">
          <span>
            <Moon size={20} />
          </span>
          <div>
            <strong>Dark mode</strong>
            <p>Keep cards image-first and easy on the eyes.</p>
          </div>
        </div>
        <Segments
          value={currentUser.accessibility.theme ?? 'Light'}
          options={['Light', 'Dark', 'System']}
          onChange={(value) => updateAccessibility({ theme: value as 'Light' | 'Dark' | 'System' })}
        />
        <Field label="Font size">
          <select
            className="text-input"
            value={currentUser.accessibility.fontScale}
            onChange={(event) =>
              updateAccessibility({ fontScale: event.target.value as 'Default' | 'Large' | 'Largest' })
            }
          >
            <option value="Default">Default</option>
            <option value="Large">Large</option>
            <option value="Largest">Largest</option>
          </select>
        </Field>
        <Toggle
          checked={currentUser.accessibility.reduceMotion}
          label="Reduce motion"
          onChange={(value) => updateAccessibility({ reduceMotion: value })}
        />
        <Toggle
          checked={currentUser.accessibility.highContrast}
          label="High contrast"
          onChange={(value) => updateAccessibility({ highContrast: value })}
        />
      </Panel>

      <Panel eyebrow="Notifications" title="Only useful nudges">
        <Toggle
          checked={currentUser.notificationPreferences.messages}
          label="Messages"
          onChange={(value) => updateNotificationPrefs({ messages: value })}
        />
        <Toggle
          checked={currentUser.notificationPreferences.eventReminders}
          label="Workshop reminders"
          onChange={(value) => updateNotificationPrefs({ eventReminders: value })}
        />
        <Toggle
          checked={currentUser.notificationPreferences.challengeReminders}
          label="Credit missions"
          onChange={(value) => updateNotificationPrefs({ challengeReminders: value })}
        />
      </Panel>

      <Panel eyebrow="Trust" title="Verify when ready">
        <div className="button-row">
          <Button tone="secondary" onClick={() => requestVerification('phone')}>
            Verify phone
          </Button>
          <Button tone="secondary" onClick={() => requestVerification('local-id')}>
            Verify ID
          </Button>
          <Button
            tone="secondary"
            onClick={() => {
              restartGuide();
              navigate('/app/discover');
            }}
          >
            Replay tour
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Data" title="Your account">
        <div className="button-column">
          <Button tone="secondary" onClick={() => exportDataJson(useAppStore.getState(), 'hobbyswap-export.json')}>
            Export my data
          </Button>
          <Button tone="secondary" onClick={resetDemoData}>
            Reset demo data
          </Button>
          <Button
            tone="danger"
            onClick={() => {
              deleteAccount();
              navigate('/');
            }}
          >
            Delete account
          </Button>
        </div>
      </Panel>
    </Screen>
  );
}
