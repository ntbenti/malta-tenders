export interface ScrapedTender {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  description?: string;
  summary?: string;
  contractingAuthority: string;
  publishedOnBehalfOf?: string;
  procurementType?: string;
  procedureType?: string;
  cpvCodes?: string[];
  estimatedValue?: number;
  currency?: string;
  publicationDate?: Date | null;
  submissionDeadline?: Date | null;
  openingDate?: Date | null;
  status: string;
  documents?: {
    title: string;
    url: string;
    fileType?: string;
    fileSize?: number;
  }[];
}

export abstract class BaseScraper {
  protected id: string;
  protected name: string;
  protected baseUrl: string;

  constructor(id: string, name: string, baseUrl: string) {
    this.id = id;
    this.name = name;
    this.baseUrl = baseUrl;
  }

  abstract fetchTenders(): Promise<ScrapedTender[]>;

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
