import { getLibs } from '../../scripts/utils.js';
import { NewsCard, PartnerCards } from './../../deps/PartnerCardsClass.js';

export async function declarePartnerCards() {
  if (customElements.get('partner-cards') || customElements.get('news-card')) return;

  customElements.define('partner-cards', PartnerCards);
  customElements.define('news-card', NewsCard);
}

export default async function init(el) {
  performance.mark('partner-cards:start');
  const miloLibs = getLibs();
  const sectionIndex = el.parentNode.getAttribute('data-idx');

  let blockData = {
    'title': '',
    'filters': [],
    'sort': {
      'selected': '',
      items: []
    }
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
        selected: sortKeys.find(key => key.endsWith('_default')).slice(0, -8) || sortKeys[0]
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
    declarePartnerCards(),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/picker.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/chevron.js`),
  ]);

  const app = document.createElement('partner-cards');
  app.className = 'content partner-cards-wrapper';
  app.blockData = blockData;
  app.setAttribute('data-idx', sectionIndex);
  el.replaceWith(app);

  await deps;
  performance.mark('partner-cards:end');
  performance.measure('partner-cards block', 'partner-cards:start', 'partner-cards:end');
  return app;
}
