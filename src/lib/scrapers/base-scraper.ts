import { z } from 'zod';

const TenderDocumentSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  fileType: z.string().optional(),
  fileSize: z.number().optional()
});

export const ScrapedTenderSchema = z.object({
  id: z.string().optional(),
  sourceId: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  title: z.string(),
  description: z.string(),
  contractingAuthority: z.string(),
  publishedOnBehalfOf: z.string().optional(),
  procurementType: z.string(),
  procedureType: z.string(),
  cpvCodes: z.array(z.string()).default([]),
  estimatedValue: z.number().optional(),
  currency: z.string().optional(),
  submissionDeadline: z.date(),
  openingDate: z.date().optional(),
  publicationDate: z.date(),
  status: z.string(),
  documents: z.array(TenderDocumentSchema).default([]),
  scrapedAt: z.string().optional()
});

export type ScrapedTender = z.infer<typeof ScrapedTenderSchema>;
export type TenderDocument = z.infer<typeof TenderDocumentSchema>;

export interface TenderDetails {
  description?: string;
  procurementType?: string;
  procedureType?: string;
  documents?: TenderDocument[];
}

export abstract class BaseScraper {
  constructor(
    private readonly id: string,
    private readonly name: string,
    protected readonly baseUrl: string
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  abstract fetchTenders(): Promise<ScrapedTender[]>;

  protected async fetchTenderDetails(url: string): Promise<TenderDetails> {
    // Default implementation returns empty details
    return {
      description: 'No description available',
      procurementType: 'Not specified',
      procedureType: 'Not specified',
      documents: []
    };
  }
}
