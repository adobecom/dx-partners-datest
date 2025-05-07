import { processPrimaryContact, processSalesAccess } from './personalizationUtils.js';
import {
  getPartnerDataCookieObject,
  hasSalesCenterAccess,
  isAdminUser,
  isMember,
  partnerIsSignedIn,
  signedInNonMember,
  isSPPOnly,
  isTPPOnly,
  isSPPandTPP,
} from './utils.js';
import { PARTNER_LEVEL, PROGRAM } from '../blocks/utils/dxConstants.js';

export const PERSONALIZATION_PLACEHOLDERS = {
  firstName: '//*[contains(text(), "$firstName")]',
  company: '//*[contains(text(), "$company")]',
  level: '//*[contains(text(), "$level")]',
};

export const LEVEL_CONDITION = 'partner-level';
export const PERSONALIZATION_MARKER = 'partner-personalization';
export const PROCESSED_MARKER = '-processed';

export const PERSONALIZATION_CONDITIONS = {
  'partner-not-member': signedInNonMember(),
  'partner-not-signed-in': !partnerIsSignedIn(),
  'partner-all-levels': isMember(),
  'partner-sales-access': hasSalesCenterAccess(),
  'partner-level': (level) => PARTNER_LEVEL === level,
  'partner-spp-member': isSPPOnly(),
  'partner-tpp-member': isTPPOnly(),
  'partner-spp-tpp-member': isSPPandTPP(),
  'partner-admin': isAdminUser(),
};

export const PROFILE_PERSONALIZATION_ACTIONS = {
  'partner-primary': processPrimaryContact,
  'partner-sales-access': processSalesAccess,
};
