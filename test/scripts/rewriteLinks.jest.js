/**
 * @jest-environment jsdom
 */
import { getUpdatedHref, rewriteLinks } from '../../eds/scripts/rewriteLinks.js';
import { getConfig } from '../../eds/blocks/utils/utils.js';
import { partnerIsSignedIn } from '../../eds/scripts/utils.js';

jest.mock('../../eds/blocks/utils/utils.js', () => ({ getConfig: jest.fn() }));
jest.mock('../../eds/scripts/utils.js', () => ({ partnerIsSignedIn: jest.fn(() => ({ 'partner name': { company: 'test' } })) }));

// Mock DOM
document.body.innerHTML = `
  <a href="https://partners.adobe.com">Partner prod Link</a>
`;

describe('Test rewrite links', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({ env: { name: 'stage' } });
    partnerIsSignedIn.mockReturnValue({ 'partner name': { company: 'test' } });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/cn/test-path',
        href: 'http://example.com/cn/test-path',
        assign: jest.fn(),
        reload: jest.fn(),
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    document.body.innerHTML = `
  <a href="https://partners.adobe.com">Partner prod Link</a>
`;
  });

  test('should  update partners prod link when on non prod', () => {
    rewriteLinks(document);
    const links = document.querySelectorAll('a');
    expect(links[0].href).toBe('https://partners.stage.adobe.com/');
  });

  test(
    'should update partners prod domain when not logged in when on stage,',
    () => {
      partnerIsSignedIn.mockReturnValue(null);

      rewriteLinks(document);
      const links = document.querySelectorAll('a');
      expect(links[0].href).toBe('https://partners.stage.adobe.com/');
    },
  );
});
