export interface CmsTeamMember {
  id: number;
  documentId: string;
  name: string;
  title: string;
  bio: string;
  education: string | null;
  photo: { url: string } | null;
  linkedInUrl: string | null;
  category: 'management' | 'board';
  order: number;
}
