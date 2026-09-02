/**
 * Normalizes Arabic text to allow fuzzy/flexible searching.
 * Removes diacritics (tashkeel), unifies different forms of Alef (أ, إ, آ -> ا),
 * Ta Marbuta (ة -> ه), Alef Maqsura / Yaa (ى -> ي), and strips extra whitespace.
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic diacritics/tashkeel
    .replace(/[أإآٱ]/g, 'ا') // unify Alef forms
    .replace(/ة/g, 'ه') // unify Ta Marbuta to Ha
    .replace(/[ىي]/g, 'ي') // unify Alef Maqsura to Yaa
    .replace(/[\u0600-\u061F\u066A-\u066F]/g, '') // Arabic punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Checks if a source string matches a query with Arabic normalization and space tolerance.
 * Supports matching e.g. "عبد الباسط" with "عبدالباسط" and vice versa.
 */
export function matchesArabic(source: string, targetQuery: string): boolean {
  if (!targetQuery || !targetQuery.trim()) return true;
  if (!source) return false;

  const normSource = normalizeArabic(source);
  const normQuery = normalizeArabic(targetQuery);

  if (normSource.includes(normQuery)) return true;

  // Compare without spaces to handle compound names (e.g. "عبد الباسط" vs "عبدالباسط")
  const noSpaceSource = normSource.replace(/\s+/g, '');
  const noSpaceQuery = normQuery.replace(/\s+/g, '');

  return noSpaceSource.includes(noSpaceQuery);
}
