export interface TenderDocument {
  title: string;
  url: string;
  fileType?: string;
  fileSize?: number;
}

export interface ScrapedTender {
  id?: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  description: string;
  contractingAuthority: string;
  publishedOnBehalfOf?: string;
  procurementType: string;
  procedureType: string;
  cpvCodes: string[];
  estimatedValue?: number;
  currency?: string;
  submissionDeadline: Date;
  openingDate?: Date;
  publicationDate: Date;
  status: string;
  documents: TenderDocument[];
  scrapedAt?: string;
}

export interface Tender extends Omit<ScrapedTender, 'id'> {
  id: string;
}
