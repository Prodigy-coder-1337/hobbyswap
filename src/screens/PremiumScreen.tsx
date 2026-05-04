import { Check, Crown, Rocket, Sparkles } from 'lucide-react';
import { Button, Panel, Pill, Screen } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAppStore } from '@/store/useAppStore';

const plans = [
  {
    name: 'Premium Hobbyist',
    label: 'Better matches',
    price: '₱300/month',
    weekly: '₱99/week',
    yearly: '₱3,499/year',
    icon: Sparkles,
    bestFor: 'For finding hobby people faster.',
    perks: [
      'See who liked you',
      'Hobby metric filters',
      'Skill level filters',
      '3 super likes per month',
      'More profile visibility',
      'Priority item listings'
    ]
  },
  {
    name: 'Premium Teacher',
    label: 'For hosts',
    price: '₱279/month',
    weekly: '₱89/week',
    yearly: '₱2,999/year',
    icon: Rocket,
    bestFor: 'For lessons, workshops, and teaching offers.',
    perks: [
      'See who liked you',
      '3 workshop boosts',
      'Better workshop visibility',
      'Priority teaching offers'
    ]
  },
  {
    name: 'Premium+',
    label: 'All-in-one',
    price: '₱429/month',
    weekly: '₱119/week',
    yearly: '₱3,699/year',
    icon: Crown,
    bestFor: 'For learning and teaching in one plan.',
    perks: [
      'All Hobbyist perks',
      'All Teacher perks',
      '5 super likes',
      '5 boosts',
      'Increased visibility',
      'Better discovery filters'
    ],
    featured: true
  }
];

const rows = [
  ['See who liked you', true, true, true],
  ['Hobby filters', true, false, true],
  ['Skill level filters', true, false, true],
  ['Super likes', '3', false, '5'],
  ['Profile visibility', true, false, true],
  ['Priority item listings', true, false, true],
  ['Workshop boosts', false, '3', '5'],
  ['Teaching priority', false, true, true],
  ['Better discovery filters', true, false, true]
] as const;

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check size={16} />;
  }

  if (value === false) {
    return <span className="muted-dash">-</span>;
  }

  return <span>{value}</span>;
}

export default function PremiumScreen() {
  const currentUser = useCurrentUser();
  const togglePremium = useAppStore((state) => state.togglePremium);

  if (!currentUser) {
    return null;
  }

  return (
    <Screen
      title="Premium"
      subtitle="Get seen, filter better, and boost your hobby offers."
      action={<Pill tone={currentUser.premium ? 'teal' : 'mauve'}>{currentUser.premium ? 'Active' : 'Optional'}</Pill>}
    >
      <div className="premium-plan-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <article className={`premium-plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
              <div className="premium-plan-top">
                <span className="premium-icon">
                  <Icon size={20} />
                </span>
                <Pill tone={plan.featured ? 'warm' : 'teal'}>{plan.label}</Pill>
              </div>
              <h2>{plan.name}</h2>
              <p>{plan.bestFor}</p>
              <strong className="plan-price">{plan.price}</strong>
              <small>{plan.weekly} - {plan.yearly}</small>
              <div className="perk-list">
                {plan.perks.map((perk) => (
                  <span key={perk}>
                    <Check size={15} />
                    {perk}
                  </span>
                ))}
              </div>
              <Button onClick={togglePremium}>{currentUser.premium ? 'Manage plan' : 'Choose plan'}</Button>
            </article>
          );
        })}
      </div>

      <Panel eyebrow="Compare" title="What each plan unlocks">
        <div className="premium-table">
          <div className="premium-table-row head">
            <span>Feature</span>
            <span>Hobbyist</span>
            <span>Teacher</span>
            <span>Plus</span>
          </div>
          {rows.map(([feature, hobbyist, teacher, plus]) => (
            <div className="premium-table-row" key={feature}>
              <span>{feature}</span>
              <span><Cell value={hobbyist} /></span>
              <span><Cell value={teacher} /></span>
              <span><Cell value={plus} /></span>
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
