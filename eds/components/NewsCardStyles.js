import { getLibs } from '../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;

// eslint-disable-next-line import/prefer-default-export
export const newsCardStyles = css`
  .news-card * {
    box-sizing: border-box;
  }
  
  .news-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 400px;
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
    color: #ffffff;
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
