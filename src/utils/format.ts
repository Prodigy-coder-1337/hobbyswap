import { GeoPoint, MarketplaceListing, User } from '@/types/models';

export function peso(value: number | null) {
  if (value === null) {
    return 'Free';
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(value);
}

export function credits(value: number | null) {
  if (value === null) {
    return 'No credits';
  }

  return `${value} cr`;
}

export function dualPrice(listing: Pick<MarketplaceListing, 'priceMode' | 'creditPrice' | 'cashPricePhp'>) {
  switch (listing.priceMode) {
    case 'free':
      return 'Free';
    case 'credits':
      return credits(listing.creditPrice);
    case 'cash':
      return peso(listing.cashPricePhp);
    case 'both':
      return `${peso(listing.cashPricePhp)} or ${credits(listing.creditPrice)}`;
    default:
      return 'Flexible';
  }
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
