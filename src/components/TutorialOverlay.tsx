import { RefObject, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Pill } from '@/components/ui';
import { seedData } from '@/data/seed';
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

  const guideSteps = useMemo(() => {
    const sourceSteps = tutorialSteps.length ? tutorialSteps : seedData.tutorialSteps;
    const finalSwipeStep = seedData.tutorialSteps[seedData.tutorialSteps.length - 1];

    return sourceSteps.map((entry, entryIndex) =>
      entry.target === 'log' || entryIndex === sourceSteps.length - 1 ? finalSwipeStep : entry
    );
  }, [tutorialSteps]);
  const isActive = Boolean(currentUser && !currentUser.guideCompleted && location.pathname.startsWith('/app'));
  const step = guideSteps[index];
  const progress = useMemo(() => `${index + 1} / ${guideSteps.length}`, [index, guideSteps.length]);
  const stepRoute = step?.target === 'swipeDeck' ? '/app/discover' : '/app/home';

  useEffect(() => {
    if (isActive && location.pathname !== stepRoute) {
      navigate(stepRoute, { replace: true });
    }
  }, [isActive, location.pathname, navigate, stepRoute]);

  useEffect(() => {
    if (!isActive) {
      setIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const shell = shellRef.current;
    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    shell?.classList.add('tutorial-locked');
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      shell?.classList.remove('tutorial-locked');
      window.scrollTo(0, 0);
    };
  }, [isActive, shellRef]);

  function finishGuide() {
    completeGuide();
    navigate('/app/discover', { replace: true });
  }

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
    const animationFrame = window.requestAnimationFrame(updateRect);
    const deferredMeasurement = window.setTimeout(updateRect, 120);
    window.addEventListener('resize', updateRect);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(deferredMeasurement);
      window.removeEventListener('resize', updateRect);
    };
  }, [isActive, location.pathname, shellRef, step]);

  if (!isActive || !step) {
    return null;
  }

  const shellWidth = shellRef.current?.clientWidth ?? 420;
  const shellHeight = shellRef.current?.clientHeight ?? 780;
  const cardPosition = targetRect && targetRect.top < shellHeight * 0.42 ? 'bottom' : 'top';
  const arrowStyle = targetRect
    ? {
        top:
          cardPosition === 'bottom'
            ? targetRect.top + targetRect.height + 12
            : Math.max(18, targetRect.top - 42),
        left: Math.min(
          Math.max(18, targetRect.left + targetRect.width / 2 - 18),
          shellWidth - 54
        )
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
            {cardPosition === 'bottom' ? '↑' : '↓'}
          </div>
        </>
      ) : null}

      <div className={`tutorial-card tutorial-placement-${cardPosition}`}>
        <div className="tutorial-card-top">
          <Pill tone="mauve">Quick tour</Pill>
          <span className="field-hint">{progress}</span>
        </div>
        <strong>{step.title}</strong>
        <p>{step.body}</p>
        <div className="button-row">
          <Button
            tone="secondary"
            onClick={finishGuide}
          >
            Skip for now
          </Button>
          {index > 0 ? (
            <Button tone="secondary" onClick={() => setIndex((current) => current - 1)}>
              Back
            </Button>
          ) : null}
          {index < guideSteps.length - 1 ? (
            <Button onClick={() => setIndex((current) => current + 1)}>Next</Button>
          ) : (
            <Button
              onClick={finishGuide}
            >
              Start swiping
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
