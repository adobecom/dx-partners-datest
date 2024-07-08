import { getLibs } from '../../scripts/utils.js';
import { loadMorePaginationStyles } from '../../components/PartnerCardsStyles.js';
import PartnerCardsWithDateFilter from '../../components/PartnerCardsWithDateFilter.js';

const miloLibs = getLibs();
const { html, css } = await import(`${miloLibs}/deps/lit-all.min.js`);

export default class PartnerNews extends PartnerCardsWithDateFilter {
  static styles = [
    PartnerCardsWithDateFilter.styles,
    css`${loadMorePaginationStyles}`,
  ];

  get pagination() {
    if (this.cards.length === this.paginatedCards.length) {
      return '';
    }
    return html`<button class="load-more-btn" @click="${this.handleLoadMore}" aria-label="${this.blockData.localizedText['{{load-more}}']}">${this.blockData.localizedText['{{load-more}}']}</button>`;
  }

  handleActions() {
    super.handleActions();
    this.updatePaginatedCards();
  }

  updatePaginatedCards() {
    const countPages = this.paginationCounter * this.cardsPerPage;
    this.paginatedCards = this.cards.slice(0, countPages);
  }

  handleLoadMore() {
    this.paginationCounter += 1;
    this.handleActions();
  }
}
