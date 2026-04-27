import { useMemo, useState } from 'react';
import { Button, SearchField } from '@/components/ui';
import { Hobby } from '@/types/models';

type HobbyPickerProps = {
  hobbies: Hobby[];
  selectedIds: string[];
  onToggle: (hobbyId: string) => void;
};

export function HobbyPicker({ hobbies, selectedIds, onToggle }: HobbyPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    if (!query.trim()) {
      return hobbies;
    }

    return hobbies.filter((hobby) => hobby.label.toLowerCase().includes(query.trim().toLowerCase()));
  }, [hobbies, query]);

  return (
    <div className="hobby-picker">
      <button className="hobby-picker-trigger" onClick={() => setOpen((state) => !state)} type="button">
        <div>
          <span className="field-label">Choose hobbies</span>
          <p className="field-hint">
            {selectedIds.length ? `${selectedIds.length} selected` : 'Search and add the ones you actually do.'}
          </p>
        </div>
        <span>{open ? 'Close' : 'Open'}</span>
      </button>

      {selectedIds.length ? (
        <div className="chip-wrap">
          {selectedIds.map((id) => {
            const hobby = hobbies.find((item) => item.id === id);
            return hobby ? (
              <button className="chip active" key={id} onClick={() => onToggle(id)} type="button">
                {hobby.label}
              </button>
            ) : null;
          })}
        </div>
      ) : null}

      {open ? (
        <div className="hobby-picker-dropdown">
          <SearchField value={query} onChange={setQuery} placeholder="Search hobbies" />
          <div className="hobby-picker-list">
            {visible.map((hobby) => {
              const active = selectedIds.includes(hobby.id);

              return (
                <button
                  className={`hobby-picker-option ${active ? 'active' : ''}`}
                  key={hobby.id}
                  onClick={() => onToggle(hobby.id)}
                  type="button"
                >
                  <span className="hobby-picker-option-copy">
                    <strong>{hobby.label}</strong>
                    <small>{active ? 'Selected' : 'Tap to add'}</small>
                  </span>
                  <span className="hobby-picker-check">{active ? 'On' : 'Add'}</span>
                </button>
              );
            })}
          </div>
          <Button tone="secondary" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      ) : null}
    </div>
  );
}
