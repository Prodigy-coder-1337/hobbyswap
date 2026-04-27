import { RefObject, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Pill } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

type TutorialOverlayProps = {
  shellRef: RefObject<HTMLDivElement | null>;
};

export function TutorialOverlay({ shellRef }: TutorialOverlayProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const tutorialSteps = useAppStore((state) => state.tutorialSteps);
  const completeGuide = useAppStore((state) => state.completeGuide);
  const [index, setIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null
  );

  const isActive = Boolean(currentUser && !currentUser.guideCompleted && location.pathname.startsWith('/app'));
  const step = tutorialSteps[index];
  const progress = useMemo(() => `${index + 1} / ${tutorialSteps.length}`, [index, tutorialSteps.length]);

  useEffect(() => {
    if (isActive && location.pathname !== '/app/home') {
      navigate('/app/home', { replace: true });
    }
  }, [isActive, location.pathname, navigate]);

  useEffect(() => {
    if (!isActive) {
      setIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !shellRef.current || !step) {
      return;
    }

    const updateRect = () => {
      const shell = shellRef.current;
      const target = shell?.querySelector<HTMLElement>(`[data-tutorial-target="${step.target}"]`);

      if (!shell || !target) {
        setTargetRect(null);
        return;
      }

      const shellBounds = shell.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();

      setTargetRect({
        top: targetBounds.top - shellBounds.top - 6,
        left: targetBounds.left - shellBounds.left - 6,
        width: targetBounds.width + 12,
        height: targetBounds.height + 12
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
    };
  }, [isActive, shellRef, step]);

  if (!isActive || !step) {
    return null;
  }

  const arrowStyle = targetRect
    ? {
        top: Math.max(18, targetRect.top - 38),
        left: Math.min(targetRect.left + targetRect.width / 2 - 18, 320)
      }
    : undefined;

  return (
    <div className="tutorial-overlay" role="presentation">
      {targetRect ? (
        <>
          <div
            className="tutorial-highlight"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height
            }}
          />
          <div className="tutorial-arrow" style={arrowStyle}>
            ↓
          </div>
        </>
      ) : null}

      <div className="tutorial-card">
        <div className="tutorial-card-top">
          <Pill tone="mauve">Dashboard tour</Pill>
          <span className="field-hint">{progress}</span>
        </div>
        <strong>{step.title}</strong>
        <p>{step.body}</p>
        <div className="button-row">
          <Button
            tone="secondary"
            onClick={() => {
              completeGuide();
            }}
          >
            Skip for now
          </Button>
          {index > 0 ? (
            <Button tone="secondary" onClick={() => setIndex((current) => current - 1)}>
              Back
            </Button>
          ) : null}
          {index < tutorialSteps.length - 1 ? (
            <Button onClick={() => setIndex((current) => current + 1)}>Next</Button>
          ) : (
            <Button
              onClick={() => {
                completeGuide();
              }}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
