import { GeoPoint, User } from '@/types/models';

export function peso(value: number | null) {
  if (value === null) {
    return 'Swap only';
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(value);
}

export function locationLabel(location: GeoPoint, precise = true) {
  return precise
    ? `${location.barangay}, ${location.city}`
    : location.city;
}

export function userLabel(user: User, viewerWantsAlias = false) {
  return viewerWantsAlias ? user.anonymousAlias : user.displayName;
}

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
