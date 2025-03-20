// import caasTags from "@adobecom/milo/libs/blocks/caas-config/caas-tags.js";
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
    // .filter(([key, value]) => existingTags.has(value.tagID)) // Filter if tagId exists in the set
    .map(([, value]) => ({ key: value.tagID, value: value.title }));
  const filterData = { value: foundTag.title, key: foundTag.tagID };
  return { filterData, filterItems };
}
