import { getLibs, createTag } from '../../scripts/utils.js';
import { partnerNewsStyles } from './partner-news-styles.js';
import { newsCardStyles } from './news-card-styles.js';

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

async function declareSwcPartnerNews(data) {
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
        <div class="card-header" style="background-image: url('${this.data.styles?.backgroundImage}')"></div>
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">${this.data.contentArea?.title}</p>
            <p class="card-description">${this.data.contentArea?.description}</p>
          </div>
          <div class="card-footer">
            <span class="card-date">${formatDate(this.data.cardDate)}</span>
            <a class="card-btn" href="${this.data.contentArea?.url}">Read more</a>
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
        margin-top: 3px;
      }
  `;

    static properties = {
      cards: { type: Array },
      searchTerm: { type: String },
      selectedPageNum: { type: Number },
      selectedSortOrder: { type: String },
      selectedTags: { type: Array },
    };

    constructor() {
      super();
      this.data = {};
      this.allCards = [];
      this.cards = [];
      this.paginatedCards = [];
      this.allSortItems = [
        { id: 'newest', label: 'Date: newest' },
        { id: 'oldest', label: 'Date: oldest' },
        { id: 'alphabetical-asc', label: 'Title: A-Z' },
        { id: 'alphabetical-desc', label: 'Title: Z-A' },
      ];
      this.searchTerm = '';
      this.totalPages = 1;
      this.selectedPageNum = 1;
      this.cardsPerPage = 9;
      this.selectedSortOrder = 'newest';
      this.allFilters = [
        {
          id: 1,
          label: 'Filter 1',
          tags: [
            { id: '37mr/8rko', label: 'Filter 1.1' },
            { id: 'ehox/6e5u', label: 'Filter 1.2' },
            { id: 'ehox/gldv', label: 'Filter 1.3' }
          ]
        },
        {
          id: 2,
          label: 'Filter 2',
          tags: [
            { id: '21', label: 'Filter 2.1'},
            { id: '22', label: 'Filter 2.2'}
          ]
        },
      ];
      this.selectedTags = [];
    }

    async firstUpdated() {
      await super.firstUpdated();
      await this.fetchData();
      this.handleActions();
    }

    async fetchData() {
      try {
        const response = await fetch('https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/collection?originSelection=&contentTypeTags=caas%3Acontent-type%2Farticle&secondSource=&secondaryTags=&collectionTags=caas%3Aaudience%2Fenterprise&excludeContentWithTags=&language=en&country=us&complexQuery=&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=15&flatFile=false');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.data = await response.json();
        if (this.data?.cards) this.allCards = this.cards = this.paginatedCards = this.data.cards;
      } catch (error) {
        console.log('err', error);
      }
    }

    get newsCards() {
      if (this.paginatedCards.length) {
        return html`${repeat(
          this.paginatedCards,
          (card) => card.contentArea?.title,
          (card) => html`<news-card .data=${card}></news-card>`,
        )}`;
      } else {
        return html`<div class="no-results">
          <img class="empty-file" src="/img/icons/empty-file.svg" />
          There are no cards for the selected criteria.
        </div>`
      }
    }

    get sortItems() {
      if (!this.allSortItems.length) return; //delete if the value is hardcoded

      return html`${repeat(
        this.allSortItems,
        (item) => item.id,
        (item) => html`<sp-menu-item 
          value="${item.id}">
          ${item.label}
        </sp-menu-item>`,
      )}`;
    }

    get pagination() {
      if (!this.cards?.length) return;

      const min = 1;
      this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

      const pagesNumArray = Array.from({ length: this.totalPages - min + 1 }, (_, i) => i + min);
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
      if (!this.allFilters.length) return;

      return html`${repeat(
        this.allFilters,
        (filter) => filter.id,
        (filter) => {
          if (!filter.tags?.length) return;
            return html`
            <div class="filter">
              <div class="filter-header" @click=${(e) => this.expandFilter(e.currentTarget.parentNode)}>
                <span class="label">${filter.label}</span>
                <i class="chevron-icon">
                  <sp-icon-chevron-down />
                </i>
              </div>
              <ul class="filter-list">
                <sp-theme theme="spectrum" color="light" scale="medium">
                  ${this.getTagsByFilter(filter.tags)}
                </sp-theme>
              </ul>
            </div>`
        }
      )}`;
    }

    getTagsByFilter(tags) {
      return html`${repeat(
        tags,
        (tag) => tag.id,
        (tag) => html`<li><sp-checkbox 
          size="m" emphasized
          ?checked=${tag.checked}
          @change=${(event) => this.handleTag(event, tag)}
        >
          ${tag.label}
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
        'alphabetical-asc': (a, b) => a.contentArea.title.localeCompare(b.contentArea?.title),
        'alphabetical-desc': (a, b) => b.contentArea.title.localeCompare(a.contentArea?.title)
      };
      this.cards.sort(sortFunctions[this.selectedSortOrder]);

      //filtering
      if (this.selectedTags.length) {
        this.cards = this.cards.filter((card) =>
          this.selectedTags.every((tagId) =>
            card.tags.some((tag) => tag.id === tagId)
          )
        )
      }

      //pagination
      const startIndex = this.selectedPageNum === 1 ? 0 : (this.selectedPageNum - 1) * this.cardsPerPage;
      const endIndex = this.selectedPageNum * this.cardsPerPage;
      this.paginatedCards = this.cards.filter((card, index) => index + 1 > startIndex && index + 1 <= endIndex);
    }

    handleSearch(event){
      this.searchTerm = event.target.value.toLowerCase();
      this.selectedPageNum = 1;
      this.handleActions();
    }

    handleClearSearch() {
      this.searchTerm = '';
      this.handleActions();
    }

    handleSort(event) {
      this.selectedSortOrder = event.target.value;
      this.selectedPageNum = 1;
      this.handleActions();
    }

    handleTag(event, tag) {
      const tagId = tag.id;
      if (event.target.checked) {
        tag.checked = true;
        this.selectedTags = [...this.selectedTags, tagId];
      } else {
        tag.checked = false;
        this.selectedTags = this.selectedTags.filter(selectedTag => tagId !== selectedTag);
      }
      this.selectedPageNum = 1;
      this.handleActions();
    }

    handlePageNum(pageNum) {
      if (this.selectedPageNum !== pageNum) this.selectedPageNum = pageNum;
      this.handleActions();
    }

    handlePrevPage() {
      if ( this.selectedPageNum > 1 ) this.selectedPageNum--;
      this.handleActions();
    }

    handleNextPage() {
      if (this.selectedPageNum < this.totalPages) this.selectedPageNum++;
      this.handleActions();
    }

    handleResetFilters() {
      this.searchTerm = '';
      this.selectedSortOrder = 'newest';
      this.selectedTags = [];
      this.allFilters.forEach(filter => {
        filter.tags.forEach(tag => tag.checked = false);
      });

      this.handleActions();
    }

    render() {
      return html`
      <div class="partner-news-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">Filter</span>
          <button class="clear-all-btn" @click="${this.handleResetFilters}">Clear all</button>
        </div>
        <sp-theme theme="spectrum" color="light" scale="medium">
          <sp-search id="search" size="l" value=${this.searchTerm} @input="${this.handleSearch}" @reset="${this.handleClearSearch}">
          </sp-search>
        </sp-theme>
        <div class="filters-wrapper">
          ${this.filters}
        </div>
      </div>
      <div class="partner-news-content">
        <div class="partner-news-header">
          <p class="partner-news-title">${this.title}</p>
          <div class="partner-news-sort-wrapper">
            <span class="cards-results">${this.cards?.length} results</span>
            <sp-theme theme="spectrum" color="light" scale="medium" >
              <sp-picker id="sort" value=${this.selectedSortOrder} quiet size="m" @change="${this.handleSort}">
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
            <button
              class="prev-btn ${this.selectedPageNum === 1 || !this.paginatedCards?.length ? 'disabled' : ''}" @click="${this.handlePrevPage}">Prev</button>
                ${this.pagination}
            <button class="next-btn ${this.selectedPageNum === this.totalPages || !this.paginatedCards?.length ? 'disabled': ''}" @click="${this.handleNextPage}">Next</button>
          </div>
          <div class="results">1-${this.cardsPerPage} of ${this.cards?.length} results</div>
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
  let data = {
    'title': '',
  }

  const rows = Array.from(el.children);
  rows.forEach((row, rdx) => {
    const cols = Array.from(row.children);
    cols.forEach((col, cdx) => {
      if (col.innerHTML.toLowerCase() === 'title') {
        data.title = cols[cdx + 1].innerHTML;
      }
    })
  });

  const deps = await Promise.all([
    declareSwcPartnerNews(data),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/picker.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/icons/chevron.js`),
  ]);

  const app = createTag('partner-news', { class: 'partner-news', title: data.title});
  el.replaceWith(app);

  await deps;
  performance.mark('partner-news:end');
  performance.measure('partner-news block', 'partner-news:start', 'partner-news:end');
  return app;
}
