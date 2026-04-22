import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CirclePlus,
  Compass,
  Home,
  ScrollText,
  Search,
  Settings,
  Trophy,
  UserRound,
  WalletCards,
  X
} from 'lucide-react';
import { Toast } from '@/types/models';

export function Screen({
  title,
  subtitle,
  action,
  children
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: ReactNode;
}>) {
  return (
    <section className="screen">
      <header className="screen-header">
        <div className="screen-copy">
          <p className="screen-kicker">HobbySwap</p>
          <h1>{title}</h1>
          {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="screen-action">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function Panel({
  title,
  eyebrow,
  aside,
  children
}: PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  aside?: ReactNode;
}>) {
  return (
    <div className="panel">
      {title || eyebrow || aside ? (
        <div className="panel-header">
          <div className="panel-copy">
            {eyebrow ? <p className="panel-eyebrow">{eyebrow}</p> : null}
            {title ? <h3>{title}</h3> : null}
          </div>
          {aside ? <div className="panel-aside">{aside}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Button({
  children,
  tone = 'primary',
  onClick,
  type = 'button',
  disabled = false
}: PropsWithChildren<{
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}>) {
  return (
    <button className={`button button-${tone}`} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function Pill({
  children,
  tone = 'warm'
}: PropsWithChildren<{ tone?: 'warm' | 'teal' | 'mauve' | 'neutral' | 'alert' }>) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function EmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = 'Loading your space...' }: { label?: string }) {
  return (
    <div className="loading-state">
      <div className="loading-dots">
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children
}: PropsWithChildren<{
  label: string;
  hint?: string;
  error?: string;
}>) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="text-input" {...props} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="text-input" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="text-input textarea-input" {...props} />;
}

export function Toggle({
  label,
  checked,
  onChange,
  description
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  description?: string;
}) {
  return (
    <button className="toggle-row" onClick={() => onChange(!checked)} type="button">
      <div className="toggle-copy">
        <strong>{label}</strong>
        {description ? <p>{description}</p> : null}
      </div>
      <span className={`toggle ${checked ? 'is-on' : ''}`}>
        <span />
      </span>
    </button>
  );
}

export function StatsGrid({
  items
}: {
  items: { label: string; value: string | number; tone?: 'warm' | 'teal' | 'mauve' }[];
}) {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div className={`stat-card tone-${item.tone ?? 'warm'}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function Segments({
  value,
  options,
  onChange
}: {
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <div className="segments">
      {options.map((option) => (
        <button
          className={`segment ${value === option ? 'active' : ''}`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function Avatar({
  label,
  color
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="avatar" style={{ background: color }}>
      {label
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search'
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-field">
      <Search size={18} />
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

export function ProgressBar({
  value,
  max,
  tone = 'teal'
}: {
  value: number;
  max: number;
  tone?: 'teal' | 'warm' | 'amber';
}) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="progress-shell" role="progressbar" aria-valuemax={max} aria-valuemin={0} aria-valuenow={value}>
      <div className={`progress-bar progress-${tone}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function ModalSheet({
  open,
  title,
  onClose,
  children
}: PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div className="sheet" aria-modal="true" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="sheet-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const mainTabs = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/challenges', label: 'Challenges', icon: Trophy },
  { to: '/app/profile', label: 'Me', icon: UserRound }
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-side">
        {mainTabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname.startsWith(tab.to);
          return (
            <Link className={`bottom-nav-link ${active ? 'active' : ''}`} key={tab.to} to={tab.to}>
              <Icon size={18} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <Link className={`bottom-nav-plus ${location.pathname.startsWith('/app/new') ? 'active' : ''}`} to="/app/new">
        <CirclePlus size={24} />
      </Link>

      <div className="bottom-nav-side">
        {mainTabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname.startsWith(tab.to);
          return (
            <Link className={`bottom-nav-link ${active ? 'active' : ''}`} key={tab.to} to={tab.to}>
              <Icon size={18} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const titles: Record<string, string> = {
  '/app/home': 'Home',
  '/app/discover': 'Discover',
  '/app/new': 'New',
  '/app/challenges': 'Challenges',
  '/app/profile': 'Me',
  '/app/log': 'Swap Log',
  '/app/messages': 'Messages',
  '/app/notifications': 'Notifications',
  '/app/settings': 'Settings',
  '/app/guide': 'App Guide'
};

export function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMainTab = ['/app/home', '/app/discover', '/app/new', '/app/challenges', '/app/profile'].some((tab) =>
    pathname.startsWith(tab)
  );
  const title = titles[pathname] ?? 'HobbySwap';

  const rightAction =
    pathname.startsWith('/app/profile') ? (
      <div className="top-actions">
        <Link className="icon-button" to="/app/notifications">
          <Bell size={18} />
        </Link>
        <Link className="icon-button" to="/app/settings">
          <Settings size={18} />
        </Link>
      </div>
    ) : pathname.startsWith('/app/home') || pathname.startsWith('/app/new') ? (
      <div className="top-actions">
        <Link className="icon-button" to="/app/log">
          <WalletCards size={18} />
        </Link>
        <Link className="icon-button" to="/app/notifications">
          <Bell size={18} />
        </Link>
      </div>
    ) : (
      <div className="top-actions">
        <Link className="icon-button" to="/app/log">
          <ScrollText size={18} />
        </Link>
        <Link className="icon-button" to="/app/notifications">
          <Bell size={18} />
        </Link>
      </div>
    );

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {!isMainTab ? (
          <button className="icon-button" onClick={() => navigate(-1)} type="button">
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className="brand-mark">
            <span />
          </div>
        )}
        <div>
          <p className="top-bar-eyebrow">Community-first skill sharing</p>
          <strong>{title}</strong>
        </div>
      </div>
      {rightAction}
    </header>
  );
}

export function ToastStack({
  items,
  onDismiss
}: {
  items: Toast[];
  onDismiss: (id: string) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const timers = items.map((item) =>
      window.setTimeout(() => {
        onDismiss(item.id);
      }, 4800)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items, onDismiss]);

  return (
    <div className="toast-stack" aria-live="polite">
      {items.slice(0, 2).map((item) => (
        <div className={`toast toast-${item.tone}`} key={item.id}>
          {item.route ? (
            <button
              className="toast-content toast-content-button"
              onClick={() => {
                navigate(item.route!);
                onDismiss(item.id);
              }}
              type="button"
            >
              <div>
                <strong>{item.title ?? 'Update'}</strong>
                <p>{item.message}</p>
              </div>
              <span>{item.actionLabel ?? 'View history'}</span>
            </button>
          ) : (
            <div className="toast-content">
              <strong>{item.title ?? 'Update'}</strong>
              <p>{item.message}</p>
            </div>
          )}
          <button className="toast-close" onClick={() => onDismiss(item.id)} type="button">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
