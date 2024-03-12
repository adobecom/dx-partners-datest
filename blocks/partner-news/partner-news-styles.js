import {getLibs} from "../../scripts/utils.js";
const miloLibs = getLibs();
const { css } = await import (`${miloLibs}/deps/lit-all.min.js`);

const lightGrey = css`#e5e5e5`;
const darkGrey = css`#bcbcbc`;
const textColor = css`#2c2c2c`;

export var partnerNewsStyles = css`
  .partner-news-sidebar *:hover,
  .partner-news-content *:hover {
    transition: 0.3s ease;
  }
  
  .partner-news-sidebar {
    width: 240px;
    margin-right: 50px;
    display: flex;
    flex-direction: column;
  }
  
  .partner-news-sidebar .sidebar-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${lightGrey};
    padding-bottom: 5px;
    margin-bottom: 20px;
  }
  
  .partner-news-sidebar .sidebar-title {
    font-weight: 700;
  }
  
  .partner-news-sidebar .clear-all-btn {
    color: ${darkGrey};
    background-color: transparent;
    border: none;
  }
  
  .partner-news-sidebar .clear-all-btn:hover {
    cursor: pointer;
    color: ${textColor};
  }
  
  .partner-news-sidebar .filters-wrapper {
    padding-top: 20px;
  }
  
  .partner-news-sidebar .filter {
    border-top: 1px solid ${lightGrey};
    background-color: #fff;
  }
  
  .partner-news-sidebar .filter:last-child {
    border-bottom: 1px solid ${lightGrey};
  }
  
  .partner-news-sidebar .filter .filter-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .partner-news-sidebar .filter .filter-header:hover {
    background-color: ${lightGrey};
    cursor: pointer;
  }
  
  .partner-news-sidebar .filter .label {
    font-size: 1rem;
    font-weight: 700;
    padding: 10px 0 10px 5px;
  }
  
  .partner-news-sidebar .filter .chevron-icon {
    display: flex;
    width: 18px;
    height: auto;
    color: ${darkGrey};
    transition: transform 0.3s ease;
  }
  
  .partner-news-sidebar .filter.expanded .chevron-icon {
    transform: rotate(-180deg);
  }
  
  .partner-news-sidebar .filter .filter-list {
    margin: 0;
    max-height: 0;
    transition: max-height 0.5s ease-in-out;
    overflow: hidden;
    padding-left: 0;
    list-style-type: none;
  }
  
  .partner-news-sidebar .filter-list li > * {
     padding: 0 5px;
  }
  
  .partner-news-sidebar .filter-list li > *:hover {
    background-color: ${lightGrey};
  }
  
  .partner-news-sidebar .filter.expanded .filter-list {
    max-height: 200px;
    overflow: scroll;
  }
  
  .partner-news-content {
    width: calc(100% - 240px);
    display: flex;
    flex-direction: column;
  }
 
  .partner-news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 20px;
    min-height: 40px;
  }
  
  .partner-news-title {
    word-break: break-word;
    max-height: 2.75rem;
    line-height: 1.375rem;
    margin: 0 0 7px;
    font-size: 1.125rem;
    font-weight: 700;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
  
  .partner-news-sort-wrapper {
    display: flex;
  }
  
  .partner-news-sort-wrapper .cards-results {
    padding: 0 20px;
    border-right: 1px solid ${lightGrey};
    max-height: 3.9375rem;
    font-size: 0.875rem;
    line-height: 1.3125rem;
    font-weight: 400;
    margin-right: 20px;
    flex: auto;
  }
 
  .partner-news-collection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(225px,1fr));
    grid-gap: 32px;
    padding-bottom: 32px;
    margin-bottom: 15px;
  }
  
  .partner-news-collection .no-results {
    padding-top: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  
  .partner-news-collection .no-results .empty-file {
    height: auto;
    width: 150px;
    margin-bottom: 15px;
  }
  
  .progress-circle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }
  
  .pagination-wrapper .pages-list button {
    border: none;
    background-color: transparent;
  }
  
  .pagination-wrapper .page-btn {
    padding: 6px 10px;
    text-align: center;
  }
  
  .pagination-wrapper .prev-btn {
    padding-right: 10px;
  }
  
  .pagination-wrapper .next-btn {
    padding-left: 10px;
  }
  
  .pagination-wrapper .prev-btn:hover,
  .pagination-wrapper .next-btn:hover,
  .pagination-wrapper .page-btn:hover {
    cursor: pointer;
    text-decoration: underline;
    transition: all .3s;
  }
  
  .pagination-wrapper .prev-btn.disabled,
  .pagination-wrapper .prev-btn.disabled:hover,
  .pagination-wrapper .next-btn.disabled,
  .pagination-wrapper .next-btn.disabled:hover,
  .pagination-wrapper .page-btn.selected:hover {
    text-decoration: none;
    cursor: default;
  }
  
  .pagination-wrapper .prev-btn.disabled,
  .pagination-wrapper .next-btn.disabled {
    color: ${darkGrey};
  }
  
  .pagination-wrapper .page-btn.selected {
    background-color: ${lightGrey};
    border-radius: 50%;
  }
`;


