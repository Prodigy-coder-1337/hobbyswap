import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Panel, Pill, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

export default function GuideScreen() {
  const navigate = useNavigate();
  const tutorialSteps = useAppStore((state) => state.tutorialSteps);
  const completeGuide = useAppStore((state) => state.completeGuide);
  const [index, setIndex] = useState(0);
  const step = tutorialSteps[index];

  function finish() {
    completeGuide();
    navigate('/app/discover');
  }

  return (
    <Screen
      title="How to move around HobbySwap"
      subtitle="A quick tour of the main spaces."
      action={<Pill tone="teal">{index + 1} / {tutorialSteps.length}</Pill>}
    >
      <Panel eyebrow={`Focus: ${step.target}`} title={step.title}>
        <p>{step.body}</p>
        <div className="feature-list">
          <div>
            <strong>What happens next</strong>
            <p>
              After this guide, you will land in discovery with people, workshops, and gear.
            </p>
          </div>
          <div>
            <strong>Need this later?</strong>
            <p>Settings includes an App Guide button so you can revisit these steps anytime.</p>
          </div>
        </div>
      </Panel>

      <div className="button-row">
        <Button tone="secondary" onClick={() => navigate('/app/discover')}>
          Skip for now
        </Button>
        {index > 0 ? (
          <Button tone="secondary" onClick={() => setIndex((state) => state - 1)}>
            Back
          </Button>
        ) : null}
        {index < tutorialSteps.length - 1 ? (
          <Button onClick={() => setIndex((state) => state + 1)}>Next tip</Button>
        ) : (
          <Button onClick={finish}>Finish guide</Button>
        )}
      </div>
    </Screen>
  );
}
