import { Button } from '@/components/ui';
import { createId } from '@/utils/createId';

const shortDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric'
});

const weekdayShortFormatter = new Intl.DateTimeFormat('en-PH', {
  weekday: 'short'
});

const dateInputFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
}

type AvailabilityBuilderProps = {
  label: string;
  hint?: string;
  slots: AvailabilitySlot[];
  onChange: (next: AvailabilitySlot[]) => void;
  addLabel?: string;
  minSlots?: number;
  maxSlots?: number;
};

function toIsoDate(date: Date) {
  return dateInputFormatter.format(date);
}

function fromIsoDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function plusDays(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function createAvailabilitySlot(
  overrides: Partial<Omit<AvailabilitySlot, 'id'>> = {},
  dayOffset = 0
): AvailabilitySlot {
  return {
    id: createId('slot'),
    date: overrides.date ?? toIsoDate(plusDays(dayOffset)),
    time: overrides.time ?? '18:00'
  };
}

export function formatAvailabilitySlot(slot: Pick<AvailabilitySlot, 'date' | 'time'>) {
  const date = fromIsoDate(slot.date);
  const time = new Intl.DateTimeFormat('en-PH', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(`${slot.date}T${slot.time}:00`));

  return `${weekdayShortFormatter.format(date)}, ${shortDateFormatter.format(date)} at ${time}`;
}

export function AvailabilityBuilder({
  label,
  hint,
  slots,
  onChange,
  addLabel = 'Add another slot',
  minSlots = 1,
  maxSlots = 4
}: AvailabilityBuilderProps) {
  return (
    <section className="availability-builder-section">
      <div className="availability-builder-copy">
        <span className="field-label">{label}</span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </div>

      <div className="availability-builder">
        {slots.map((slot) => (
          <div className="availability-row" key={slot.id}>
            <div className="availability-grid">
              <label className="availability-control">
                <span className="field-hint">Date</span>
                <input
                  className="text-input"
                  min={toIsoDate(new Date())}
                  type="date"
                  value={slot.date}
                  onChange={(event) =>
                    onChange(
                      slots.map((entry) =>
                        entry.id === slot.id
                          ? {
                              ...entry,
                              date: event.target.value
                            }
                          : entry
                      )
                    )
                  }
                />
              </label>

              <label className="availability-control">
                <span className="field-hint">Time</span>
                <input
                  className="text-input"
                  step={900}
                  type="time"
                  value={slot.time}
                  onChange={(event) =>
                    onChange(
                      slots.map((entry) =>
                        entry.id === slot.id
                          ? {
                              ...entry,
                              time: event.target.value
                            }
                          : entry
                      )
                    )
                  }
                />
              </label>
            </div>

            <div className="availability-row-actions">
              <small>{formatAvailabilitySlot(slot)}</small>
              {slots.length > minSlots ? (
                <Button tone="ghost" onClick={() => onChange(slots.filter((entry) => entry.id !== slot.id))}>
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ))}

        {slots.length < maxSlots ? (
          <Button tone="secondary" onClick={() => onChange([...slots, createAvailabilitySlot({}, slots.length + 1)])}>
            {addLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
