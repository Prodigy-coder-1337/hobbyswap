import { useNavigate } from 'react-router-dom';
import { Button, Field, Panel, Screen, Toggle } from '@/components/ui';
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
  const togglePremium = useAppStore((state) => state.togglePremium);
  const deleteAccount = useAppStore((state) => state.deleteAccount);
  const resetDemoData = useAppStore((state) => state.resetDemoData);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen title="Settings and privacy" subtitle="Control what people can see, how often we interrupt you, and how the app feels to use.">
      <Panel eyebrow="Account" title="Basic information">
        <div className="form-stack">
          <Field label="Name">
            <input className="text-input" value={currentUser.realName} onChange={(event) => updateProfile({ realName: event.target.value })} />
          </Field>
          <Field label="Email">
            <input className="text-input" value={currentUser.email} onChange={(event) => updateProfile({ email: event.target.value })} />
          </Field>
          <Field label="Phone">
            <input className="text-input" value={currentUser.phone} onChange={(event) => updateProfile({ phone: event.target.value })} />
          </Field>
          <Field label="Password">
            <input className="text-input" value={currentUser.password} onChange={(event) => updateProfile({ password: event.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel eyebrow="Privacy" title="Control your visibility">
        <Toggle checked={currentUser.privacy.showRealName} label="Show real name on profile" onChange={(value) => updatePrivacy({ showRealName: value })} />
        <Toggle checked={currentUser.privacy.showExactLocation} label="Show barangay-level location" onChange={(value) => updatePrivacy({ showExactLocation: value })} />
        <Toggle checked={currentUser.anonymousMode} label="Anonymous mode for early interactions" onChange={(value) => updateProfile({ anonymousMode: value })} />
        <Field label="Profile visibility">
          <select className="text-input" value={currentUser.privacy.visibility} onChange={(event) => updatePrivacy({ visibility: event.target.value as 'Community' | 'Matches Only' | 'Private' })}>
            <option value="Community">Community</option>
            <option value="Matches Only">Matches Only</option>
            <option value="Private">Private</option>
          </select>
        </Field>
      </Panel>

      <Panel eyebrow="Notifications" title="Minimal by design">
        <Toggle checked={currentUser.notificationPreferences.swapRequests} label="Swap requests" onChange={(value) => updateNotificationPrefs({ swapRequests: value })} />
        <Toggle checked={currentUser.notificationPreferences.challengeReminders} label="Challenge reminders" onChange={(value) => updateNotificationPrefs({ challengeReminders: value })} />
        <Toggle checked={currentUser.notificationPreferences.eventReminders} label="Event reminders" onChange={(value) => updateNotificationPrefs({ eventReminders: value })} />
        <Toggle checked={currentUser.notificationPreferences.messages} label="Messages" onChange={(value) => updateNotificationPrefs({ messages: value })} />
        <Toggle checked={currentUser.notificationPreferences.contractUpdates} label="Contract updates" onChange={(value) => updateNotificationPrefs({ contractUpdates: value })} />
      </Panel>

      <Panel eyebrow="Accessibility" title="Adjust how the interface feels">
        <Field label="Font scale">
          <select className="text-input" value={currentUser.accessibility.fontScale} onChange={(event) => updateAccessibility({ fontScale: event.target.value as 'Default' | 'Large' | 'Largest' })}>
            <option value="Default">Default</option>
            <option value="Large">Large</option>
            <option value="Largest">Largest</option>
          </select>
        </Field>
        <Toggle checked={currentUser.accessibility.highContrast} label="High contrast mode" onChange={(value) => updateAccessibility({ highContrast: value })} />
        <Toggle checked={currentUser.accessibility.screenReaderHints} label="Screen reader hints" onChange={(value) => updateAccessibility({ screenReaderHints: value })} />
        <Toggle checked={currentUser.accessibility.reduceMotion} label="Reduce motion" onChange={(value) => updateAccessibility({ reduceMotion: value })} />
      </Panel>

      <Panel eyebrow="Verification and guide" title="Support and trust tools">
        <div className="button-row">
          <Button tone="secondary" onClick={() => requestVerification('phone')}>
            Verify phone
          </Button>
          <Button tone="secondary" onClick={() => requestVerification('local-id')}>
            Verify school or local ID
          </Button>
          <Button tone="secondary" onClick={() => navigate('/app/guide')}>
            Open App Guide
          </Button>
          <Button tone="secondary" onClick={togglePremium}>
            {currentUser.premium ? 'Pause premium' : 'Enable premium'}
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Data controls" title="Export or leave">
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
