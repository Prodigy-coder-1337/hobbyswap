import { useNavigate } from 'react-router-dom';
import { EyeOff, Lock, Moon, Sparkles } from 'lucide-react';
import { Button, Panel, Pill, Screen, Segments } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { exportDataJson } from '@/services/export';
import { useAppStore } from '@/store/useAppStore';

function settingStateLabel(enabled: boolean) {
  return enabled ? 'On' : 'Off';
}

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
    <Screen title="Settings" subtitle="Privacy, premium, and app feel." action={<Pill tone="teal">Compact</Pill>}>
      <div className="settings-compact-grid">
      <Panel eyebrow="Premium" title="Unlock better discovery">
        <div className="settings-promo-card">
          <span>
            <Sparkles size={20} />
          </span>
          <div>
            <strong>{currentUser.premium ? 'Premium is active' : 'Choose your visibility boost'}</strong>
            <p>Compare plans in one table.</p>
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
            <p>Views, online status, last active, and discovery card.</p>
          </article>
          <article>
            <Sparkles size={18} />
            <strong>Shown when you act</strong>
            <p>Your profile appears when you Like, Join, Message, or Swap.</p>
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
        <div className="settings-mini-grid">
          <button
            className={`settings-mini-toggle ${currentUser.privacy.showRealName ? 'active' : ''}`}
            onClick={() => updatePrivacy({ showRealName: !currentUser.privacy.showRealName })}
            type="button"
          >
            <strong>Real name</strong>
            <span>{settingStateLabel(currentUser.privacy.showRealName)}</span>
          </button>
          <button
            className={`settings-mini-toggle ${currentUser.privacy.showOnMap ? 'active' : ''}`}
            onClick={() => updatePrivacy({ showOnMap: !currentUser.privacy.showOnMap })}
            type="button"
          >
            <strong>Nearby</strong>
            <span>{settingStateLabel(currentUser.privacy.showOnMap)}</span>
          </button>
          <button
            className={`settings-mini-toggle ${currentUser.privacy.showExactLocation ? 'active' : ''}`}
            onClick={() => updatePrivacy({ showExactLocation: !currentUser.privacy.showExactLocation })}
            type="button"
          >
            <strong>Barangay</strong>
            <span>{settingStateLabel(currentUser.privacy.showExactLocation)}</span>
          </button>
        </div>
        <label className="settings-select-pill">
          <span>Profile stack</span>
          <select
            value={currentUser.privacy.visibility}
            onChange={(event) =>
              updatePrivacy({ visibility: event.target.value as 'Community' | 'Matches Only' | 'Private' })
            }
          >
            <option value="Community">Community</option>
            <option value="Matches Only">Matches only</option>
            <option value="Private">Private</option>
          </select>
        </label>
      </Panel>

      <Panel eyebrow="App feel" title="Readable anywhere">
        <div className="settings-mini-heading">
          <Moon size={16} />
          <span>Theme</span>
        </div>
        <Segments
          value={currentUser.accessibility.theme ?? 'Light'}
          options={['Light', 'Dark', 'System']}
          onChange={(value) => updateAccessibility({ theme: value as 'Light' | 'Dark' | 'System' })}
        />
        <label className="settings-select-pill">
          <span>Font</span>
          <select
            value={currentUser.accessibility.fontScale}
            onChange={(event) =>
              updateAccessibility({ fontScale: event.target.value as 'Default' | 'Large' | 'Largest' })
            }
          >
            <option value="Default">Default</option>
            <option value="Large">Large</option>
            <option value="Largest">Largest</option>
          </select>
        </label>
        <div className="settings-mini-grid two-up">
          <button
            className={`settings-mini-toggle ${currentUser.accessibility.reduceMotion ? 'active' : ''}`}
            onClick={() => updateAccessibility({ reduceMotion: !currentUser.accessibility.reduceMotion })}
            type="button"
          >
            <strong>Motion</strong>
            <span>{currentUser.accessibility.reduceMotion ? 'Reduced' : 'Lively'}</span>
          </button>
          <button
            className={`settings-mini-toggle ${currentUser.accessibility.highContrast ? 'active' : ''}`}
            onClick={() => updateAccessibility({ highContrast: !currentUser.accessibility.highContrast })}
            type="button"
          >
            <strong>Contrast</strong>
            <span>{settingStateLabel(currentUser.accessibility.highContrast)}</span>
          </button>
        </div>
      </Panel>

      <Panel eyebrow="Notifications" title="Only useful nudges">
        <div className="settings-mini-grid">
          <button
            className={`settings-mini-toggle ${currentUser.notificationPreferences.messages ? 'active' : ''}`}
            onClick={() => updateNotificationPrefs({ messages: !currentUser.notificationPreferences.messages })}
            type="button"
          >
            <strong>Messages</strong>
            <span>{settingStateLabel(currentUser.notificationPreferences.messages)}</span>
          </button>
          <button
            className={`settings-mini-toggle ${currentUser.notificationPreferences.eventReminders ? 'active' : ''}`}
            onClick={() =>
              updateNotificationPrefs({ eventReminders: !currentUser.notificationPreferences.eventReminders })
            }
            type="button"
          >
            <strong>Workshops</strong>
            <span>{settingStateLabel(currentUser.notificationPreferences.eventReminders)}</span>
          </button>
          <button
            className={`settings-mini-toggle ${currentUser.notificationPreferences.challengeReminders ? 'active' : ''}`}
            onClick={() =>
              updateNotificationPrefs({
                challengeReminders: !currentUser.notificationPreferences.challengeReminders
              })
            }
            type="button"
          >
            <strong>Credits</strong>
            <span>{settingStateLabel(currentUser.notificationPreferences.challengeReminders)}</span>
          </button>
        </div>
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
          <Button tone="secondary" onClick={() => exportDataJson(useAppStore.getState(), 'hobbihop-export.json')}>
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
      </div>
    </Screen>
  );
}
