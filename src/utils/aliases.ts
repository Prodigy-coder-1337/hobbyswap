const descriptors = ['Quiet', 'Kind', 'Bright', 'Steady', 'Soft', 'North', 'Pocket', 'Calm'];
const nouns = ['Atlas', 'Mango', 'Fern', 'Lantern', 'Comet', 'Pebble', 'Transit', 'Harbor'];

export function createAnonymousAlias(seed = Date.now().toString()) {
  const value = seed
    .split('')
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);

  return `${descriptors[value % descriptors.length]} ${nouns[value % nouns.length]}`;
}
