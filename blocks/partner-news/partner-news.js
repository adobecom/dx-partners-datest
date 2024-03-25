import { getLibs } from '../../scripts/utils.js';
import { partnerNewsStyles, newsCardStyles } from './partner-news-styles.js';

function formatDate(cardDate) {
  if (!cardDate) return;

  const dateObject = new Date(cardDate);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const formattedDate = dateObject.toLocaleString('en-US', options);
  return formattedDate;
}

async function declareSwcPartnerNews() {
  if (customElements.get('partner-news')) return;

  const miloLibs = getLibs();
  const { html, LitElement, css, repeat } = await import (`${miloLibs}/deps/lit-all.min.js`);

  class NewsCard extends LitElement {
    static properties = {
      data: { type: Object }
    };

    static styles = newsCardStyles;

    render() {
      return html`
      <div class="news-card">
        <div class="card-header" style="background-image: url('${this.data.styles?.backgroundImage}')" alt="${this.data.styles?.backgroundAltText}"></div>
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title}</p>
            <p class="card-description">${this.data.contentArea?.description}</p>
          </div>
          <div class="card-footer">
            <span class="card-date">${formatDate(this.data.cardDate)}</span>
            <a class="card-btn" href="${this.data.contentArea?.url}">${this.data.footer[0]?.right[0]?.text}</a>
          </div>
        </div>
      </div>
    `;
    }
  }
  customElements.define('news-card', NewsCard);

  class PartnerNews extends LitElement {
    static styles = css`
      ${partnerNewsStyles}
      #search {
        width: 100%;
      }
      #sort {
        padding: 2px 2px 3px;
      }
  `;

    static properties = {
      blockData: { type: Object },
      cards: { type: Array },
      paginatedCards: { type: Array },
      searchTerm: { type: String },
      totalPages: { type: Number },
      selectedPageNum: { type: Number },
      selectedSortOrder: { type: String, attribute: 'data-sort', reflect: true },
      selectedFilters: { type: Array },
      desktopView: { type: Boolean }
    };

    constructor() {
      super();
      this.apiData = {};  //do we need this?
      this.allCards = [];
      this.cards = [];
      this.paginatedCards = [];
      this.searchTerm = '';
      this.totalPages = 0;
      this.selectedPageNum = 1;
      this.cardsPerPage = 3;
      this.selectedSortOrder = '';
      this.selectedFilters = [];
      this.desktopView = window.innerWidth > 1200;
      window.addEventListener('resize', this.updateView.bind(this));
    }

    updateView() {
      this.desktopView = window.innerWidth > 1200;
    }

    async firstUpdated() {
      await super.firstUpdated();
      await this.fetchData();
      this.selectedSortOrder = this.blockData.sort.selected;
    }

    async fetchData() {
      try {
        const response = await fetch('https://14257-chimera-sunier.adobeioruntime.net/api/v1/web/chimera-0.0.1/collection?originSelection=&contentTypeTags=caas:content-type/article&secondSource=&secondaryTags=&collectionTags=caas:audience/enterprise&excludeContentWithTags=&language=en&country=us&complexQuery=&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=1000&flatFile=false&expanded=true');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.apiData = await response.json();
        if (this.apiData?.cards) {
          this.allCards = this.cards = this.apiData.cards;
          this.paginatedCards = this.cards.slice(0, this.cardsPerPage);
        }
      } catch (error) {
        console.log('err', error);
      }
    }

    updated(changedProperties) {
      if (changedProperties.has('searchTerm')
        || changedProperties.has('selectedPageNum')
        || changedProperties.has('selectedSortOrder')
        || changedProperties.has('selectedFilters')) {
        if (!changedProperties.has('selectedPageNum')) this.selectedPageNum = 1;
        this.handleActions();
      }
    }

    get newsCards() {
      if (this.paginatedCards.length) {
        return html`${repeat(
          this.paginatedCards,
          (card) => card.contentArea?.title,
          (card) => html`<news-card class="news-card-wrapper" .data=${card}></news-card>`,
        )}`;
      } else {
        return html`<div class="no-results">
          <strong class="no-results-title">No Results Found</strong>
          <p class="no-results-description">Try checking your spelling or broadening your search.</p>
        </div>`
      }
    }

    get sortItems() {
      if (!this.blockData.sort.items.length) return;

      return html`${repeat(
        this.blockData.sort.items,
        (item) => item.key,
        (item) => html`<sp-menu-item
          value="${item.key}">
          ${item.value}
        </sp-menu-item>`,
      )}`;
    }

    get pagination() {
      if (!this.cards.length) return;

      const min = 1;
      this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

      const pagesNumArray = Array.from({ length: this.totalPages }, (_, i) => i + min);
      return html`${repeat(
        pagesNumArray,
        (pageNum) => pageNum,
        (pageNum) => html`<button
          class="page-btn ${this.selectedPageNum === pageNum ? 'selected' : ''}"
          @click="${() => this.handlePageNum(pageNum)}">
          ${pageNum}
        </button>`
      )}`;
    }

    get filters() {
      if (!this.blockData.filters.length) return;

      return html`${repeat(
        this.blockData.filters,
        (filter) => filter.key,
        (filter) => {
          return html`
          <div class="filter">
            <button class="filter-header" @click=${(e) => this.expandFilter(e.currentTarget.parentNode)}>
              <span class="label">${filter.value}</span>
              <i class="chevron-icon">
                <sp-icon-chevron-down />
              </i>
            </button>
            <button class="selected-tags-count-btn ${this.countSelectedTags(filter.key) ? '' : 'hidden'}" @click="${(e) => this.handleResetTags(filter.key)}">
              <span class="total-num">${this.countSelectedTags(filter.key)}</span>
            </button>
            <ul class="filter-list">
              <sp-theme theme="spectrum" color="light" scale="medium">
                ${this.getTagsByFilter(filter.tags)}
              </sp-theme>
            </ul>
          </div>`
        }
      )}`;
    }

    openFiltersMobile() {

    }

    get filtersMobile() {
      if (!this.blockData.filters.length) return;

      return html`${repeat(
        this.blockData.filters,
        (filter) => filter.key,
        (filter) => {
          return html`
            <button class="filter-mobile-btn" @click=${(e) => this.expandFilter(e.currentTarget.parentNode)}>
              <div class="filter-mobile-btn-text">
                <h3 class="label">${filter.value}</h3>
                <div>Selected filters</div>
              </div>
              <div class="filter-mobile-btn-icons">
                <span>30</span>
                <i class="chevron-icon"><sp-icon-chevron-down /></i>
              </div>
          </div>`
        }
      )}`;
    }

    get chosenFilters() {
      if (!this.selectedFilters.length) return;

      return html`${repeat(
        this.selectedFilters,
        (tag) => tag.key,
        (tag) => {
          return html`
            <button class="chosen-filter-btn" @click="${(e) => this.handleRemoveTag(tag)}">
              ${tag.value}
            </button>
          `
        }
      )}`
    }

    getTagsByFilter(tags) {
      return html`${repeat(
        tags,
        (tag) => tag.key,
        (tag) => html`<li><sp-checkbox 
          size="m" emphasized
          ?checked=${tag.checked}
          @change=${(event) => this.handleTag(event, tag)}
        >
          ${tag.value}
        </sp-checkbox></li>`,
      )}`;
    }

    expandFilter(clickedFilter) {
      clickedFilter.classList.toggle('expanded');
    }

    handleActions() {
      //searching
      this.cards = this.allCards.filter((card) =>
        formatDate(card.cardDate).toLowerCase().includes(this.searchTerm) ||
        card.contentArea?.title.toLowerCase().includes(this.searchTerm) ||
        card.contentArea?.description.toLowerCase().includes(this.searchTerm)
      );

      //sorting
      const sortFunctions = {
        'newest': (a, b) => new Date(b.cardDate) - new Date(a.cardDate),
        'oldest': (a, b) => new Date(a.cardDate) - new Date(b.cardDate),
        'a-z': (a, b) => a.contentArea.title.localeCompare(b.contentArea?.title),
        'z-a': (a, b) => b.contentArea.title.localeCompare(a.contentArea?.title)
      };
      this.cards.sort(sortFunctions[this.selectedSortOrder]);

      //filtering
      if (this.selectedFilters.length) {
        this.cards = this.cards.filter((card) =>
          this.selectedFilters.every((filter) =>
            card.arbitrary.some((arbitraryTag) => arbitraryTag.key === filter.parentKey && arbitraryTag.value === filter.key)
          )
        )
      }

      //pagination
      const startIndex = this.selectedPageNum === 1 ? 0 : (this.selectedPageNum - 1) * this.cardsPerPage;
      const endIndex = this.selectedPageNum * this.cardsPerPage;
      this.paginatedCards = this.cards.slice(startIndex, endIndex);
    }

    handleResetActions() {
      this.searchTerm = '';
      this.selectedSortOrder = this.blockData.sort.selected;
      this.selectedFilters = [];
      this.blockData.filters.forEach(filter => {
        filter.tags.forEach(tag => tag.checked = false);
      });
    }

    handleSearch(event){
      this.searchTerm = event.target.value.toLowerCase();
    }

    handleClearSearch() {
      this.searchTerm = '';
    }

    handleSort(event) {
      if (event.target.value !== this.selectedSortOrder) this.selectedSortOrder = event.target.value;
    }

    handleTag(event, tag) {
      const tagKey = tag.key;
      if (event.target.checked) {
        tag.checked = true;
        this.selectedFilters = [...this.selectedFilters, tag];
      } else {
        tag.checked = false;
        this.selectedFilters = this.selectedFilters.filter(selectedTag => tagKey !== selectedTag.key);
      }
    }

    handleRemoveTag(tag) {
      tag.checked = false;
      this.selectedFilters = this.selectedFilters.filter(selectedTag => tag.key !== selectedTag.key);
    }

    countSelectedTags(filterKey) {
      const tagsLength = this.selectedFilters.filter((filter) => filter.parentKey === filterKey);
      if (tagsLength.length) return tagsLength.length;
    }

    handleResetTags(filterKey) {
      this.selectedFilters = this.selectedFilters.filter(selectedTag => filterKey !== selectedTag.parentKey);
      this.blockData.filters.forEach(filter => {
        if (filter.key === filterKey) {
          filter.tags.forEach((tag) => tag.checked = false)
        }
      });
    }

    handlePageNum(pageNum) {
      if (this.selectedPageNum !== pageNum) this.selectedPageNum = pageNum;
    }

    handlePrevPage() {
      if ( this.selectedPageNum > 1 ) this.selectedPageNum--;
    }

    handleNextPage() {
      if (this.selectedPageNum < this.totalPages) this.selectedPageNum++;
    }

    render() {
      return html`
      <div class="partner-news">
        <div class="partner-news-sidebar-wrapper">
          <div class="partner-news-sidebar">
            <sp-theme class="search-wrapper" theme="spectrum" color="light" scale="medium">
              <sp-search id="search" size="m" value=${this.searchTerm} @input="${this.handleSearch}" @reset="${this.handleClearSearch}">
              </sp-search>
            </sp-theme>
            ${this.desktopView
              ? html`
                <div class="sidebar-header">
                  <h3 class="sidebar-title">Filter</h3>
                  <button class="clear-all-btn" @click="${this.handleResetActions}">Clear all</button>
                </div>
                <div class="chosen-filters-wrapper">
                  ${this.chosenFilters}
                </div>
                <div class="filters-wrapper">
                  ${this.filters}
                </div>
              `
              : ''
            }
          </div>
        </div>
        <div class="partner-news-content">
          <div class="partner-news-header">
            <div class="partner-news-title-wrapper">
              <h3 class="partner-news-title">${this.blockData.title}</h3>
              <span class="cards-results"><strong>${this.cards?.length}</strong> results</span>
            </div>
            <div class="partner-news-sort-wrapper">
              ${!this.desktopView
                ? html `
                  <button class="filters-btn-mobile" @click="${this.openFiltersMobile}">
                    <span class="filters-btn-mobile-icon"></span>
                    <span class="filters-btn-mobile-title">Filters</span>
                    <span class="filters-btn-mobile-total ${this.selectedFilters.length ? '' : 'hidden'}">${this.selectedFilters.length}</span>
                  </button>
                ` 
                : ''
              }
              <sp-theme theme="spectrum" color="light" scale="medium" class="picker-wrapper">
                <sp-picker id="sort" value=${this.selectedSortOrder} quiet placement="bottom-end" size="m" @change="${this.handleSort}">
                  ${this.sortItems}
                </sp-picker>
              </sp-theme>
            </div>
          </div>
          <div class="partner-news-collection">
            ${this.allCards.length
              ? this.newsCards
              : html`
                  <div class="progress-circle-wrapper">
                    <sp-theme theme="spectrum" color="light" scale="medium">
                      <sp-progress-circle label="Cards loading" indeterminate="" size="l" role="progressbar"></sp-progress-circle>
                    </sp-theme>
                  </div>
                `
        }
          </div>
          <div class="pagination-wrapper">
            <div class="pages-list">
              <button class="prev-btn ${this.selectedPageNum === 1 || !this.paginatedCards?.length ? 'disabled' : ''}" @click="${this.handlePrevPage}">Prev</button>
                  ${this.pagination}
              <button class="next-btn ${this.selectedPageNum === this.totalPages || !this.paginatedCards?.length ? 'disabled': ''}" @click="${this.handleNextPage}">Next</button>
            </div>
            <span class="total-results">1-${this.cardsPerPage} of ${this.cards?.length} results</span>
          </div>
        </div>
      </div>

      <div class="filters-wrapper-mobile-content">
        <div class="filters-mobile-header">
          <button class="back-btn"></button> 
          <span class="filters-mobile-header-title">Filter by</span>
        </div>
        <div class="filters-mobile-content">
          ${this.filtersMobile}
        </div>
        <div class="filters-mobile-footer">
          <span>${this.cards?.length} Results</span>
          <div class="filters-mobile-footer-buttons">
            <button class="clear-all-btn-mobile" @click="${this.handleResetActions}">Clear All</button>
            <sp-theme theme="spectrum" color="light" scale="medium">
              <sp-button>Apply</sp-button>
            </sp-theme>
          </div>
        </div>
      </div>
      
    `;
    }
  }
  customElements.define('partner-news', PartnerNews);
}

export default async function init(el) {
  performance.mark('partner-news:start');
  const miloLibs = getLibs();
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
    declareSwcPartnerNews(),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/picker.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/chevron.js`),
  ]);

  const app = document.createElement('partner-news');
  app.className = 'content partner-news-wrapper';
  app.blockData = blockData;
  el.replaceWith(app);

  await deps;
  performance.mark('partner-news:end');
  performance.measure('partner-news block', 'partner-news:start', 'partner-news:end');
  return app;
}
