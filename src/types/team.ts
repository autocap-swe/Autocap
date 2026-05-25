export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  education?: string;
  photoUrl?: string;
  linkedInUrl?: string;
  category: 'management' | 'board';
  order: number;
}
