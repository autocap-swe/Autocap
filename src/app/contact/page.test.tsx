/**
 * Contact Page integration test — AC-003.
 *
 * Verifies the page calls `getContactContent()` exactly once and renders
 * all CMS-sourced text regions (hero, routing, general inquiry, company info).
 */

import { render, screen } from '@testing-library/react';
import ContactPage from './page';
import { mockCmsContactPageFull } from '@/lib/cms/__mocks__/contact-page';
import { contactMapper } from '@/lib/cms/contact/mapper';

jest.mock('@/lib/cms/contact', () => ({
  getContactContent: jest.fn(),
}));

import { getContactContent } from '@/lib/cms/contact';
const mockedGetContactContent = getContactContent as jest.MockedFunction<typeof getContactContent>;

const mockContent = contactMapper(mockCmsContactPageFull as Parameters<typeof contactMapper>[0]);

beforeEach(() => {
  mockedGetContactContent.mockResolvedValue(mockContent);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ContactPage — AC-003', () => {
  it('calls getContactContent exactly once', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(mockedGetContactContent).toHaveBeenCalledTimes(1);
  });

  it('renders the hero title from CMS', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(
      screen.getByRole('heading', { level: 1, name: mockCmsContactPageFull.heroTitle })
    ).toBeInTheDocument();
  });

  it('renders the hero description from CMS', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(screen.getByText(mockCmsContactPageFull.heroDescription)).toBeInTheDocument();
  });

  it('renders the routing text from CMS', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(screen.getByText(mockCmsContactPageFull.routingText)).toBeInTheDocument();
  });

  it('renders the general inquiry title from CMS', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(
      screen.getByRole('heading', { level: 2, name: mockCmsContactPageFull.generalInquiryTitle })
    ).toBeInTheDocument();
  });

  it('renders the company email from CMS', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(screen.getByText(mockCmsContactPageFull.companyEmail)).toBeInTheDocument();
  });

  it('renders the specialized routing cards (static)', async () => {
    const Page = await ContactPage();
    render(Page);
    expect(screen.getByRole('heading', { name: /for investors/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /for workshop owners/i })).toBeInTheDocument();
  });
});
