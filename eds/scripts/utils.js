/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const PARTNER_ERROR_REDIRECTS_COUNT_COOKIE = 'partner_redirects_count';
const MAX_PARTNER_ERROR_REDIRECTS_COUNT = 3;

/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search, origin } = location || window.location;
        if (origin.endsWith('adobe.com')) {
          return origin.replace('partners', 'milo') + prodLibs;
        }
        const partnerBranch = hostname.startsWith('main') ? 'main' : 'stage';
        const branch = new URLSearchParams(search).get('milolibs') || partnerBranch;
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.hlx.live/libs` : `https://${branch}--milo--adobecom.hlx.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

export const prodHosts = [
  'main--dx-partners--adobecom.hlx.page',
  'main--dx-partners--adobecom.hlx.live',
  'partners.adobe.com',
];

/*
 * ------------------------------------------------------------
 * Edit above at your own risk.
 *
 * Note: This file should have no self-invoking functions.
 * ------------------------------------------------------------
 */
export function formatDate(cardDate, locale = 'en-US') {
  if (!cardDate) return;

  const dateObject = new Date(cardDate);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = dateObject.toLocaleString(locale, options);
  // eslint-disable-next-line consistent-return
  return formattedDate;
}

export function getLocale(locales, pathname = window.location.pathname) {
  if (!locales) {
    return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  }
  const LANGSTORE = 'langstore';
  const split = pathname.split('/');
  const localeString = split[1];
  const locale = locales[localeString] || locales[''];
  if (localeString === LANGSTORE) {
    locale.prefix = `/${localeString}/${split[2]}`;
    if (
      Object.values(locales)
        .find((loc) => loc.ietf?.startsWith(split[2]))?.dir === 'rtl'
    ) locale.dir = 'rtl';
    return locale;
  }
  const isUS = locale.ietf === 'en-US';
  locale.prefix = isUS ? '' : `/${localeString}`;
  locale.region = isUS ? 'us' : localeString.split('_')[0];
  return locale;
}

function preload(url) {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'fetch';
  preloadLink.crossOrigin = true;
  preloadLink.href = url;
  document.head.appendChild(preloadLink);
}

function preloadPlaceholders(locale) {
  const placeholderUrl = `${locale.prefix}/eds/partners-shared/placeholders.json`;
  preload(placeholderUrl);
}

function preloadLit(miloLibs) {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'modulepreload';
  preloadLink.crossOrigin = true;
  preloadLink.href = `${miloLibs}/deps/lit-all.min.js`;
  document.head.appendChild(preloadLink);
}

export async function preloadResources(locales, miloLibs) {
  const locale = getLocale(locales);
  const cardBlocks = {
    'partner-news': '"caas:adobe-partners/collections/news"',
    'knowledge-base-overview': '"caas:adobe-partners/collections/knowledge-base"',
  };
// since we are going to add search-full  later, adding this code update now to prevent being forgotten since in search
  // block we are not aware of this logic
  const blockWithPlaceholders = ['search-full'];
  let isPreloadCalled = false;
  blockWithPlaceholders.forEach(async (item) => {
    const el = document.querySelector(`.${item}`);
    if (!el) return;
    if (!isPreloadCalled) {
      preloadPlaceholders(locale);
      isPreloadCalled = true;
    }
  });

  Object.entries(cardBlocks).forEach(async ([key, value]) => {
    const el = document.querySelector(`.${key}`);
    if (!el) return;

    preloadPlaceholders(locale);
    preloadLit(miloLibs);

    const block = {
      el,
      name: key,
      collectionTag: value,
      ietf: locale.ietf,
    };
    const caasUrl = getCaasUrl(block);
    preload(caasUrl);
  });
}

export function getProgramType(path) {
  switch (true) {
    case /solutionpartners/.test(path): return 'spp';
    case /technologypartners/.test(path): return 'tpp';
    case /channelpartners/.test(path): return 'cpp';
    default: return '';
  }
}

export function getCurrentProgramType() {
  return getProgramType(window.location.pathname);
}
export function getCookieValue(key) {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((el) => el.startsWith(`${key}=`));
  return cookie?.substring((`${key}=`).length);
}
export function getPartnerDataCookieValue(programType, key) {
  try {
    const partnerDataCookie = getCookieValue('partner_data');
    if (!partnerDataCookie) return;
    const partnerDataObj = JSON.parse(decodeURIComponent(partnerDataCookie.toLowerCase()));
    const portalData = partnerDataObj?.[programType];
    // eslint-disable-next-line consistent-return
    return portalData?.[key];
  } catch (error) {
    console.error('Error parsing partner data object:', error);
    // eslint-disable-next-line consistent-return
    return '';
  }
}

export function getCaasUrl(block) {
  const useStageCaasEndpoint = block.name === 'knowledge-base-overview';
  const domain = `${(useStageCaasEndpoint && !prodHosts.includes(window.location.host)) ? 'https://14257-chimera-stage.adobeioruntime.net/api/v1/web/chimera-0.0.1' : 'https://www.adobe.com/chimera-api'}`;
  const api = new URL(`${domain}/collection?originSelection=dx-partners&draft=false&debug=true&flatFile=false&expanded=true`);
  return setApiParams(api, block);
}

function setApiParams(api, block) {
  const { el, collectionTag, ietf } = block;
  const complexQueryParams = getComplexQueryParams(el, collectionTag);
  if (complexQueryParams) api.searchParams.set('complexQuery', complexQueryParams);

  const [language, country] = ietf.split('-');
  if (language && country) {
    api.searchParams.set('language', language);
    api.searchParams.set('country', country);
  }

  return api.toString();
}

function extractTableCollectionTags(el) {
  let tableCollectionTags = [];
  Array.from(el.children).forEach((row) => {
    const cols = Array.from(row.children);
    const rowTitle = cols[0].textContent.trim().toLowerCase().replace(/ /g, '-');
    const colsContent = cols.slice(1);
    if (rowTitle === 'collection-tags') {
      const [collectionTagsEl] = colsContent;
      const collectionTags = Array.from(collectionTagsEl.querySelectorAll('li'), (li) => `"${li.textContent.trim().toLowerCase()}"`);
      tableCollectionTags = [...tableCollectionTags, ...collectionTags];
    }
  });

  return tableCollectionTags;
}

function getComplexQueryParams(el, collectionTag) {
  const portal = getCurrentProgramType();
  if (!portal) return;

  const portalCollectionTag = `"caas:adobe-partners/${portal}"`;
  const tableTags = extractTableCollectionTags(el);
  const collectionTags = [collectionTag, portalCollectionTag, ...tableTags];

  const partnerLevelParams = getPartnerLevelParams(portal);

  if (!collectionTags.length) return;

  const collectionTagsStr = collectionTags.filter((e) => e.length).join('+AND+');
  let resulStr = `(${collectionTagsStr})`;

  const qaContentTag = '"caas:adobe-partners/qa-content"';
  if (!checkForQaContent(el)) {
    resulStr += `+NOT+${qaContentTag}`;
  }

  if (partnerLevelParams) resulStr += `+AND+${partnerLevelParams}`;
  // eslint-disable-next-line consistent-return
  return resulStr;
}

function checkForQaContent(el) {
  if (!el.children) return false;

  // Iterating backward because we expect 'qa-content' to be in the last rows.
  // eslint-disable-next-line no-plusplus
  for (let i = el.children.length - 1; i >= 0; i--) {
    const row = el.children[i];

    const rowTitle = row.children[0]?.innerText?.trim().toLowerCase().replace(/ /g, '-');
    if (rowTitle?.includes('qa-content')) {
      return true;
    }
  }

  return false;
}

function getPartnerLevelParams(portal) {
  const partnerLevel = getPartnerDataCookieValue(portal, 'level');
  const partnerTagBase = `"caas:adobe-partners/${portal}/partner-level/`;
  return partnerLevel ? `(${partnerTagBase}${partnerLevel}"+OR+${partnerTagBase}public")` : `(${partnerTagBase}public")`;
}

export function hasSalesCenterAccess() {
  const { salesCenterAccess } = getPartnerDataCookieObject(getCurrentProgramType());
  return !!salesCenterAccess;
}

export function getPartnerDataCookieObject(programType) {
  const partnerDataCookie = getCookieValue('partner_data');
  if (!partnerDataCookie) return {};
  const partnerDataObj = JSON.parse(decodeURIComponent(partnerDataCookie));
  const portalData = partnerDataObj?.[programType.toUpperCase()] ?? {};
  return portalData;
}

export function isMember() {
  const { status } = getPartnerDataCookieObject(getCurrentProgramType());
  return status === 'MEMBER';
}

export function partnerIsSignedIn() {
  return getCookieValue('partner_data');
}

export function signedInNonMember() {
  return partnerIsSignedIn() && !isMember();
}

export function getNodesByXPath(query, context = document) {
  const nodes = [];
  const xpathResult = document.evaluate(query, context, null, XPathResult.ANY_TYPE);
  let current = xpathResult?.iterateNext();
  while (current) {
    nodes.push(current);
    current = xpathResult.iterateNext();
  }
  return nodes;
}

export function isRenew() {
  const programType = getCurrentProgramType();

  const primaryContact = getPartnerDataCookieValue(programType, 'primarycontact');
  if (!primaryContact) return;

  const partnerLevel = getPartnerDataCookieValue(programType, 'level');
  if (partnerLevel !== 'gold' && partnerLevel !== 'registered' && partnerLevel !== 'certified') return;

  const accountExpiration = getPartnerDataCookieValue(programType, 'accountanniversary');
  if (!accountExpiration) return;

  const expirationDate = new Date(accountExpiration);
  const now = new Date();

  let accountStatus;
  let daysNum;

  const differenceInMilliseconds = expirationDate - now;
  const differenceInDays = Math.abs(differenceInMilliseconds) / (1000 * 60 * 60 * 24);
  const differenceInDaysRounded = Math.floor(differenceInDays);

  if (differenceInMilliseconds > 0 && differenceInDays < 31) {
    accountStatus = 'expired';
    daysNum = differenceInDaysRounded;
  } else if (differenceInMilliseconds < 0 && differenceInDays <= 90) {
    accountStatus = 'suspended';
    daysNum = 90 - differenceInDaysRounded;
  } else {
    return;
  }
  // eslint-disable-next-line consistent-return
  return { accountStatus, daysNum };
}
// todo check do we need redirectLoggedinPartner and updateIMSConfig added to dme in https://github.com/adobecom/dme-partners/commit/2d6613ae8e45ad1f1bd6fd073b2a421222433d78
// it looks like it is intentionally skipped for this repo since it is very old date of implementation

export function deleteCookieValue(key) {
  document.cookie = `${key}=; Path=/; Max-Age=0;`;
}

export function getMetadataContent(name) {
  return document.querySelector(`meta[name="${name}"]`)?.content;
}

export function redirectLoggedinPartner() {
  if (!isMember()) return;
  const partnerErrorRedirectsCount = getCookieValue(PARTNER_ERROR_REDIRECTS_COUNT_COOKIE);
  if (partnerErrorRedirectsCount) {
    const count = Number(partnerErrorRedirectsCount);
    if (count && Number.isInteger(count) && count >= MAX_PARTNER_ERROR_REDIRECTS_COUNT) {
      deleteCookieValue(PARTNER_ERROR_REDIRECTS_COUNT_COOKIE);
      return;
    }
  }
  const target = getMetadataContent('adobe-target-after-login');
  if (!target || target === 'NONE') return;
  document.body.style.display = 'none';
  window.location.assign(target);
}

// todo check do we need enableGeoPopup  since in scripts/scripts.js it is commented out , while on dme we have geoRouting: enableGeoPopup(),
// todo should we include also setupPage() - to setup gnav and footer
