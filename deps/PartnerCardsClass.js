import { getLibs } from '../../scripts/utils.js';
import { partnerCardsStyles, newsCardStyles } from './PartnerCardsStyles.js';
const miloLibs = getLibs();
const { html, LitElement, css, repeat } = await import (`${miloLibs}/deps/lit-all.min.js`);

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

export class NewsCard extends LitElement {
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

export class PartnerCards extends LitElement {
  static styles = css`
    ${partnerCardsStyles}
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
    selectedFilters: { type: Object },
    urlSearchParams: { type: Object },
    mobileView: { type: Boolean }
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
    this.cardsPerPage = 6;
    this.selectedSortOrder = '';
    this.selectedFilters = {};
    this.urlSearchParams = {};
    this.mobileView = window.innerWidth <= 1200;
    window.addEventListener('resize', this.updateView.bind(this));
  }

  updateView() {
    this.mobileView = window.innerWidth <= 1200;
  }

  async firstUpdated() {
    await super.firstUpdated();
    await this.fetchData();
    this.selectedSortOrder = this.blockData.sort.selected;
    if (this.blockData.filters.length) await this.initUrlSearchParams();
  }

  async fetchData() {
    try {
      const response = await fetch('https://14257-chimera-stage.adobeioruntime.net/api/v1/web/chimera-0.0.1/collection?originSelection=dx-partners&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=US&complexQuery=&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=5&debug=true&flatFile=false&expanded=true');
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

  async initUrlSearchParams () {
    const { search } = location || window.location;

    this.urlSearchParams = search
      ? search.substring(1).split('&').reduce((acc, el) => {
        const [key, value] = el.split('=');
        acc[key] = value.split(',');
        return acc;
      }, {})
      : {};

    if (this.urlSearchParams.filters) {
      this.blockData.filters = this.blockData.filters.map(filter => {
        if (this.urlSearchParams[filter.key]) {
          this.urlSearchParams[filter.key].forEach(searchTag => {
            const filterTag = filter.tags.find(tag => tag.key === searchTag);
            if (filterTag) {
              filterTag.checked = true;
              this.selectedFilters[filter.key] = [...(this.selectedFilters[filter.key] || []), filterTag];
            }
          })
        }
        return filter;
      })
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

  get partnerCards() {
    if (this.paginatedCards.length) {
      return html`${repeat(
        this.paginatedCards,
        (card) => card.contentArea?.title,
        (card) => html`<news-card class="card-wrapper" .data=${card}></news-card>`,
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
        const selectedTagsData = this.countSelectedTags(filter.key);
        const tagsCount = selectedTagsData.tagsCount;

        return html`
          <div class="filter">
            <button class="filter-header" @click=${(e) => this.expandFilter(e.currentTarget.parentNode)}>
              <span class="filter-label">${filter.value}</span>
              <sp-icon-chevron-down class="filter-chevron-icon" />
            </button>
            <button class="filter-selected-tags-count-btn ${tagsCount ? '' : 'hidden'}" @click="${(e) => this.handleResetTags(filter.key)}">
              <span class="filter-selected-tags-total-num">${tagsCount}</span>
            </button>
            <ul class="filter-list">
              <sp-theme theme="spectrum" color="light" scale="medium">
                ${this.getTagsByFilter(filter)}
              </sp-theme>
            </ul>
          </div>`
      }
    )}`;
  }

  get filtersMobile() {
    if (!this.blockData.filters.length) return;

    return html`${repeat(
      this.blockData.filters,
      (filter) => filter.key,
      (filter) => {
        const selectedTagsData = this.countSelectedTags(filter.key);
        const tagsString = selectedTagsData.tagsString;
        const tagsCount = selectedTagsData.tagsCount;

        return html`
          <div class="filter-wrapper-mobile">
            <div class="filter-mobile">
              <button class="filter-header-mobile" @click=${(e) => this.expandFilter(e.target.closest('.filter-wrapper-mobile'))}>
                <div class="filter-header-content-mobile">
                  <h3 class="filter-header-name-mobile">${filter.value}</h3>
                  ${tagsCount
                    ? html `
                      <div class="filter-header-selected-tags-mobile">
                        <span class="filter-header-selected-tags-text-mobile">${tagsString}</span>
                        <span class="filter-header-selected-tags-count-mobile">+ ${tagsCount}</span>
                      </div>
                    `
                    : ''
                  }
                </div>
                <sp-icon-chevron-down class="filter-header-chevron-icon" />
              </button>
              <ul class="filter-tags-mobile">
                <sp-theme theme="spectrum" color="light" scale="medium">
                  ${this.getTagsByFilter(filter)}
                </sp-theme>
              </ul>
              <div class="filter-footer-mobile-wrapper">
                <div class="filter-footer-mobile">
                  <span class="filter-footer-results-mobile">${this.cards?.length} Results</span>
                  <div class="filter-footer-buttons-mobile">
                    <button class="filter-footer-clear-btn-mobile" @click="${(e) => this.handleResetTags(filter.key)}">Clear All</button>
                    <sp-theme theme="spectrum" color="light" scale="medium">
                      <sp-button @click=${(e) => this.expandFilter(e.target.closest('.filter-wrapper-mobile'))}>Apply</sp-button>
                    </sp-theme>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      }
    )}`;
  }

  get chosenFilters() {
    const extractedTags = Object.values(this.selectedFilters).flatMap(tagsArray => tagsArray);
    if (!extractedTags.length) return;

    const htmlContent = html`${repeat(
      extractedTags.sort((a, b) => a.value.localeCompare(b.value)),
      (tag) => tag.key,
      (tag) => html`
        <button class="sidebar-chosen-filter-btn" @click="${(e) => this.handleRemoveTag(tag)}">
          ${tag.value}
        </button>`
    )}`;

    return { htmlContent, tagsCount: extractedTags.length };
  }

  getTagsByFilter(filter) {
    const tags = filter.tags;

    return html`${repeat(
      tags,
      (tag) => tag.key,
      (tag) => html`<li><sp-checkbox
        size="m" emphasized
        ?checked=${tag.checked}
        @change=${(event) => this.handleTag(event, tag, filter.key)}
      >
        ${tag.value}
      </sp-checkbox></li>`,
    )}`;
  }

  openFiltersMobile() {
    const element = this.shadowRoot.querySelector('.all-filters-wrapper-mobile');
    element.classList.add('open');
  }

  closeFiltersMobile() {
    const element = this.shadowRoot.querySelector('.all-filters-wrapper-mobile');
    element.classList.remove('open');
  }

  expandFilter(clickedFilter) {
    clickedFilter.classList.toggle('expanded');
  }

  handleActions() {
    //searching
    this.cards = this.allCards.filter((card) =>
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
    if (this.blockData.filters.length) {
      const selectedFiltersKeys = Object.keys(this.selectedFilters);
      if (selectedFiltersKeys.length) {
        this.cards = this.cards.filter((card) =>
          selectedFiltersKeys.every((key) =>
            card.arbitrary.some((arbitraryTag) => {
              if (key === arbitraryTag.key) {
                return this.selectedFilters[key].some((selectedTag) => selectedTag.key === arbitraryTag.value);
              }
              return false;
            })
          )
        );
      } else {
        const { ['filters']: _removedFilterKey, ...updatedSearchParams } = this.urlSearchParams;
        this.urlSearchParams = updatedSearchParams;
      }

      //urlSearchParams
      const searchParamsEntries = Object.entries(this.urlSearchParams);
      if (searchParamsEntries.length) {
        const searchString = searchParamsEntries.map(([key, value]) =>
          `${key}=${value.join(',')}`
        ).join('&');

        const url = new URL(window.location.href);
        url.search = `?${searchString}`;
        window.history.pushState({}, '', url);
      }
    }

    //pagination
    const startIndex = this.selectedPageNum === 1 ? 0 : (this.selectedPageNum - 1) * this.cardsPerPage;
    const endIndex = this.selectedPageNum * this.cardsPerPage;
    this.paginatedCards = this.cards.slice(startIndex, endIndex);
  }

  handleResetActions() {
    this.searchTerm = '';
    this.selectedFilters = {};
    this.blockData.filters.forEach(filter => {
      filter.tags.forEach(tag => tag.checked = false);

      const { [filter.key]: _removedKeyParams, ...updatedUrlSearchParams  } = this.urlSearchParams
      this.urlSearchParams = updatedUrlSearchParams;
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

  handleTag(event, tag, filterKey) {
    if (!event.target.checked) {
      this.handleRemoveTag(tag);
      return;
    }

    tag.checked = true;

    if (this.selectedFilters[filterKey]) {
      this.selectedFilters = {
        ...this.selectedFilters,
        [filterKey]: [...this.selectedFilters[filterKey], tag]
      };
      this.urlSearchParams = {
        ...this.urlSearchParams,
        [filterKey]: [...this.urlSearchParams[filterKey], tag.key]
      }
    } else {
      this.selectedFilters = {
        ...this.selectedFilters,
        [filterKey]: [tag]
      };
      this.urlSearchParams = {
        ...this.urlSearchParams,
        'filters': ['yes'],
        [filterKey]: [tag.key]
      };
    }
  }

  handleRemoveTag(tag) {
    tag.checked = false;
    const { key: tagKey, parentKey: filterKey } = tag;

    const updatedFilterTags = [...this.selectedFilters[filterKey]].filter(filterTag => filterTag.key !== tagKey);
    const updatedSearchFilterTags = [...this.urlSearchParams[filterKey]].filter(filterTag => filterTag !== tagKey);

    if (updatedFilterTags.length && updatedSearchFilterTags.length) {
      this.selectedFilters = {
        ...this.selectedFilters,
        [filterKey]: updatedFilterTags
      };

      this.urlSearchParams = {
        ...this.urlSearchParams,
        [filterKey]: updatedSearchFilterTags
      };
    } else {
      const { [filterKey]: _removedKeyFilters, ...updatedSelectedFilters } = this.selectedFilters;
      this.selectedFilters = updatedSelectedFilters;

      const { [filterKey]: _removedKeyParams,  ...updatedUrlSearchParams } = this.urlSearchParams;
      this.urlSearchParams = updatedUrlSearchParams;
    }
  }

  handleResetTags(filterKey) {
    const { [filterKey]: _removedKeyFilters, ...updatedSelectedFilters } = this.selectedFilters;
    this.selectedFilters = {...updatedSelectedFilters};

    const { [filterKey]: _removedKeyParams, ...updatedUrlSearchParams } = this.urlSearchParams;
    this.urlSearchParams = updatedUrlSearchParams;

    this.blockData.filters.forEach(filter => {
      if (filter.key === filterKey) {
        filter.tags.forEach((tag) => tag.checked = false)
      }
    });
  }

  countSelectedTags(filterKey) {
    if (!this.selectedFilters[filterKey]) {
      return {
        'tagsString': '',
        'tagsCount': 0
      };
    }

    const tags = [...this.selectedFilters[filterKey]].map(tag => tag.value);
    return {
      'tagsString': tags.join(', '),
      'tagsCount': tags.length
    };
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
      <div class="partner-cards">
        <div class="partner-cards-sidebar-wrapper">
          <div class="partner-cards-sidebar">
            <sp-theme class="search-wrapper" theme="spectrum" color="light" scale="medium">
              <sp-search id="search" size="m" value=${this.searchTerm} @input="${this.handleSearch}" @reset="${this.handleClearSearch}">
              </sp-search>
            </sp-theme>
            ${!this.mobileView
              ? html`
                <div class="sidebar-header">
                  <h3 class="sidebar-title">Filter</h3>
                  <button class="sidebar-clear-btn" @click="${this.handleResetActions}">Clear all</button>
                </div>
                <div class="sidebar-chosen-filters-wrapper">
                  ${this.chosenFilters && this.chosenFilters.htmlContent}
                </div>
                <div class="sidebar-filters-wrapper">
                  ${this.filters}
                </div>
              `
              : ''
            }
          </div>
        </div>
        <div class="partner-cards-content">
          <div class="partner-cards-header">
            <div class="partner-cards-title-wrapper">
              <h3 class="partner-cards-title">${this.blockData.title}</h3>
              <span class="partner-cards-cards-results"><strong>${this.cards?.length}</strong> results</span>
            </div>
            <div class="partner-cards-sort-wrapper">
              ${this.mobileView
                ? html `
                  <button class="filters-btn-mobile" @click="${this.openFiltersMobile}">
                    <span class="filters-btn-mobile-icon"></span>
                    <span class="filters-btn-mobile-title">Filters</span>
                    ${this.chosenFilters
                      ? html `
                        <span class="filters-btn-mobile-total">${this.chosenFilters.tagsCount}</span>
                      `
                      : ''
                    }
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
          <div class="partner-cards-collection">
            ${this.allCards.length
              ? this.partnerCards
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
            <div class="pagination-pages-list">
              <button class="pagination-prev-btn ${this.selectedPageNum === 1 || !this.paginatedCards?.length ? 'disabled' : ''}" @click="${this.handlePrevPage}">Prev</button>
              ${this.pagination}
              <button class="pagination-next-btn ${this.selectedPageNum === this.totalPages || !this.paginatedCards?.length ? 'disabled': ''}" @click="${this.handleNextPage}">Next</button>
            </div>
            <span class="pagination-total-results">1-${Math.min(this.cards?.length ?? 0, this.cardsPerPage) } of ${this.cards?.length} results</span>
          </div>
        </div>
      </div>

      ${this.mobileView
        ? html `
          <div class="all-filters-wrapper-mobile">
            <div class="all-filters-header-mobile">
              <button class="all-filters-header-back-btn-mobile" @click="${this.closeFiltersMobile}"></button>
              <span class="all-filters-header-title-mobile">Filter by</span>
            </div>
            <div class="all-filters-list-mobile">
              ${this.filtersMobile}
            </div>
            <div class="all-filters-footer-mobile">
              <span class="all-filters-footer-results-mobile">${this.cards?.length} Results</span>
              <div class="all-filters-footer-buttons-mobile">
                <button class="all-filters-footer-clear-btn-mobile" @click="${this.handleResetActions}">Clear All</button>
                <sp-theme theme="spectrum" color="light" scale="medium">
                  <sp-button @click="${this.closeFiltersMobile}">Apply</sp-button>
                </sp-theme>
              </div>
            </div>
          </div>
        `
        : ''
      }
    `;
  }
}
