import { getLibs } from '../../scripts/utils.js';
const miloLibs = getLibs();
const { html, css, repeat } = await import (`${miloLibs}/deps/lit-all.min.js`);
import { dateFilterStyles, loadMorePaginationStyles } from "./PartnerCardsStyles.js";
import { PartnerCards } from "./PartnerCards.js";

export class PartnerNews extends PartnerCards {

  static styles = [
    PartnerCards.styles,
    css`${loadMorePaginationStyles}`,
    css`${dateFilterStyles}`
  ];

  static properties = {
    ...PartnerCards.properties,
    selectedDateFilter: { type: Object },
  };

  constructor() {
    super();
    this.selectedDateFilter = {};
  }

  async firstUpdated() {
    await super.firstUpdated();
    this.selectedDateFilter = this.blockData.dateFilter.tags[0];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('selectedDateFilter')) this.handleActions();
  }

  get pagination() {
    if (this.cards.length === this.paginatedCards.length) {
      return ''
    } else {
      return html `<button class="load-more-btn" @click="${this.handleLoadMore}">${this.blockData.localizedText['{{load-more}}']}</button>`
    }
  }

  get dateFilter() {
    const { dateFilter: filter } = this.blockData;

    return  html`
      <div class="filter">
        <button class="filter-header" @click=${(e) => this.expandFilter(e.currentTarget.parentNode)}>
          <span class="filter-label">${filter.value}</span>
          <sp-icon-chevron-down class="filter-chevron-icon" />
        </button>
        <button class="filter-selected-tags-count-btn ${this.selectedDateFilter.default || !Object.keys(this.selectedDateFilter).length ? 'hidden' : ''}" @click="${(e) => this.handleResetDateTags(filter.tags)}">
          <span class="filter-selected-tags-total-num">1</span>
        </button>
        <ul class="filter-list">
          <sp-theme theme="spectrum" color="light" scale="medium">
            ${this.getDateFilterTags(filter)}
          </sp-theme>
        </ul>
      </div>
    `;
  }

  get filters() {
    return html `
      ${this.dateFilter}
      ${super.filters}
    `
  }

  get dateFilterMobile() {
    const { dateFilter: filter } = this.blockData;

    return html`
      <div class="filter-wrapper-mobile">
        <div class="filter-mobile">
          <button class="filter-header-mobile" @click=${(e) => this.expandFilter(e.target.closest('.filter-wrapper-mobile'))}>
            <div class="filter-header-content-mobile">
              <h3 class="filter-header-name-mobile">${filter.value}</h3>
               ${this.selectedDateFilter.default
                ? ''
                : html `
                   <div class="filter-header-selected-tags-mobile">
                     <span class="filter-header-selected-tags-text-mobile">${this.selectedDateFilter.value}</span>
                     <span className="filter-header-selected-tags-count-mobile">+ 1</span>
                   </div>
                 `
                }
            </div>
            <sp-icon-chevron-down class="filter-header-chevron-icon" />
          </button>
          <ul class="filter-tags-mobile">
            <sp-theme theme="spectrum" color="light" scale="medium">
              ${this.getDateFilterTags(filter)}
            </sp-theme>
          </ul>
          <div class="filter-footer-mobile-wrapper">
            <div class="filter-footer-mobile">
              <span class="filter-footer-results-mobile">${this.cards?.length} Results</span>
              <div class="filter-footer-buttons-mobile">
                <button class="filter-footer-clear-btn-mobile" @click="${(e) => this.handleResetDateTags(filter.tags)}">${this.blockData.localizedText['{{clear-all}}']}</button>
                <sp-theme theme="spectrum" color="light" scale="medium">
                  <sp-button @click=${(e) => this.expandFilter(e.target.closest('.filter-wrapper-mobile'))}>${this.blockData.localizedText['{{apply}}']}</sp-button>
                </sp-theme>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  get filtersMobile() {
    return html `
      ${this.dateFilterMobile}
      ${super.filtersMobile}
    `
  }

  get chosenFilters() {
    const parentChosenFilters = super.chosenFilters;
    if (!parentChosenFilters && this.selectedDateFilter.default) return;

    let htmlContent = parentChosenFilters ? parentChosenFilters.htmlContent : '';
    let tagsCount = parentChosenFilters ? parentChosenFilters.tagsCount : 0;

    if (!this.selectedDateFilter.default && Object.keys(this.selectedDateFilter).length) {
      htmlContent = html `
        <button class="sidebar-chosen-filter-btn" @click="${(e) => this.handleResetDateTags(this.blockData.dateFilter.tags)}">
          ${this.selectedDateFilter.value}
        </button>
        ${htmlContent}
      `;
      tagsCount += 1;
    }

    return { htmlContent, tagsCount };
  }

  getDateFilterTags(filter) {
    if (filter.key !== 'date') return;

    const { tags } = filter;

    return html`${repeat(
      tags,
      (tag) => tag.key,
      (tag) => html`<li>
        <button class="date-filter-tag" @click="${() => this.handleDateTag(tags, tag)}">
          <span class="date-filter-tag-label">${tag.value}</span>
          ${tag.checked
        ? html `<sp-icon-checkmark300 class="date-filter-tag-checkmark" />`
        : ''
      }
        </button>
      </li>`,
    )}`;
  }

  handleActions() {
    super.handleActions();
    this.handleDateFilterAction();
    this.updatePaginatedCards();
  }

  handleResetActions() {
    super.handleResetActions();
    this.handleResetDateTags(this.blockData.dateFilter.tags);
  }

  updatePaginatedCards() {
    const countPages = this.paginationCounter * this.cardsPerPage;
    this.paginatedCards = this.cards.slice(0, countPages);
  }

  handleDateTag(tags, tag) {
    this.paginationCounter = 1;
    if (tag.checked) {
      this.handleResetDateTags(tags);
    } else {
      this.selectedDateFilter = tag;
      tags.forEach(filterTag => filterTag.checked = filterTag.key === tag.key);
    }
  }

  handleResetDateTags(tags) {
    this.paginationCounter = 1;

    tags.forEach((filterTag, index) => {
      if (index === 0) {
        filterTag.checked = true;
        this.selectedDateFilter = filterTag;
      } else {
        filterTag.checked = false;
      }
    });
  }

  handleDateFilterAction() {
    const { key } = this.selectedDateFilter;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (key === 'current-month') {
      this.cards = this.cards.filter(card => {
        const cardDate = new Date(card.cardDate);
        const cardMonth = cardDate.getMonth();
        const cardYear = cardDate.getFullYear();
        return cardMonth === currentMonth && cardYear === currentYear;
      })
    }
    else if (key === 'previous-month') {
      let previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      let yearOfPreviousMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
      this.cards = this.cards.filter(card => {
        const cardDate = new Date(card.cardDate);
        const cardMonth = cardDate.getMonth();
        const cardYear = cardDate.getFullYear();
        return cardMonth === previousMonth && cardYear === yearOfPreviousMonth;
      })
    }
    else if (key === 'last-90-days') {
      currentDate.setHours(0, 0, 0, 0);
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 90);
      this.cards = this.cards.filter(card => {
        const cardDate = new Date(card.cardDate);
        return cardDate >= startDate && cardDate <= currentDate;
      })
    } else {
      return;
    }
  }

  handleLoadMore() {
    this.paginationCounter += 1;
  }
}
