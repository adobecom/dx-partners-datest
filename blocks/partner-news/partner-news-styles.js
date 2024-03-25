import {getLibs} from "../../scripts/utils.js";
const miloLibs = getLibs();
const { css } = await import (`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;
const blueColor = css`#1473e6`;

export var partnerNewsStyles = css`
  h3, p, span, button, li, input {
    margin: 0;
    font-family: adobe-clean, Segoe UI, Roboto, sans-serif;
  }
  
  .partner-news * {
    box-sizing: border-box;
  }
  
  .partner-news {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 204px auto;
    gap: 32px;
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news {
      grid-template-columns: unset;
      display: grid;
      flex-direction: column;
      gap: 0;
    }
  }
  
  .partner-news-sidebar {
    display: flex;
    flex-direction: column;
    width: 204px;
    max-width: 204px;
    margin-right: 32px;
    padding: 8px 16px 16px;
    border-radius: 4px;
    overflow: visible;
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news-sidebar {
      width: 100%;
      max-width: 100%;
      padding: 0;
    }
  }
  
  .partner-news-sidebar .sidebar-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${borderColor};
    padding-bottom: 5px;
    margin-bottom: 20px;
    order: 1;
  }
  
  .partner-news-sidebar .sidebar-title {
    color: #323232;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.1875rem;
  }
  
  .partner-news-sidebar .clear-all-btn {
    color: #bcbcbc;
    font-size: .875rem;
    line-height: 1rem;
    font-weight: 700;
    background-color: transparent;
    border: none;
    transition: color .3s ease-in-out;
  }
  
  .partner-news-sidebar .clear-all-btn:hover {
    cursor: pointer;
    color: ${blueColor};
  }
  
  .partner-news-sidebar .search-wrapper {
    padding-bottom: 10px;
    order: 2;
  }
  
  .partner-news-sidebar .chosen-filters-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    order: 3;
  }
  
  .partner-news-sidebar .chosen-filters-wrapper .chosen-filter-btn {
    background-color: transparent;
    border: 2px solid transparent;
    border-radius: 4px;
    font-size: .75rem;
    line-height: 1.375rem;
    color: #747474;
    margin-right: 7px;
    margin-bottom: 5px;
    padding: 0 20px 0 8px;
    word-break: break-word;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    max-width: 100%;
  }
  
  .partner-news-sidebar .chosen-filters-wrapper .chosen-filter-btn:hover {
    cursor: pointer;
  }
  
  .partner-news-sidebar .chosen-filters-wrapper .chosen-filter-btn:focus {
    border-color: ${blueColor};
  }
  
  .partner-news-sidebar .chosen-filters-wrapper .chosen-filter-btn:after {
    padding-left: 3px;
    content: "\\00d7";
    font-size: .875rem;
    position: absolute;
    right: 7px;
    top: 0;
    width: 10px;
  }
  
  .partner-news-sidebar .filters-wrapper {
    padding-top: 10px;
    order: 4;
  }
  
  .partner-news-sidebar .filter {
    border-top: 1px solid ${borderColor};
    background-color: #fff;
    position: relative;
  }
  
  .partner-news-sidebar .filter:last-child {
    border-bottom: 1px solid ${borderColor};
  }
  
  .partner-news-sidebar .filter .filter-header {
    border: none;
    background-color: transparent;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #464646;
    transition: color .3s ease-in-out;
  }
  
  .partner-news-sidebar .filter .filter-header:hover {
    cursor: pointer;
    color: #707070;
  }
  
  .partner-news-sidebar .filter .label {
    font-size: .875rem;
    line-height: 1rem;
    font-weight: 700;
    padding: 14px 0;
  }
  
  .partner-news-sidebar .filter .chevron-icon {
    display: flex;
    width: 18px;
    height: auto;
    color: #bcbcbc;
  }
  
  .partner-news-sidebar .filter .selected-tags-count-btn {
    position: absolute;
    top: 10px;
    right: 25px;
    border: none;
    background-color: ${blueColor};
    border-radius: 15px;
    min-width: 24px;
    max-width: 100px;
    height: 24px;
    padding: 3px 5px 2px;
    color: #fff;
    font-weight: 700;
    transition: all .3s;
  }
  
  .partner-news-sidebar .filter .selected-tags-count-btn:focus {
    border: 2px solid #1492e6;
  }
  
  .partner-news-sidebar .filter .selected-tags-count-btn.hidden {
    display: none;
  }
  
  .partner-news-sidebar .filter .selected-tags-count-btn:hover .total-num {
    display: none;
  }
  
  .partner-news-sidebar .filter .selected-tags-count-btn:hover::after {
    content: "\\00d7";
    font-size: 1rem;
    cursor: pointer;
    margin-top: 2px;
  }
  
  .partner-news-sidebar .filter.expanded .chevron-icon {
    transform: rotate(-180deg);
  }
  
  .partner-news-sidebar .filter .filter-list {
    display: none;
    padding: 0;
    padding-bottom: 14px;
    margin: 0;
    list-style-type: none;
  }
  
  .partner-news-sidebar .filter.expanded .filter-list {
    display: block;
  }
  
  .partner-news-sidebar .filter-list li sp-checkbox {
    padding: 0 6px;
    font-size: .875rem;
    line-height: 1rem;
  }
  
  .partner-news-sidebar .filter-list li:hover {
    background-color: #2c2c2c0a;
  }
  
  .partner-news-content {
    display: block;
    position: relative;
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news-content {
      width: 100%;
    }
  }
 
  .partner-news-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 28px;
    min-height: 40px;
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news-header {
      flex-direction: column-reverse;
      padding-bottom: 16px;
    }
  }
  
  .partner-news-header .partner-news-title-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .partner-news-header .partner-news-title-wrapper .partner-news-title {
    color: #323232;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.375rem;
    word-break: break-word;
    padding-right: 5px;
    margin-right: 10px;
  }
  
  .partner-news-header .partner-news-title-wrapper .cards-results {
    padding: 4px 20px 4px 0;
    border-right: 1px solid ${borderColor};
    max-height: 3.9375rem;
    color: #505050;
    font-size: .875rem;
    line-height: 1.3125rem;
    margin-right: 20px;
    min-width: 80px;
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news-header .partner-news-title-wrapper .cards-results {
      border-right: none;
      margin-right: 0;
      padding-right: 0;
      text-align: right;
    }
  }
  
  @media screen and (max-width: 1200px) {
    .partner-news-header .partner-news-sort-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  
  .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile {
    min-height: 34px;
    background-color: #f4f4f4;
    color: #323232;
    border: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    min-width: 89px;
    max-width: 100%;
    margin-bottom: 10px;
    padding: 0 0 0 11px;
    border-radius: 5px;
    font-size: .875rem;
    line-height: 1.875rem;
    font-weight: 700;
    word-break: break-word;
    text-align: left;
    text-transform: capitalize;
  }
  
  .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile:hover {
    cursor: pointer;
  }
  
 .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile-icon {
    display: block;
    min-width: 18px;
    width: 18px;
    height: 18px;
    margin-right: 8px;
    background-color: red;
    background: no-repeat url(/img/icons/filters.svg) 0 0;
  }
  
  .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile-title {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 7px;
    overflow: hidden;
  }
  
  .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile-total {
    display: block;
    max-width: 40%;
    padding-left: 8px;
    padding-right: 7px;
    border-left: 1px solid #505050;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .partner-news-header .partner-news-sort-wrapper .filters-btn-mobile-total.hidden {
    display: none;
  }
  
  @media screen and (min-width: 1201px) {
    .partner-news-header .picker-wrapper {
      margin-top: 11px;
    }
  }

  .partner-news-collection {
    display: grid;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
    gap: 32px;
  }
  
  .partner-news-collection .news-card-wrapper {
    min-height: 380px;
    width: 378px;
    max-width: 100%;
    position: relative;
  }
  
  .partner-news-collection .no-results {
    padding-top: 20px;
    width: 100%;
    color: #505050;
    text-align: center;
  }
  
  .partner-news-collection .no-results .no-results-title {
    font-size: 1.125rem;
    line-height: 1.6875rem;
    font-weight: 400;
    margin-bottom: 20px;
  }
  
  .partner-news-collection .no-results .no-results-description {
    font-size: .875rem;
    line-height: 1.3125rem;
  }
  
  .progress-circle-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
  }
  
  .pagination-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    padding-top: 20px;
  }
  
  @media screen and (max-width: 1200px) {
    .pagination-wrapper {
      justify-content: center;
    }
  }
  
  .pagination-wrapper > * {
    padding: 5px 0;
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
    font-weight: 700;
  }
  
  .pagination-wrapper .next-btn {
    padding-left: 10px;
    font-weight: 700;
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
    color: #e5e5e5;
  }
  
  .pagination-wrapper .page-btn.selected {
    background-color: #e5e5e5;
    border-radius: 50%;
  }
  
  .pagination-wrapper .total-results {
    font-weight: 700;
  }
  
  @media screen and (max-width: 1200px) {
    .pagination-wrapper .total-results {
      display: none;
    }
  }
 
  .filters-wrapper-mobile-content {
    position: fixed;
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    height: 100vh;
    display: none;
  }
  
  .filters-wrapper-mobile-content .filters-mobile-header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px 12px;
    border-bottom: 1px solid #eaeaea;
    padding: 16px 24px 16px 16px;
  }
  
  .filters-wrapper-mobile-content .filters-mobile-header .back-btn {
    width: 32px;
    height: 32px;
    margin-right: 13px;
    font-size: 0;
    line-height: 0;
    border: none;
    border-radius: 50%;
    background: transparent url(/img/icons/back.svg) no-repeat 50% 50%;
    background-position: contain;
    outline: 0;
  }
  
  .filters-wrapper-mobile-content .filters-mobile-header .filters-mobile-header-title {
    font-size: 1rem;
    line-height: 1.1875rem;
    font-weight: 400;
    color: #505050;
    font-style: normal;
    word-break: break-word;
    text-align: left;
  }
  
  .filters-mobile-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .filters-mobile-content .filter-mobile-btn {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    border-bottom: 1px solid #eaeaea;
    padding: 16px 24px;
  }
  
  .filters-mobile-content .filter-mobile-btn:hover {
    cursor: pointer;
  }
  
  .filters-mobile-content .filter-mobile-btn .label {
    font-size: 1rem;
    line-height: 1.1875rem;
    font-weight: 700;
    color: #505050;
    word-break: break-word;
    text-align: left;
    text-transform: capitalize;
    text-decoration: none;
  }
  
  .filters-mobile-content .filter-mobile-btn .filter-mobile-btn-icons {
    display: flex;
    align-items: center;
  }
  
  .filters-mobile-content .filter-mobile-btn .filter-mobile-btn-icons i {
    transform: rotate(-90deg);
    color: #d3d3d3;
  }
  
  .filters-wrapper-mobile-content .filters-mobile-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eaeaea;
    padding: 16px 24px;
  }
  
  .filters-mobile-footer-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .filters-mobile-footer-buttons .clear-all-btn-mobile {
    border: none;
    background-color: transparent;
    color: ${blueColor};
    font-size: .875rem;
    line-height: 1rem;
    height: 1.2rem;
    font-weight: 700;
    word-break: break-word;
    margin-right: 17px;
    cursor: pointer;
    padding: 0;
    border-bottom: 2px solid transparent;
  }
  
  .filters-mobile-footer-buttons .clear-all-btn-mobile:focus {
    border-color: ${blueColor};
  }
`;

export var newsCardStyles = css`
  .news-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 380px;
  }
  
  .news-card:hover {
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
    transition: box-shadow .3s ease-in-out;
  }
  
  .news-card .card-header {
    min-height: 192px;
    max-height: 192px;
    background-color: #323232;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;
  }
  
  .news-card:hover .card-header:after {
    opacity: 1;
  }
  
  .news-card .card-header:after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 0;
    background-color: rgba(0,0,0,.35);
    opacity: 0;
    transition: opacity .3s ease-in-out;
  }
  
  .news-card .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    padding: 16px 16px 20px;
    height: 100%;
  }
  
  .news-card .card-title {
    color: #323232;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.375rem;
    word-break: break-word;
    max-height: 2.75rem;
    margin: 0 0 7px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
  
  .news-card .card-description {
    color: #505050;
    font-size: .875rem;
    line-height: 1.3125rem;
    font-weight: 400;
    word-break: break-word;
    margin: 0 0 14px;
    max-height: 3.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
  }
  
  .news-card .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .news-card .card-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .875rem;
    line-height: 1.063rem;
    font-weight: 700;
    min-width: 60px;
    max-width: 100%;
    height: 28px;
    max-height: 32px;
    margin-left: 16px;
    padding-left: 14px;
    padding-right: 14px;
    text-decoration: none;
    color: #222222;
    border: 2px solid #222222;
    border-radius: 16px;
    background-color: #ffffff00;
    cursor: pointer;
    transition: border-color .3s ease-in-out,background-color .3s ease-in-out;
  }
  
  .news-card .card-btn:hover {
    text-decoration: none;
    border-color: #222222;
    background-color: #222222;
    color: #ffffff00;
  }
  
  .news-card .card-date {
    color: #747474;
    font-size: .875rem;
    line-height: 1.3125rem;
    word-break: break-word;
    max-height: 3.9375rem;
    padding: 0;
  }
`;
