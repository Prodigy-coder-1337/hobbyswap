import { Link } from 'react-router-dom';
import { Button, Panel, Pill } from '@/components/ui';
import { useDelayedReady } from '@/hooks/useDelayedReady';

const flowSteps = [
  {
    step: '01',
    label: 'Discover',
    title: 'Find a calm match first',
    body: 'Browse swaps, listings, and workshops with the location, format, and price already visible.'
  },
  {
    step: '02',
    label: 'Agree',
    title: 'Lock the terms before the session',
    body: 'Set expectations, schedule choices, payment method, and boundaries before either side commits.'
  },
  {
    step: '03',
    label: 'Meet',
    title: 'Show up with less uncertainty',
    body: 'Keep the exchange low-pressure with clear meetup details, escrow steps, and one next action at a time.'
  },
  {
    step: '04',
    label: 'Review',
    title: 'Leave feedback at the end',
    body: 'Reviews come after the exchange, so people understand the flow before they see the social proof.'
  }
];

const coreSpaces = [
  {
    title: 'Hobby swap marketplace',
    body: 'Trade or buy art supplies, instruments, sports gear, and craft tools in one warm local hub.'
  },
  {
    title: 'Mentorship without hierarchy',
    body: 'Match with someone who has simply been doing a hobby longer and wants to share.'
  },
  {
    title: 'Project spaces',
    body: 'Create zines, murals, clubs, and community builds with a simple shared board.'
  },
  {
    title: 'Privacy-first messaging',
    body: 'Request consent before first contact and keep aliases on during early conversations.'
  }
];

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
        <section className="screen marketing-screen">
          <div className="marketing-stage">
            <Pill tone="teal">Metro Manila hobby swapping, made gentle</Pill>
            <div className="marketing-copy">
              <p className="screen-kicker">HobbySwap</p>
              <h1 className="marketing-title">Swap skills. Share materials. Meet people without the clout chase.</h1>
              <p className="marketing-subtitle">
                HobbySwap helps beginners and regulars in NCR discover low-pressure hobby exchanges, local meetups,
                collaborative challenges, and consent-first chats.
              </p>
            </div>

            <Panel eyebrow="How it works" title="A clearer first-run flow for a pretty complex idea">
              <div className="marketing-flow-list">
                {flowSteps.map((item) => (
                  <article className="marketing-flow-card" key={item.step}>
                    <div className="marketing-flow-top">
                      <span className="marketing-step-badge">{item.step}</span>
                      <Pill tone={item.step === '04' ? 'mauve' : item.step === '03' ? 'teal' : 'warm'}>
                        {item.label}
                      </Pill>
                    </div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </Panel>

            <div className="marketing-cta">
              <Link to="/auth?mode=signup">
                <Button>Get Started</Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button tone="secondary">Log In</Button>
              </Link>
            </div>
          </div>

          <Panel eyebrow="Core spaces" title="Where each part of the exchange happens">
            <div className="marketing-core-grid">
              {coreSpaces.map((item) => (
                <article className="marketing-core-card" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Visual walkthrough" title="What the flow looks like on mobile">
            <div className="marketing-mini-board">
              <article className="marketing-mini-card">
                <span className="card-label">Screen 1</span>
                <strong>Discover a match</strong>
                <p>Search by hobby, city, and format without needing to decode a crowded feed.</p>
              </article>
              <article className="marketing-mini-card">
                <span className="card-label">Screen 2</span>
                <strong>Choose the exact schedule</strong>
                <p>Use day, date, and time selectors so both sides see the same plan before confirming.</p>
              </article>
              <article className="marketing-mini-card">
                <span className="card-label">Screen 3</span>
                <strong>Track the action trail</strong>
                <p>Listings, swaps, bookings, payments, and reviews all feed into one readable history.</p>
              </article>
            </div>
          </Panel>

          <Panel eyebrow="Member reviews" title="What members say after they understand the flow">
            <div className="quote-stack">
              {snippets.map((item) => (
                <blockquote key={item.name}>
                  “{item.quote}”
                  <footer>{item.name}</footer>
                </blockquote>
              ))}
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
