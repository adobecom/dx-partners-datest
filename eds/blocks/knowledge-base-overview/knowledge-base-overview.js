import { getLibs, replaceText, getConfig } from './../../scripts/utils.js';
import { KnowledgeBaseOverview } from './KnowledgeBaseOverview.js';

function declareKnowledgeBaseOverview() {
  if (customElements.get('knowledge-base-overview')) return;
  customElements.define('knowledge-base-overview', KnowledgeBaseOverview);
}

async function localizationPromises(localizedText, config) {
  return Promise.all(Object.keys(localizedText).map(async (key) => {
    const value = await replaceText(key, config);
    if (value.length) localizedText[key] = value;
  }));
}

export default async function init(el) {
  performance.mark('knowledge-base-overview:start');

  const miloLibs = getLibs();
  const config = getConfig();

  const sectionIndex = el.parentNode.getAttribute('data-idx');

  let blockData = {
    'title': '',
    'filters': [],
    'sort': {
      'default': {},
      items: []
    },
    'cardsPerPage': 9
  }

  let localizedText = {
    '{{apply}}': 'Apply',
    '{{back}}': 'Back',
    '{{clear-all}}': 'Clear all',
    '{{filter}}': 'Filter',
    '{{filter-by}}': 'Filter by',
    '{{filters}}': 'Filters',
    '{{next}}': 'Next',
    '{{next-page}}': 'Next Page',
    '{{no-results-description}}': 'Try checking your spelling or broadening your search.',
    '{{no-results-title}}': 'No Results Found',
    '{{of}}': 'Of',
    '{{page}}': 'Page',
    '{{prev}}': 'Prev',
    '{{previous-page}}': 'Previous Page',
    '{{results}}': 'Results',
    '{{search}}': 'Search',
  };

  const blockDataActions = {
    'title': (cols) => {
      const [titleEl] = cols;
      blockData.title = titleEl.innerText.trim();
    },
    'filter': (cols) => {
      const [filterKeyEl, filterValueEl, filterTagsKeysEl, filterTagsValueEl] = cols;
      const filterKey = filterKeyEl.innerText.trim().toLowerCase();
      const filterValue = filterValueEl.innerText.trim();
      const filterTagsKeys = Array.from(filterTagsKeysEl.querySelectorAll('li'), (li) => li.innerText.trim().toLowerCase());
      const filterTagsValue = Array.from(filterTagsValueEl.querySelectorAll('li'), (li) => li.innerText.trim());

      if (!filterKey || !filterTagsKeys.length) return;

      let filterObj = {
        key: filterKey,
        value: filterValue,
        tags: filterTagsKeys.map((tagKey, tagIndex) => ({
          key: tagKey.replaceAll(' ', '-'),
          parentKey: filterKey,
          value: filterTagsValue[tagIndex],
          checked: false
        }))
      };
      blockData.filters.push(filterObj);
    },
    'sort': (cols) => {
      const [sortKeysEl, sortValuesEl] = cols;
      const sortKeys = Array.from(sortKeysEl.querySelectorAll('li'), (li) => li.innerText.trim().toLowerCase());
      const sortValues = Array.from(sortValuesEl.querySelectorAll('li'), (li) => li.innerText.trim());

      const sortItems = sortKeys.map((sortKey, sortIndex) => ({
        key: sortKey.endsWith('_default') ? sortKey.slice(0, -8) : sortKey,
        value: sortValues[sortIndex]
      }));

      const defaultKey = sortKeys.find(key => key.endsWith('_default')).slice(0, -8) || sortKeys[0];
      const defaultValue = sortItems.find(e => e.key === defaultKey).value;

      blockData.sort = { items: sortItems, default: { key: defaultKey, value: defaultValue }};
    },
    'cards per page': (cols) => {
      const [cardsPerPageEl] = cols;
      const cardsPerPageStr = cardsPerPageEl.innerText.trim();
      const cardsPerPageNum = parseInt(cardsPerPageStr);
      if (cardsPerPageNum) blockData.cardsPerPage = cardsPerPageNum;
    }
  }

  const rows = Array.from(el.children);
  rows.forEach((row) => {
    const cols = Array.from(row.children);
    const rowTitle = cols[0].innerText.trim().toLowerCase();
    const colsContent = cols.slice(1);
    if (blockDataActions[rowTitle]) blockDataActions[rowTitle](colsContent);
  })

  const deps = await Promise.all([
    localizationPromises(localizedText, config),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);

  declareKnowledgeBaseOverview();

  blockData.localizedText = localizedText;

  const app = document.createElement('knowledge-base-overview');
  app.className = 'content knowledge-base-overview-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);

  await deps;
  performance.mark('knowledge-base-overview:end');
  performance.measure('knowledge-base-overview block', 'knowledge-base-overview:start', 'knowledge-base-overview:end');
  return app;
}
