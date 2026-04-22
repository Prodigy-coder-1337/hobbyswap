import { Button, SelectInput } from '@/components/ui';
import { createId } from '@/utils/createId';

const dayOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

const timeOptions = [
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM'
] as const;

const shortDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric'
});

const weekdayShortFormatter = new Intl.DateTimeFormat('en-PH', {
  weekday: 'short'
});

export type AvailabilityDay = (typeof dayOptions)[number];

export interface AvailabilitySlot {
  id: string;
  day: AvailabilityDay;
  date: string;
  time: (typeof timeOptions)[number];
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
  return date.toISOString().slice(0, 10);
}

function fromIsoDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function dayFromIsoDate(value: string): AvailabilityDay {
  const dayIndex = fromIsoDate(value).getDay();
  return dayOptions[(dayIndex + 6) % 7];
}

function defaultDay(): AvailabilityDay {
  const dayIndex = new Date().getDay();
  return dayOptions[(dayIndex + 6) % 7];
}

export function getDateOptions(day: AvailabilityDay) {
  const matches: Array<{ value: string; label: string }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < 42 && matches.length < 6; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    if (dayFromIsoDate(toIsoDate(candidate)) !== day) {
      continue;
    }

    matches.push({
      value: toIsoDate(candidate),
      label: `${weekdayShortFormatter.format(candidate)} • ${shortDateFormatter.format(candidate)}`
    });
  }

  return matches;
}

function resolveDate(day: AvailabilityDay, requestedDate?: string) {
  const options = getDateOptions(day);

  if (requestedDate && options.some((option) => option.value === requestedDate)) {
    return requestedDate;
  }

  return options[0]?.value ?? toIsoDate(new Date());
}

export function createAvailabilitySlot(
  overrides: Partial<Omit<AvailabilitySlot, 'id'>> = {}
): AvailabilitySlot {
  const day = overrides.day ?? (overrides.date ? dayFromIsoDate(overrides.date) : defaultDay());

  return {
    id: createId('slot'),
    day,
    date: resolveDate(day, overrides.date),
    time: overrides.time ?? '6:00 PM'
  };
}

export function formatAvailabilitySlot(slot: Pick<AvailabilitySlot, 'date' | 'time'>) {
  const date = fromIsoDate(slot.date);
  return `${weekdayShortFormatter.format(date)}, ${shortDateFormatter.format(date)} at ${slot.time}`;
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
        {slots.map((slot) => {
          const dateOptions = getDateOptions(slot.day);

          return (
            <div className="availability-row" key={slot.id}>
              <div className="availability-grid">
                <label className="availability-control">
                  <span className="field-hint">Day</span>
                  <SelectInput
                    value={slot.day}
                    onChange={(event) => {
                      const nextDay = event.target.value as AvailabilityDay;
                      onChange(
                        slots.map((entry) =>
                          entry.id === slot.id
                            ? {
                                ...entry,
                                day: nextDay,
                                date: resolveDate(nextDay)
                              }
                            : entry
                        )
                      );
                    }}
                  >
                    {dayOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </label>

                <label className="availability-control">
                  <span className="field-hint">Date</span>
                  <SelectInput
                    value={slot.date}
                    onChange={(event) =>
                      onChange(
                        slots.map((entry) =>
                          entry.id === slot.id
                            ? {
                                ...entry,
                                date: event.target.value,
                                day: dayFromIsoDate(event.target.value)
                              }
                            : entry
                        )
                      )
                    }
                  >
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </label>

                <label className="availability-control">
                  <span className="field-hint">Time</span>
                  <SelectInput
                    value={slot.time}
                    onChange={(event) =>
                      onChange(
                        slots.map((entry) =>
                          entry.id === slot.id
                            ? {
                                ...entry,
                                time: event.target.value as AvailabilitySlot['time']
                              }
                            : entry
                        )
                      )
                    }
                  >
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </label>
              </div>

              <div className="availability-row-actions">
                <small>{formatAvailabilitySlot(slot)}</small>
                {slots.length > minSlots ? (
                  <Button
                    tone="ghost"
                    onClick={() => onChange(slots.filter((entry) => entry.id !== slot.id))}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}

        {slots.length < maxSlots ? (
          <Button
            tone="secondary"
            onClick={() =>
              onChange([
                ...slots,
                createAvailabilitySlot({ day: slots[slots.length - 1]?.day ?? defaultDay() })
              ])
            }
          >
            {addLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
