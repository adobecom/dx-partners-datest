import {getLibs} from "../../scripts/utils.js";
const miloLibs = getLibs();
const { css } = await import (`${miloLibs}/deps/lit-all.min.js`);

const lightGrey = css`#e5e5e5`;
const textColor = css`#2c2c2c`;

export var newsCardStyles = css`
  .news-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid ${lightGrey};
    border-radius: 4px;
    overflow: hidden;
    min-width: 225px;
    width: 275px;
    max-width: 100%;
    height: 385px;
  }
  
  .news-card:hover {
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
    transition: box-shadow .3s ease-in-out;
  }
  
  .news-card .card-header {
    min-height: 192px;
    max-height: 192px;
    background-color: ${textColor};
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
  
  .news-card .card-description {
    max-height: 3.9375rem;
    font-size: .875rem;
    line-height: 1.3125rem;
    font-weight: 400;
  }
  
  .news-card .card-description {
    word-break: break-word;
    margin: 0 0 14px;
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
    font-size: .8235rem;
    line-height: .9375rem;
    font-weight: 700;
    min-width: 60px;
    max-width: 100%;
    height: 28px;
    max-height: 32px;
    margin-left: 16px;
    padding-left: 14px;
    padding-right: 14px;
    text-decoration: none;
    border: 2px solid #505050;
    color: ${textColor};
    border-radius: 16px;
    background-color: #fff;
    cursor: pointer;
    transition: border-color .3s ease-in-out,background-color .3s ease-in-out;
  }
  
  .news-card .card-btn:hover {
    text-decoration: none!important;
    border-color: ${textColor};
    background-color: ${textColor};
    color: #fff;
  }
  
  .news-card .card-date {
    word-break: break-word;
    max-height: 3.9375rem;
    padding: 0;
    font-size: .875rem;
    line-height: 1.3125rem;
    font-weight: 400;
  }
`;
