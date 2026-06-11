/**
 * Brand Colors & Design Tokens
 * Source: docs/reference/website-copy-deck.docx
 */

export const COLORS = {
  // Primary
  autocapRed: '#C8102E',
  nordicBlack: '#1C1C1E',

  // Backgrounds
  birch: '#D8E4DC', // Entrepreneurs
  fjord: '#C9D8E8', // Investors
  stone: '#E4E2DE', // Portfolio
  ember: '#F0DADA', // News
  dusk: '#EDE4D8', // About
  linenWhite: '#F5F0EB', // Light sections
} as const;

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    submenu: [
      { label: 'Company Overview', href: '/about' },
      { label: 'Our Story', href: '/about/story' },
      { label: 'Leadership & Board', href: '/about/team' },
    ],
  },
  { label: 'Our Portfolio', href: '/portfolio' },
  {
    label: 'Entrepreneurs',
    href: '/entrepreneurs',
    submenu: [
      { label: 'Overview', href: '/entrepreneurs' },
      { label: 'How It Works', href: '/entrepreneurs/process' },
      { label: 'Why AutoCap Group', href: '/entrepreneurs/why' },
      { label: 'Contact', href: '/entrepreneurs/contact' },
    ],
  },
  { label: 'Investors', href: '/investors' },
  { label: 'News & Media', href: '/news' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Contact', href: '/contact' },
] as const;

export const COMPANY_INFO = {
  name: 'AutoCap Group Sweden AB',
  address: 'Nybrogatan 7, Stockholm',
  tagline: 'The Nordic Tire Services Platform',
  email: 'kontakt@autocapgroup.se',
} as const;
