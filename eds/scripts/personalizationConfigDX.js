import { processPrimaryContact } from './personalizationUtils.js';
import {
  getPartnerDataCookieObject,
  isMember,
  partnerIsSignedIn,
  signedInNonMember,
} from './utils.js';
import { PARTNER_LEVEL, PROGRAM } from '../blocks/utils/dxConstants.js';

export const PAGE_PERSONALIZATION_PLACEHOLDERS = { firstName: '//*[contains(text(), "$firstName")]' };
export const GNAV_PERSONALIZATION_PLACEHOLDERS = {
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]',
};

export const LEVEL_CONDITION = 'partner-level';
export const PERSONALIZATION_MARKER = 'partner-personalization';
export const PROCESSED_MARKER = '-processed';
export const PERSONALIZATION_HIDE = 'personalization-hide';
export const COOKIE_OBJECT = getPartnerDataCookieObject(PROGRAM);

export const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-level': (level) => PARTNER_LEVEL === level,
};

export const MAIN_NAV_PERSONALIZATION_CONDITIONS = { ...PERSONALIZATION_CONDITIONS };

export const PROFILE_PERSONALIZATION_ACTIONS = {
  'partner-primary': processPrimaryContact,
};
