/**
 * Normalizes a string by removing diacritics and converting to lowercase
 * This allows matching strings with Swedish special characters (ö, ä, å)
 * against their normalized equivalents (o, a, a)
 * 
 * @param str - The string to normalize
 * @returns The normalized string
 * 
 * @example
 * normalizeString('Döckpoint') // returns 'dockpoint'
 * normalizeString('Malmö') // returns 'malmo'
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  
  return str
    .normalize('NFD') // Decompose characters into base + diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
    .trim();
}

/**
 * Checks if a search query matches a target string using normalized comparison
 * This enables searching for Swedish text with or without special characters
 * 
 * @param query - The search query
 * @param target - The target string to search in
 * @returns True if the normalized query is found in the normalized target
 * 
 * @example
 * searchMatch('dockpoint', 'Döckpoint Workshop') // returns true
 * searchMatch('Döckpoint', 'Dockpoint Workshop') // returns true
 */
export function searchMatch(query: string, target: string): boolean {
  if (!query || !target) return false;
  
  const normalizedQuery = normalizeString(query);
  const normalizedTarget = normalizeString(target);
  
  return normalizedTarget.includes(normalizedQuery);
}
