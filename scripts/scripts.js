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


// Add project-wide style path here.
const STYLES = '';

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';

// Add any config options.
const CONFIG = {
  // codeRoot: '',
  // contentRoot: '',
  imsClientId: window.location.origin.includes('-dev') ? 'APP_GRAVITY_RUNTIME' :  'APP_GRAVITY_RUNTIME_TEST_PROD',
  imsScope: 'AdobeID,openid',
  env: {
    ims: 'stage',
  },
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

// Load LCP image immediately
(function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

// const miloLibs = 'https://main--milo--adobecom.hlx.live/libs';
const miloLibs = 'https://test-ratko--milo--zagi25.hlx.page/libs';
if (window.location.hash.includes('access_token')) {
  window.location.hash = '';
}

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);

  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  const imsReady = setInterval(() => {
    if (window.adobeIMS && window.adobeIMS.initialized) {
      clearInterval(imsReady);
      window.adobeIMS.adobeIdData.alwaysRemoveTokenFromUrl = true;
      if (window.adobeIMS.isSignedInUser()) {
        const signOutReady = setInterval(() => {
          const signOutBtn = document.querySelector('.feds-profile-actions')?.lastElementChild;
          if (signOutBtn) {
            clearInterval(signOutReady);
            const newSignOutBtn = signOutBtn.cloneNode(true);
            newSignOutBtn.addEventListener('click', async (e) => {
              e.preventDefault();
              const logoutResponse = await fetch('https://14257-ratkotest-dev.adobeioruntime.net/api/v1/web/RatkoDev/logout');
              window.adobeIMS.adobeIdData.redirect_uri = 'https://14257-ratkotest-dev.adobeioruntime.net/api/v1/web/RatkoDev/edge-worker?page=https://test-branch3--dx-partners--adobecom.hlx.page/SPP/drafts/ratko/public'
              window.adobeIMS.signOut();
            });
            signOutBtn.replaceWith(newSignOutBtn);
          }
        },100);
      }
    }
  }, 1000);
}());
