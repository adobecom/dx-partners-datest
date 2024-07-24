import { getLibs, replaceText, getConfig, populateLocalizedTextFromListItems } from '../../scripts/utils.js';
import PartnerNews from './PartnerNews.js';

function declarePartnerNews() {
  if (customElements.get('partner-news')) return;
  customElements.define('partner-news', PartnerNews);
}

async function localizationPromises(localizedText, config) {
  return Promise.all(Object.keys(localizedText).map(async (key) => {
    const value = await replaceText(key, config);
    if (value.length) localizedText[key] = value;
  }));
}

export default async function init(el) {
  performance.mark('partner-news:start');

  const miloLibs = getLibs();
  const config = getConfig();
  const asaPromise = fetch('https://www.adobe.com/chimera-api/collection?originSelection=dx-partners&draft=false&debug=true&flatFile=false&expanded=true&complexQuery=%28%28%22caas%3Aadobe-partners%2Fcollections%2Fnews%22%2BAND%2B%22caas%3Aadobe-partners%2Fspp%22%29%29%2BAND%2B%28%28%22caas%3Aadobe-partners%2Fspp%2Fpartner-level%2Fpublic%22%29%29&language=en&country=US');

  const sectionIndex = el.parentNode.getAttribute('data-idx');

  const localizedText = {
    '{{apply}}': 'Apply',
    '{{back}}': 'Back',
    '{{clear-all}}': 'Clear all',
    '{{current-month}}': 'Current month',
    '{{date}}': 'Date',
    '{{filter}}': 'Filter',
    '{{filter-by}}': 'Filter by',
    '{{filters}}': 'Filters',
    '{{last-90-days}}': 'Last 90 days',
    '{{load-more}}': 'Load more',
    '{{no-results-description}}': 'Try checking your spelling or broadening your search.',
    '{{no-results-title}}': 'No Results Found',
    '{{of}}': 'Of',
    '{{previous-month}}': 'Previous month',
    '{{results}}': 'Results',
    '{{search}}': 'Search',
    '{{show-all}}': 'Show all',
  };

  populateLocalizedTextFromListItems(el, localizedText);

  const deps = await Promise.all([
    localizationPromises(localizedText, config),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);

  declarePartnerNews();

  const dateFilter = {
    key: 'date',
    value: localizedText['{{date}}'],
    tags: [
      { key: 'show-all', value: localizedText['{{show-all}}'], parentKey: 'date', checked: true, default: true },
      { key: 'current-month', value: localizedText['{{current-month}}'], parentKey: 'date', checked: false },
      { key: 'previous-month', value: localizedText['{{previous-month}}'], parentKey: 'date', checked: false },
      { key: 'last-90-days', value: localizedText['{{last-90-days}}'], parentKey: 'date', checked: false },
    ],
  };

  const blockData = {
    localizedText,
    tableData: el.children,
    dateFilter,
    cardsPerPage: 12,
    ietf: config.locale.ietf,
    collectionTags: '"caas:adobe-partners/collections/news"',
    asa: asaPromise
  };

  const app = document.createElement('partner-news');
  app.className = 'content partner-news-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);

  await deps;
  performance.mark('partner-news:end');
  performance.measure('partner-news block', 'partner-news:start', 'partner-news:end');
  return app;
}
