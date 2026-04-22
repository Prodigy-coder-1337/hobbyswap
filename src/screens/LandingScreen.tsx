import { Link } from 'react-router-dom';
import { Button, Panel, Pill, Screen } from '@/components/ui';
import { useDelayedReady } from '@/hooks/useDelayedReady';

const snippets = [
  {
    quote: 'I found a watercolor buddy in Makati without feeling like I had to perform online first.',
    name: 'Mika, Poblacion'
  },
  {
    quote: 'The swap contract made it easy to agree on a fair beginner-friendly setup.',
    name: 'Paolo, Quezon City'
  },
  {
    quote: 'I like that it feels calm. I always know what to do next, and then it ends.',
    name: 'Sam, Pasig'
  }
];

export default function LandingScreen() {
  const ready = useDelayedReady();

  if (!ready) {
    return <div className="marketing-shell">Loading HobbySwap…</div>;
  }

  return (
    <div className="marketing-shell">
      <div className="marketing-hero">
        <Pill tone="teal">Metro Manila hobby swapping, made gentle</Pill>
        <Screen
          title="Swap skills. Share materials. Meet people without the clout chase."
          subtitle="HobbySwap helps beginners and regulars in NCR discover low-pressure hobby exchanges, local meetups, collaborative challenges, and consent-first chats."
          action={
            <div className="button-row">
              <Link to="/auth?mode=signup">
                <Button>Get Started</Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button tone="secondary">Log In</Button>
              </Link>
            </div>
          }
        >
          <div className="hero-grid">
            <Panel eyebrow="Why it feels different" title="Activity first, not content first">
              <div className="feature-list">
                <div>
                  <strong>Skill swap agreements</strong>
                  <p>Set fair terms, sessions, and consent before anything starts.</p>
                </div>
                <div>
                  <strong>Local discovery</strong>
                  <p>Find meetups, mentors, and hobby gear near your barangay.</p>
                </div>
                <div>
                  <strong>Weekly practice prompts</strong>
                  <p>Stay creative through small collaborative challenges, not endless feeds.</p>
                </div>
              </div>
            </Panel>

            <Panel eyebrow="Community snippets" title="What members say">
              <div className="quote-stack">
                {snippets.map((item) => (
                  <blockquote key={item.name}>
                    “{item.quote}”
                    <footer>{item.name}</footer>
                  </blockquote>
                ))}
              </div>
            </Panel>
          </div>

          <Panel eyebrow="Built for gentle momentum" title="Core spaces">
            <div className="feature-grid">
              <article>
                <h4>Hobby Swap Marketplace</h4>
                <p>Trade or buy art supplies, instruments, sports gear, and craft tools in one warm local hub.</p>
              </article>
              <article>
                <h4>Mentorship without hierarchy</h4>
                <p>Match with someone who has simply been doing a hobby longer and wants to share.</p>
              </article>
              <article>
                <h4>Project spaces</h4>
                <p>Create zines, murals, clubs, and community builds with a simple shared board.</p>
              </article>
              <article>
                <h4>Privacy-first messaging</h4>
                <p>Request consent before first contact and keep aliases on during early conversations.</p>
              </article>
            </div>
          </Panel>
        </Screen>
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
