export interface CmsTeamMember {
  id: number;
  documentId: string;
  name: string;
  title: string;
  bio: string;
  education: string | null;
  photo: { url: string } | null;
  linkedInUrl: string | null;
  isManagement: boolean;
  isBoard: boolean;
  order: number;
}
