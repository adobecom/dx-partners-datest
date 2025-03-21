import { getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();
const { getConfig } = await import(`${miloLibs}/utils/utils.js`);

/**
 * Hash returned in base 36 (highest possible) to encode in as few bytes as possible
 * https://en.wikipedia.org/wiki/Rolling_hash
 * @param {string} s to hash
 * @param {int} l length that hash should be
 * @returns {string} the hashed string
 */
export function rollingHash(s, l = 6) {
  if (!s) {
    return '';
  }
  const BASE = 53;
  const MOD = 10 ** l + 7;
  let hash = 0;
  let basePower = 1;
  /* eslint-disable-next-line no-plusplus */
  for (let i = 0; i < s.length; i++) {
    hash = (hash + (s.charCodeAt(i) - 97 + 1) * basePower) % MOD;
    basePower = (basePower * BASE) % MOD;
  }
  return ((hash + MOD) % MOD).toString(36);
}
function getTagTitleLocalized(tag) {
  const { locale } = getConfig();
  const localeToTagTranslationLocaleDiffs = { cn: 'zh_cn' };
  const mappedLocale = localeToTagTranslationLocaleDiffs[locale?.region] || locale?.region;
  return tag[`title.${mappedLocale}`] || tag.title;
}
export function extractFilterData(tagPath, caasTags) {
  const pathParts = tagPath.replace('caas:', '').split('/'); // Remove prefix and split by hierarchy
  let currentLevel = caasTags.caas.tags; // Start from the root tags
  let foundTag;
  // eslint-disable-next-line no-restricted-syntax
  for (const part of pathParts) {
    foundTag = currentLevel[part];
    if (!foundTag) return [];
    currentLevel = foundTag.tags || [];
  }
  const filterItems = Object.entries(currentLevel)
    .map(([, value]) => ({ key: value.tagID, value: getTagTitleLocalized(value) }));
  const filterData = { value: getTagTitleLocalized(foundTag), key: foundTag.tagID };
  return { filterData, filterItems };
}
