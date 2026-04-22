import { PropsWithChildren, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Compass,
  Home,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
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
        <div>
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
          <div>
            {eyebrow ? <p className="panel-eyebrow">{eyebrow}</p> : null}
            {title ? <h3>{title}</h3> : null}
          </div>
          {aside}
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
    <button className={`button button-${tone}`} onClick={onClick} type={type} disabled={disabled}>
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
    <button className="toggle-row" type="button" onClick={() => onChange(!checked)}>
      <div>
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

export function Pagination({
  page,
  totalPages,
  onChange
}: {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="pagination">
      <Button tone="secondary" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button tone="secondary" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next
      </Button>
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
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
      <div className="sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
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

const tabConfig = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/swap', label: 'Swap', icon: ShoppingBag },
  { to: '/app/events', label: 'Events', icon: Calendar },
  { to: '/app/profile', label: 'Profile', icon: UserRound }
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {tabConfig.map((tab) => {
        const active = location.pathname.startsWith(tab.to);
        const Icon = tab.icon;
        return (
          <Link className={`bottom-nav-link ${active ? 'active' : ''}`} key={tab.to} to={tab.to}>
            <Icon size={18} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const titles: Record<string, string> = {
  '/app/home': 'Dashboard',
  '/app/discover': 'Discover',
  '/app/swap': 'Swap Marketplace',
  '/app/events': 'Events',
  '/app/profile': 'Profile',
  '/app/contracts': 'Swap Contracts',
  '/app/log': 'Swap Log',
  '/app/resources': 'Resource Library',
  '/app/challenges': 'Weekly Challenges',
  '/app/messages': 'Messaging',
  '/app/notifications': 'Notifications',
  '/app/settings': 'Settings',
  '/app/guide': 'App Guide',
  '/app/moderation': 'Moderation',
  '/app/mentorship': 'Mentorship',
  '/app/projects': 'Project Spaces',
  '/app/videos': 'Video Hub'
};

export function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMainTab = tabConfig.some((tab) => pathname.startsWith(tab.to));
  const title = titles[pathname] ?? 'HobbySwap';

  const rightAction = pathname.startsWith('/app/profile') ? (
    <Link className="icon-button" to="/app/settings">
      <Settings size={18} />
    </Link>
  ) : pathname.startsWith('/app/swap') ? (
    <Link className="icon-button" to="/app/swap?compose=1">
      <Plus size={18} />
    </Link>
  ) : pathname.startsWith('/app/events') ? (
    <Link className="icon-button" to="/app/events?host=1">
      <Plus size={18} />
    </Link>
  ) : (
    <Link className="icon-button" to="/app/notifications">
      <Bell size={18} />
    </Link>
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
          <p className="top-bar-eyebrow">Community-first hobby sharing</p>
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
  return (
    <div className="toast-stack">
      {items.slice(0, 3).map((item) => (
        <button
          className={`toast toast-${item.tone}`}
          key={item.id}
          onClick={() => onDismiss(item.id)}
          type="button"
        >
          {item.message}
        </button>
      ))}
    </div>
  );
}
