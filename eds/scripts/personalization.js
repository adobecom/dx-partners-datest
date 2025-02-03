import {
  isMember,
  getNodesByXPath,
}
  from './utils.js';
import {
  PAGE_PERSONALIZATION_PLACEHOLDERS,
  GNAV_PERSONALIZATION_PLACEHOLDERS,
  PERSONALIZATION_MARKER,
  PROCESSED_MARKER,
  PERSONALIZATION_HIDE,
  PERSONALIZATION_CONDITIONS,
  MAIN_NAV_PERSONALIZATION_CONDITIONS,
  PROFILE_PERSONALIZATION_ACTIONS, COOKIE_OBJECT, LEVEL_CONDITION,
} from './personalizationConfigDX.js';

function personalizePlaceholders(placeholders, context = document) {
  Object.entries(placeholders).forEach(([key, value]) => {
    const placeholderValue = COOKIE_OBJECT[key];
    getNodesByXPath(value, context).forEach((el) => {
      if (!placeholderValue) {
        el.remove();
        return;
      }
      el.textContent = el.textContent.replace(`$${key}`, placeholderValue);
      el.classList.add(`${key.toLowerCase()}-placeholder`);
    });
  });
}

function shouldHide(conditions, conditionsConfig = PERSONALIZATION_CONDITIONS) {
  return conditions.every((condition) => {
    const conditionLevel = condition.startsWith(LEVEL_CONDITION) ? condition.split('-').pop() : '';
    return conditionLevel
      ? !conditionsConfig[LEVEL_CONDITION](conditionLevel) : !conditionsConfig[condition];
  });
}

// eslint-disable-next-line max-len
function hideElement(element, conditions, conditionsConfig = PERSONALIZATION_CONDITIONS, remove = false) {
  if (!element || !conditions?.length) return;
  if (shouldHide(conditions, conditionsConfig)) {
    if (remove) {
      element.remove();
    } else {
      element.classList.add(PERSONALIZATION_HIDE);
    }
  }
}

function hideSections(page) {
  const sections = Array.from(page.getElementsByClassName('section-metadata'));
  sections.forEach((section) => {
    let hide = false;
    Array.from(section.children).forEach((child) => {
      const col1 = child.firstElementChild;
      const col2 = child.lastElementChild;
      if (col1?.textContent !== 'style' || !col2?.textContent.includes(PERSONALIZATION_MARKER)) return;
      const conditions = col2?.textContent?.split(',').map((text) => text.trim());
      hide = shouldHide(conditions);
    });
    if (!hide) return;
    const parent = section.parentElement;
    Array.from(parent.children).forEach((el) => {
      el.remove();
    });
  });
}

function personalizePage(page) {
  const blocks = Array.from(page.getElementsByClassName(PERSONALIZATION_MARKER));
  blocks.forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions);
    el.classList.remove(PERSONALIZATION_MARKER);
    el.classList.add(`${PERSONALIZATION_MARKER}${PROCESSED_MARKER}`);
  });
  hideSections(page);
}

export function applyPagePersonalization() {
  const main = document.querySelector('main') ?? document;
  personalizePlaceholders(PAGE_PERSONALIZATION_PLACEHOLDERS, main);
  personalizePage(main);
}

function processGnavElements(elements) {
  const regex = /(?<=\().*?(?=\))/g;
  return elements.map((el) => {
    const matches = el.textContent.match(regex);
    if (!matches?.length) return {};
    const match = matches[0];
    el.textContent = el.textContent.replace(`(${match})`, '');
    const conditions = match.split(',').map((condition) => condition.trim());
    if (!conditions.length) return {};
    return { el, conditions };
  });
}

function personalizeDropdownElements(profile) {
  const personalizationXPath = `//*[contains(text(), "${PERSONALIZATION_MARKER}")]`;
  const elements = getNodesByXPath(personalizationXPath, profile);
  const processedElements = processGnavElements(elements);
  processedElements.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;
    const action = conditions.pop();
    PROFILE_PERSONALIZATION_ACTIONS[action]?.(el);
  });
}

function personalizeMainNav(gnav) {
  const personalizationXPath = `//*[contains(text(), "${PERSONALIZATION_MARKER}") and not(ancestor::*[contains(@class, "profile")])]`;
  const elements = getNodesByXPath(personalizationXPath, gnav);
  const processedElements = processGnavElements(elements);
  const separatorSelector = 'h5';

  processedElements.forEach(({ el, conditions }) => {
    if (!el || !conditions) return;

    if (el.tagName.toLowerCase() === separatorSelector) {
      // main nav dropdown menu group separators
      const { nextElementSibling } = el;
      const hide = shouldHide(conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS);
      if (nextElementSibling?.tagName.toLowerCase() !== separatorSelector && hide) {
        nextElementSibling.remove();
      }
    }

    const wrapperEl = el.closest('h2, li');
    hideElement(wrapperEl || el, conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS, true);
  });

  // link group blocks
  const linkGroups = gnav.querySelectorAll('.link-group.partner-personalization');
  Array.from(linkGroups).forEach((el) => {
    const conditions = Object.values(el.classList);
    hideElement(el, conditions, MAIN_NAV_PERSONALIZATION_CONDITIONS, true);
  });
}

function personalizeProfile(gnav) {
  const profile = gnav.querySelector('.profile');
  personalizePlaceholders(GNAV_PERSONALIZATION_PLACEHOLDERS, profile);
  personalizeDropdownElements(profile);
}

export function applyGnavPersonalization(gnav) {
  if (!isMember()) return gnav;
  const importedGnav = document.importNode(gnav, true);
  personalizeMainNav(importedGnav);
  personalizeProfile(importedGnav);
  return importedGnav;
}
