import { useParams } from 'react-router-dom';
import { Button, Panel, Screen } from '@/components/ui';

const content: Record<string, { title: string; body: string[] }> = {
  about: {
    title: 'About HobbySwap',
    body: [
      'HobbySwap helps people discover hobby friends, teachers, workshops, and gear through quick visual cards.',
      'The product keeps each screen focused so members can swipe, save, join, message, or swap without reading a wall of text.'
    ]
  },
  privacy: {
    title: 'Privacy',
    body: [
      'Profiles start with privacy-first defaults. Exact locations stay hidden unless a member chooses to share them. Anonymous Mode hides profile views, activity, and discovery visibility until a member interacts.',
      'HobbySwap does not sell member data.'
    ]
  },
  terms: {
    title: 'Terms',
    body: [
      'Members agree to treat swaps, events, and mentorship sessions with consent, honesty, and mutual respect. Listings should match their descriptions, and meetup plans should prioritize safe public spaces when possible.',
      'Harassment, coercion, scams, and discriminatory conduct are not allowed.'
    ]
  },
  contact: {
    title: 'Contact',
    body: [
      'Community support: hello@hobbyswap.app',
      'Partnerships with libraries, schools, NGOs, and creative spaces: partners@hobbyswap.app'
    ]
  }
};

export default function InfoScreen() {
  const { slug = 'about' } = useParams();
  const entry = content[slug] ?? content.about;

  return (
    <div className="marketing-shell">
      <Screen title={entry.title} subtitle="A lightweight reference you can open any time from the landing page footer.">
        <Panel>
          {entry.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Panel>
        <Button tone="secondary" onClick={() => window.history.back()}>
          Go back
        </Button>
      </Screen>
    </div>
  );
}
