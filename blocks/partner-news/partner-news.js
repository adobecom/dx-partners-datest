import { getLibs, replaceText } from '../../scripts/utils.js';
import { PartnerNews } from './../../deps/PartnerNews.js';

export async function declarePartnerNews() {
  if (customElements.get('partner-news')) return;
  customElements.define('partner-news', PartnerNews);
}

export default async function init(el) {
  performance.mark('partner-news:start');

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
    },
  };

  let localizedText = {
    '{{apply}}': '',
    '{{back}}': '',
    '{{clear-all}}': '',
    '{{filter}}': '',
    '{{filter-by}}': '',
    '{{filters}}': '',
    '{{no-results-title}}': '',
    '{{no-results-description}}': '',
    '{{of}}': '',
    '{{results}}': '',
    '{{search}}': '',
    '{{current-month}}': '',
    '{{date}}': '',
    '{{last-90-day}}': '',
    '{{load-more}}': '',
    '{{previous-month}}': '',
    '{{show-all}}': ''
  };

  const localizationPromises = Object.keys(localizedText).map(async (key) => {
    localizedText[key] = await replaceText(key, config);
  });

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
    declarePartnerNews(),
    localizationPromises,
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/picker.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/chevron.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/checkmark.js`),
  ]);

  const dateFilter = {
    key: 'date',
    value: localizedText['{{date}}'],
    tags: [
      { key: 'show-all', value: localizedText['{{show-all}}'], parentKey: 'date', checked: true, default: true },
      { key: 'current-month', value: localizedText['{{current-month}}'], parentKey: 'date', checked: false },
      { key: 'previous-month', value: localizedText['{{previous-month}}'], parentKey: 'date', checked: false },
      { key: 'last-90-day', value: localizedText['{{last-90-day}}'], parentKey: 'date', checked: false },
    ]
  };

  blockData.dateFilter = dateFilter;
  blockData.localizedText = localizedText;

  const app = document.createElement('partner-news');
  app.className = 'content partner-cards-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);

  await deps;
  performance.mark('partner-news:end');
  performance.measure('partner-news block', 'partner-news:start', 'partner-news:end');
  return app;
}
