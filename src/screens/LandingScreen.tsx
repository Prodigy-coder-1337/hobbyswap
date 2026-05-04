import { Link } from 'react-router-dom';
import { Bookmark, Heart, Sparkles, Ticket, Zap } from 'lucide-react';
import { Button, Panel, Pill } from '@/components/ui';
import { useDelayedReady } from '@/hooks/useDelayedReady';

const lanes = [
  { title: 'Meet hobby friends', icon: Heart },
  { title: 'Find teachers', icon: Sparkles },
  { title: 'Join workshops', icon: Ticket },
  { title: 'Swap gear', icon: Bookmark }
];

const deck = [
  {
    label: 'Nearby',
    title: 'Mika wants a pottery buddy',
    image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Workshop',
    title: 'Sunset Guitar Circle',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'
  }
];

export default function LandingScreen() {
  const ready = useDelayedReady();

  if (!ready) {
    return <div className="marketing-shell">Loading HobbySwap...</div>;
  }

  return (
    <div className="marketing-shell">
      <div className="marketing-hero">
        <section className="screen marketing-screen">
          <div className="marketing-stage playful-landing">
            <Pill tone="teal">Swipe into your next hobby</Pill>
            <div className="marketing-copy">
              <p className="screen-kicker">HobbySwap</p>
              <h1 className="marketing-title">Meet people through the hobbies you love.</h1>
              <p className="marketing-subtitle">
                Find hobby friends, teachers, workshops, and gear near you. Less reading, more discovering.
              </p>
            </div>

            <div className="landing-deck-preview">
              {deck.map((card) => (
                <article key={card.title}>
                  <img alt={card.title} src={card.image} />
                  <div>
                    <Pill tone="warm">{card.label}</Pill>
                    <strong>{card.title}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="marketing-cta">
              <Link to="/auth?mode=signup">
                <Button>
                  <Zap size={16} />
                  Start discovering
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button tone="secondary">Log in</Button>
              </Link>
            </div>
          </div>

          <Panel eyebrow="What you can do" title="Pick a vibe">
            <div className="landing-lane-grid">
              {lanes.map((lane) => {
                const Icon = lane.icon;
                return (
                  <article className="landing-lane-card" key={lane.title}>
                    <Icon size={20} />
                    <strong>{lane.title}</strong>
                  </article>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <footer className="marketing-footer">
        <Link to="/info/about">About</Link>
        <Link to="/info/privacy">Privacy</Link>
        <Link to="/info/terms">Terms</Link>
        <Link to="/info/contact">Contact</Link>
      </footer>
    </div>
  );
}
