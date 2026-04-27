import { Hobby } from '@/types/models';

const hobbyLabels = [
  'Acting',
  'Art collecting',
  'Being a DJ',
  'Calligraphy',
  'Crocheting',
  'Dancing',
  'Designing clothing',
  'Drawing',
  'Freestyling',
  'Glassblowing',
  'Graphic design',
  'Jewelry making',
  'Improvisation',
  'LARPing',
  'Metalworking',
  'Needlepoint',
  'Origami',
  'Painting',
  'Photography',
  'Playing a musical instrument',
  'Podcasting',
  'Poetry',
  'Pottery',
  'Quilting',
  'Record collecting',
  'Scrapbooking',
  'Soap making',
  'Stand-up comedy',
  'Weaving',
  'Web design',
  'Welding',
  'Wood burning',
  'Woodworking',
  'Writing',
  'Baking',
  'Bread making',
  'Brewing',
  'Cheese-making',
  'Cooking',
  'Mixology',
  'Winemaking',
  'Wine tasting',
  'Billiards',
  'Board games',
  'Card games',
  'Chess',
  'Crossword puzzles',
  'Escape rooms',
  'Fantasy sports',
  'Jigsaw puzzles',
  'Lego sets',
  'Model trains',
  'Paintball',
  'Remote airplanes',
  'Remote cars',
  'Table tennis',
  'Trivia',
  'Video games',
  'Amateur radio',
  'Bonsai',
  'Book collecting',
  'Candle-making',
  'Election forecasting',
  'Focus groups',
  'Furniture restoration',
  'Genealogy',
  'Investing',
  'Journaling',
  'Karaoke',
  'Knitting',
  'Local historical society',
  'Makeup',
  'Movie reviews',
  'Museum visiting',
  'Reading',
  'Robot combat',
  'Taxidermy',
  'Thrifting',
  'Wikipedia editing',
  'Astronomy',
  'Beekeeping',
  'Bird watching',
  'Camping',
  'Car racing',
  'Composting',
  'Drones',
  'Farming',
  'Fishing',
  'Flying',
  'Gardening',
  'Geocaching',
  'Home improvement projects',
  'Launching rockets',
  'Metal detecting',
  'Meteorology',
  'National Park Travelers Club',
  'Sailing',
  'Scuba diving',
  'Shuffleboard',
  'Skydiving',
  'Traveling',
  'Vehicle restoration',
  'App making',
  'Electronics repair',
  'Hacking',
  'Video production',
  'Archery',
  'Backpacking',
  'Bowling',
  'Bungee jumping',
  'Crossfit',
  'Disc golfing',
  'Golfing',
  'Gymnastics',
  'Handball',
  'Hiking',
  'Horseback riding',
  'Ice skating',
  'Juggling',
  'Kayaking',
  'Kite surfing',
  'Martial arts',
  'Powerlifting',
  'Rock climbing',
  'Running',
  'Skiing',
  'Slacklining',
  'Snowboarding',
  'Surfing',
  'Swimming',
  'Water skiing',
  'Yoga',
  'Animal breeding',
  'Animal grooming',
  'Pet fostering'
] as const;

const palette = ['#d86c42', '#789e78', '#7f6bd4', '#d8a246', '#5a73c8', '#cc5f8d', '#4f8b5a'];

const legacyHobbies: Hobby[] = [
  { id: 'watercolor', label: 'Watercolor', icon: '🎨', color: '#d86c42' },
  { id: 'pottery', label: 'Pottery', icon: '🏺', color: '#9c6a48' },
  { id: 'film-photo', label: 'Film Photo', icon: '📷', color: '#7f8f6b' },
  { id: 'guitar', label: 'Guitar', icon: '🎸', color: '#d79a35' },
  { id: 'crochet', label: 'Crochet', icon: '🧶', color: '#cc5f8d' },
  { id: 'journaling', label: 'Journaling', icon: '📔', color: '#5a73c8' },
  { id: 'urban-gardening', label: 'Urban Gardening', icon: '🪴', color: '#4f8b5a' },
  { id: 'dance', label: 'Street Dance', icon: '🕺', color: '#ef8b5a' }
];

function iconForLabel(label: string) {
  const lower = label.toLowerCase();

  if (lower.includes('photo') || lower.includes('video') || lower.includes('podcast')) {
    return '📷';
  }
  if (lower.includes('music') || lower.includes('dj') || lower.includes('karaoke')) {
    return '🎵';
  }
  if (lower.includes('paint') || lower.includes('draw') || lower.includes('art')) {
    return '🎨';
  }
  if (lower.includes('cook') || lower.includes('bake') || lower.includes('wine') || lower.includes('brew')) {
    return '🍳';
  }
  if (lower.includes('game') || lower.includes('chess') || lower.includes('trivia') || lower.includes('puzzle')) {
    return '🎲';
  }
  if (lower.includes('garden') || lower.includes('bonsai') || lower.includes('beekeeping')) {
    return '🪴';
  }
  if (lower.includes('swim') || lower.includes('surf') || lower.includes('sailing') || lower.includes('diving')) {
    return '🌊';
  }
  if (lower.includes('run') || lower.includes('hiking') || lower.includes('crossfit') || lower.includes('yoga')) {
    return '🏃';
  }
  if (lower.includes('wood') || lower.includes('metal') || lower.includes('welding') || lower.includes('repair')) {
    return '🛠️';
  }
  if (lower.includes('animal') || lower.includes('pet')) {
    return '🐾';
  }
  return '✨';
}

export function toHobbyId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildHobbyCatalog(): Hobby[] {
  const expanded = hobbyLabels.map((label, index) => ({
    id: toHobbyId(label),
    label,
    icon: iconForLabel(label),
    color: palette[index % palette.length]
  }));

  return [...legacyHobbies, ...expanded.filter((hobby) => !legacyHobbies.some((legacy) => legacy.id === hobby.id))];
}
