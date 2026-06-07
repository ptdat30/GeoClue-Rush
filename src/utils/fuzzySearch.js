/**
 * Normalize string: remove Vietnamese diacritics and lowercase
 */
export function removeDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Setup Fuse.js instance for fuzzy country search
 */
import Fuse from 'fuse.js';

export function createFuseIndex(countries) {
  // Pre-process: add normalized names for diacritic-free search
  const processed = countries.map(c => ({
    ...c,
    nameNormalized: removeDiacritics(c.name),
    nameViNormalized: removeDiacritics(c.nameVi),
    aliasesNormalized: c.aliases.map(a => removeDiacritics(a)),
  }));

  const fuse = new Fuse(processed, {
    keys: [
      { name: 'nameViNormalized', weight: 0.35 },
      { name: 'nameNormalized', weight: 0.25 },
      { name: 'aliasesNormalized', weight: 0.25 },
      { name: 'nameVi', weight: 0.15 },
    ],
    threshold: 0.35,
    distance: 100,
    minMatchCharLength: 1,
    includeScore: true,
  });

  return { fuse, processed };
}

/**
 * Search countries with normalized query
 */
export function searchCountries(fuse, query, maxResults = 5) {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = removeDiacritics(query);
  const results = fuse.search(normalizedQuery);
  return results.slice(0, maxResults).map(r => r.item);
}
