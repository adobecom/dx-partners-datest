import { getLibs } from '../../scripts/utils.js';
const miloLibs = getLibs();
const { html, css, repeat } = await import (`${miloLibs}/deps/lit-all.min.js`);
import { numericPaginationStyles } from "./PartnerCardsStyles.js";
import { PartnerCards } from "./PartnerCards.js";

export class KnowledgeBaseOverview extends PartnerCards {

  static properties = {
    ...PartnerCards.properties,
    totalPages: { type: Number },
  };

  constructor() {
    super();
    this.totalPages = 0;
  }

  static styles = [
    PartnerCards.styles,
    css`${numericPaginationStyles}`
  ];

  get paginationList() {
    if (!this.cards.length) return;

    const min = 1;
    this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

    const pagesNumArray = Array.from({ length: this.totalPages }, (_, i) => i + min);
    return html`${repeat(
      pagesNumArray,
      (pageNum) => pageNum,
      (pageNum) => html`<button
        class="page-btn ${this.paginationCounter === pageNum ? 'selected' : ''}"
        @click="${() => this.handlePageNum(pageNum)}">
        ${pageNum}
      </button>`
    )}`;
  }

  get pagination() {
    return html `
      <div class="pagination-pages-list">
        <button class="pagination-prev-btn ${this.paginationCounter === 1 || !this.paginatedCards?.length ? 'disabled' : ''}" @click="${this.handlePrevPage}">${this.blockData.localizedText['{{prev}}']}</button>
        ${this.paginationList}
        <button class="pagination-next-btn ${this.paginationCounter === this.totalPages || !this.paginatedCards?.length ? 'disabled': ''}" @click="${this.handleNextPage}">${this.blockData.localizedText['{{next}}']}</button>
      </div>
    `;
  }

  handleActions() {
    super.handleActions();
    this.updatePaginatedCards();
  }

  updatePaginatedCards() {
    const startIndex = this.paginationCounter === 1 ? 0 : (this.paginationCounter - 1) * this.cardsPerPage;
    const endIndex = this.paginationCounter * this.cardsPerPage;
    this.paginatedCards = this.cards.slice(startIndex, endIndex);
  }

  handlePageNum(pageNum) {
    if (this.paginationCounter !== pageNum) this.paginationCounter = pageNum;
  }

  handlePrevPage() {
    if ( this.paginationCounter > 1 ) this.paginationCounter--;
  }

  handleNextPage() {
    if (this.paginationCounter < this.totalPages) this.paginationCounter++;
  }
}
