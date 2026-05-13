/**
 * Leadership & Board Team Member Data
 * Source: docs/reference/website-copy-deck.docx - Section 2.2
 */

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  education?: string;
  photoUrl?: string;
  linkedInUrl?: string;
  category: 'management' | 'board';
  order: number;
}

export interface TeamContent {
  hero: {
    title: string;
    description: string;
  };
  managementTeam: TeamMember[];
  board: TeamMember[];
}

export const teamContent: TeamContent = {
  hero: {
    title: 'Leadership & Board',
    description:
      'AutoCap Group is led by a team with deep experience in M&A, company building, automotive aftermarket, and operational execution. Our board brings additional expertise in investment, governance, and strategic growth.',
  },
  managementTeam: [
    {
      id: 'david-knape',
      name: 'David Knape',
      title: 'CEO & Co-Founder',
      bio: "Serial entrepreneur with extensive experience in company building, finance, acquisition strategy, and brand development. Previously CEO of a Nasdaq First North-listed company. Has built and managed investments across e-commerce, FMCG, and technology. David leads AutoCap's overall strategy, capital structure, and stakeholder relationships.",
      education: 'B.Sc. Business Economics, M.Sc. Marketing',
      photoUrl: '/images/David%20Knape.webp',
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'management',
      order: 1,
    },
    {
      id: 'niklas-noren',
      name: 'Niklas Norén',
      title: 'CFO',
      bio: "Seasoned financial executive with two decades of experience as CFO and Group Controller across listed companies, PE-backed groups, and high-growth platforms. Track record includes building financial reporting infrastructure, preparing companies for PE exit (Adven/EQT), and coordinating M&A integration (Eltel Networks, Cybercom). Previous roles span IBM, Nobina, Eniro, and JNE Invest. Niklas leads AutoCap's financial operations, reporting, and banking relationships.",
      education:
        'M.Sc. Business Economics (Civilekonom), Stockholm University. Graduate studies at HEC Lausanne.',
      photoUrl: '/images/Niklas%20Noren.webp',
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'management',
      order: 2,
    },
    {
      id: 'nicklas-knape',
      name: 'Nicklas Knape',
      title: 'COO & Head of M&A',
      bio: "Over fifteen years in the Nordic tire and automotive aftermarket. Career spans Pirelli, Goodyear (managing key Nordic accounts), and Gundlach Automotive (European aftermarket responsibility for Volvo Cars, Polestar, Ford, and Nio). Nicklas leads AutoCap's acquisition pipeline, operational integration, and supplier relationships - combining deep industry knowledge with hands-on commercial execution.",
      education: 'B.Sc. Business Economics',
      photoUrl: '/images/thumbnail_IMG_1522.webp',
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'management',
      order: 3,
    },
  ],
  board: [
    {
      id: 'gustav-berggren',
      name: 'Gustav Berggren',
      title: 'Chairman of the Board',
      bio: 'Entrepreneur with a background in financing, property management, M&A, and real estate development across residential and commercial segments. Active investor and company builder with multiple board positions.',
      education: 'B.Sc. Business Economics',
      photoUrl: undefined, // TODO: Add professional headshot
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'board',
      order: 1,
    },
    {
      id: 'thomas-petren',
      name: 'Thomas Petrén',
      title: 'Board Member & Partner',
      bio: 'Owner and CEO of Seved Invest AB. Entrepreneurial background building and supporting multiple companies, including the publicly listed FMCG group Humble Group.',
      education: undefined,
      photoUrl: '/images/Thomas%20Petr%C3%A9n.webp',
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'board',
      order: 2,
    },
    {
      id: 'mats-johansson',
      name: 'Mats Johansson',
      title: 'Partner & Board Advisor',
      bio: 'Entrepreneur and investor based in Falköping. Former Partner at PwC with specialist expertise in corporate structuring and tax. Extensive board experience and co-owner of companies across property, IT, and agriculture.',
      education: undefined,
      photoUrl: undefined, // TODO: Add professional headshot
      linkedInUrl: undefined, // TODO: Add LinkedIn URL
      category: 'board',
      order: 3,
    },
  ],
};
