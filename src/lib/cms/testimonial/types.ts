export interface CmsTestimonial {
  id: number;
  documentId: string;
  workshopName: string;
  city: string;
  ownerName: string;
  quote: string;
  keyFact: string;
  ownerPhoto: { url: string } | null;
  acquisitionDate: string;
  order: number;
}
