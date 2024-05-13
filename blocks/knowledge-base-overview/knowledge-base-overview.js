import {getLibs, replaceText} from '../../scripts/utils.js';
import { KnowledgeBaseOverview } from './../../deps/KnowledgeBaseOverview.js';

async function declareKnowledgeBaseOverview() {
  if (customElements.get('knowledge-base-overview')) return;
  customElements.define('knowledge-base-overview', KnowledgeBaseOverview);
}

export default async function init(el) {
  performance.mark('knowledge-base-overview:start');

  const miloLibs = getLibs();
  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const config = getConfig();

  const sectionIndex = el.parentNode.getAttribute('data-idx');

  let blockData = {
    'title': '',
    'filters': [],
    'sort': {
      'default': '',
      items: []
    }
  }

  let localizedText = {
    '{{apply}}': 'Apply',
    '{{back}}': 'Back',
    '{{clear-all}}': 'Clear all',
    '{{filter}}': 'Filter',
    '{{filter-by}}': 'Filter by',
    '{{filters}}': 'Filters',
    '{{next}}': 'Next',
    '{{no-results-description}}': 'Try checking your spelling or broadening your search.',
    '{{no-results-title}}': 'No Results Found',
    '{{of}}': 'Of',
    '{{prev}}': 'Prev',
    '{{previous}}': 'Previous',
    '{{results}}': 'Results',
    '{{search}}': 'Search',
  };

  async function localizationPromises() {
    return Promise.all(Object.keys(localizedText).map(async (key) => {
      const value = await replaceText(key, config);
      if (value.length) localizedText[key] = value;
    }));
  }

  const blockDataActions = {
    'title': (cols) => {
      const [titleEl] = cols;
      blockData.title = titleEl.innerHTML.trim();
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
      const [sortKeysEl, sortValuesEl] = cols
      const sortKeys = Array.from(sortKeysEl.querySelectorAll('li'), (li) => li.innerText.trim().toLowerCase());
      const sortValues = Array.from(sortValuesEl.querySelectorAll('li'), (li) => li.innerText.trim());

      const sortData = {
        items: sortKeys.map((sortKey, sortIndex) => ({
          key: sortKey.endsWith('_default') ? sortKey.slice(0, -8) : sortKey,
          value: sortValues[sortIndex]
        })),
        default: sortKeys.find(key => key.endsWith('_default')).slice(0, -8) || sortKeys[0]
      };

      blockData.sort = sortData;
    }
  }

  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    const cols = Array.from(row.children);
    const rowTitle = cols[0].innerText.trim().toLowerCase();
    const colsContent = cols.slice(1);
    if (blockDataActions[rowTitle]) blockDataActions[rowTitle](colsContent);
  })

  const deps = await Promise.all([
    declareKnowledgeBaseOverview(),
    localizationPromises(),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/picker.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/chevron.js`),
  ]);

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
