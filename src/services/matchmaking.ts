import { Hobby, QuickMatch, User } from '@/types/models';
import { createId } from '@/utils/createId';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function buildQuickMatches(currentUser: User, users: User[], hobbies: Hobby[]): QuickMatch[] {
  return users
    .filter((candidate) => candidate.id !== currentUser.id)
    .map((candidate) => {
      const shared = currentUser.hobbyProfiles.find((profile) =>
        candidate.hobbyProfiles.some((candidateProfile) => candidateProfile.hobbyId === profile.hobbyId)
      );
      const hobby = hobbies.find((item) => item.id === shared?.hobbyId);
      const km = distanceKm(
        currentUser.location.lat,
        currentUser.location.lng,
        candidate.location.lat,
        candidate.location.lng
      );

      return {
        id: createId('match'),
        userId: currentUser.id,
        matchUserId: candidate.id,
        hobbyId: hobby?.id ?? hobbies[0].id,
        reason: hobby
          ? `${candidate.displayName} shares ${hobby.label.toLowerCase()} and is about ${km.toFixed(1)} km away.`
          : `${candidate.displayName} has overlapping availability nearby.`,
        createdAt: new Date().toISOString()
      };
    })
    .sort((a, b) => a.reason.localeCompare(b.reason))
    .slice(0, 6);
}
