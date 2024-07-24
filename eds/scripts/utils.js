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

/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        // TODO: check if better ways are possible for partners.stage.adobe.com
        if (!(hostname.includes('.hlx.') || hostname.includes('local') || hostname === 'partners.stage.adobe.com')) return prodLibs;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
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

export function populateLocalizedTextFromListItems(el, localizedText) {
  const liList = Array.from(el.querySelectorAll('li'));
  liList.forEach((liEl) => {
    let liContent = liEl.innerText.trim().toLowerCase().replace(/ /g, '-');
    if (liContent.endsWith('_default')) liContent = liContent.slice(0, -8);
    localizedText[`{{${liContent}}}`] = liContent;
  });
}

export function formatDate(cardDate) {
  if (!cardDate) return;

  const dateObject = new Date(cardDate);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = dateObject.toLocaleString('en-US', options);
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
};

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
    'knowledge-base-overview': '"caas:adobe-partners/collections/knowledge-base"'
  }

  for (const [key, value] of Object.entries(cardBlocks)) {
    const el = document.querySelector(`.${key}`);
    if(!el) continue;

    preloadPlaceholders(locale);
    preloadLit(miloLibs);

    const block = {
      el,
      name: key,
      collectionTag: value,
      ietf: locale.ietf

    }
    const { default: PartnerCards } = await import('../components/PartnerCards.js'); 
    const caasUrl = PartnerCards.getCaasUrl(block);
    preload(caasUrl);
  }
}
